import { createSanityWriteClient } from "../sanity/write-client.js";
import { slugify } from "../utils/slugs.js";
import { validatePublishBlogInput } from "./validate-post.js";
function makeKey() {
    return Math.random().toString(36).slice(2, 12);
}
function blockSpan(text) {
    return {
        _key: makeKey(),
        _type: "span",
        marks: [],
        text,
    };
}
function textBlock(text, style = "normal") {
    return {
        _key: makeKey(),
        _type: "block",
        style,
        markDefs: [],
        children: [blockSpan(text)],
    };
}
function listBlock(text, listItem) {
    return {
        _key: makeKey(),
        _type: "block",
        style: "normal",
        listItem,
        level: 1,
        markDefs: [],
        children: [blockSpan(text)],
    };
}
export function markdownToPortableText(markdown) {
    const lines = markdown
        .replace(/\r\n/g, "\n")
        .split("\n")
        .map((line) => line.trimEnd());
    const blocks = [];
    let paragraph = [];
    const flushParagraph = () => {
        const text = paragraph.join(" ").trim();
        if (text) {
            blocks.push(textBlock(text));
        }
        paragraph = [];
    };
    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) {
            flushParagraph();
            continue;
        }
        if (line.startsWith("## ")) {
            flushParagraph();
            blocks.push(textBlock(line.slice(3).trim(), "h2"));
            continue;
        }
        if (line.startsWith("### ")) {
            flushParagraph();
            blocks.push(textBlock(line.slice(4).trim(), "h3"));
            continue;
        }
        if (line.startsWith("> ")) {
            flushParagraph();
            blocks.push(textBlock(line.slice(2).trim(), "blockquote"));
            continue;
        }
        if (/^- /.test(line)) {
            flushParagraph();
            blocks.push(listBlock(line.slice(2).trim(), "bullet"));
            continue;
        }
        if (/^\d+\.\s/.test(line)) {
            flushParagraph();
            blocks.push(listBlock(line.replace(/^\d+\.\s/, "").trim(), "number"));
            continue;
        }
        paragraph.push(line);
    }
    flushParagraph();
    if (blocks.length === 0) {
        throw new Error("bodyMarkdown did not produce any content blocks");
    }
    return blocks;
}
async function uploadRemoteImage(env, imageUrl) {
    const response = await fetch(imageUrl);
    if (!response.ok) {
        throw new Error(`Unable to fetch cover image: ${response.status}`);
    }
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const extension = contentType.split("/")[1]?.replace(/[^a-zA-Z0-9]/g, "") || "jpg";
    return createSanityWriteClient(env).assets.upload("image", buffer, {
        contentType,
        filename: `genio-cover.${extension}`,
    });
}
async function createOrUpdateAuthor(env, name, role) {
    const client = createSanityWriteClient(env);
    const authorSlug = slugify(name);
    const authorId = `author-${authorSlug}`;
    await client.createOrReplace({
        _id: authorId,
        _type: "author",
        name,
        role,
        slug: {
            _type: "slug",
            current: authorSlug,
        },
    });
    return authorId;
}
async function createOrUpdateCategory(env, title) {
    const client = createSanityWriteClient(env);
    const categorySlug = slugify(title);
    const categoryId = `category-${categorySlug}`;
    await client.createOrReplace({
        _id: categoryId,
        _type: "category",
        title,
        slug: {
            _type: "slug",
            current: categorySlug,
        },
    });
    return categoryId;
}
async function findExistingPost(env, documentId, slug) {
    const client = createSanityWriteClient(env);
    if (documentId) {
        return client.fetch(`*[_type == "post" && _id == $documentId][0]{_id, publishedAt, oldSlugs, "slug": slug.current}`, { documentId });
    }
    return client.fetch(`*[_type == "post" && slug.current == $slug][0]{_id, publishedAt, oldSlugs, "slug": slug.current}`, { slug });
}
function buildOldSlugs(existing, nextSlug) {
    const oldSlugs = new Set(existing?.oldSlugs || []);
    if (existing?.slug && existing.slug !== nextSlug) {
        oldSlugs.add(existing.slug);
    }
    return Array.from(oldSlugs);
}
async function doPublishBlogPost(env, input) {
    const client = createSanityWriteClient(env);
    const body = markdownToPortableText(input.bodyMarkdown);
    const imageAsset = await uploadRemoteImage(env, input.coverImageUrl);
    const authorId = await createOrUpdateAuthor(env, input.authorName, input.authorRole);
    const categoryId = await createOrUpdateCategory(env, input.category);
    const existing = await findExistingPost(env, input.documentId, input.slug);
    const documentId = input.documentId || existing?._id || `post-${input.slug}`;
    const publishedAt = existing?.publishedAt || input.publishedAt;
    const oldSlugs = buildOldSlugs(existing, input.slug);
    await client.createOrReplace({
        _id: documentId,
        _type: "post",
        title: input.title,
        slug: {
            _type: "slug",
            current: input.slug,
        },
        oldSlugs,
        excerpt: input.excerpt,
        postType: input.postType,
        category: {
            _type: "reference",
            _ref: categoryId,
        },
        featured: input.featured,
        author: {
            _type: "reference",
            _ref: authorId,
        },
        tags: input.tags,
        publishedAt,
        coverImage: {
            _type: "image",
            alt: input.coverImageAlt,
            asset: {
                _type: "reference",
                _ref: imageAsset._id,
            },
        },
        body,
        seo: input.seo,
    });
    return {
        authorId,
        categoryId,
        documentId,
        slug: input.slug,
        publishedAt,
    };
}
export async function publishBlogPost({ env, input, }) {
    return doPublishBlogPost(env, validatePublishBlogInput(input));
}
