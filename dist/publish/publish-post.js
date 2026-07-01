import { createSanityWriteClient } from "../sanity/write-client.js";
import { slugify } from "../utils/slugs.js";
import { markdownToPortableText } from "./portable-text.js";
import { validatePublishBlogInput } from "./validate-post.js";
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
    const body = await markdownToPortableText(input.bodyMarkdown, {
        uploadImage: async (imageUrl) => {
            const imageAsset = await uploadRemoteImage(env, imageUrl);
            return {
                _type: "reference",
                _ref: imageAsset._id,
            };
        },
    });
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
