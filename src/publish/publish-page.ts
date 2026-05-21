import { createSanityWriteClient } from "../sanity/write-client.js";
import type {
  PublishPageInput,
  PublishPageResult,
  ValidatedPublishPageInput,
} from "../types/index.js";
import { slugify } from "../utils/slugs.js";
import { markdownToPortableText } from "./publish-post.js";
import { validatePublishPageInput } from "./validate-page.js";

async function uploadRemoteImage(env: NodeJS.ProcessEnv, imageUrl: string) {
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
    filename: `genio-page-cover.${extension}`,
  });
}

async function createOrUpdateAuthor(env: NodeJS.ProcessEnv, name: string, role: string) {
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

type ExistingPageLookup = {
  _id: string;
  oldSlugs?: string[];
  publishedAt?: string;
  slug?: string;
};

async function findExistingPage(
  env: NodeJS.ProcessEnv,
  documentId: string | undefined,
  slug: string,
) {
  const client = createSanityWriteClient(env);
  if (documentId) {
    return client.fetch<ExistingPageLookup | null>(
      `*[_type == "page" && _id == $documentId][0]{_id, publishedAt, oldSlugs, "slug": slug.current}`,
      { documentId },
    );
  }

  return client.fetch<ExistingPageLookup | null>(
    `*[_type == "page" && slug.current == $slug][0]{_id, publishedAt, oldSlugs, "slug": slug.current}`,
    { slug },
  );
}

function buildOldSlugs(existing: ExistingPageLookup | null, nextSlug: string) {
  const oldSlugs = new Set(existing?.oldSlugs || []);
  if (existing?.slug && existing.slug !== nextSlug) {
    oldSlugs.add(existing.slug);
  }

  return Array.from(oldSlugs);
}

async function doPublishPage(env: NodeJS.ProcessEnv, input: ValidatedPublishPageInput): Promise<PublishPageResult> {
  const client = createSanityWriteClient(env);
  const body = markdownToPortableText(input.bodyMarkdown);
  const imageAsset = await uploadRemoteImage(env, input.coverImageUrl);
  const authorId = await createOrUpdateAuthor(env, input.authorName, input.authorRole);
  const existing = await findExistingPage(env, input.documentId, input.slug);
  const documentId = input.documentId || existing?._id || `page-${input.slug}`;
  const publishedAt = existing?.publishedAt || input.publishedAt;
  const oldSlugs = buildOldSlugs(existing, input.slug);

  await client.createOrReplace({
    _id: documentId,
    _type: "page",
    title: input.title,
    slug: {
      _type: "slug",
      current: input.slug,
    },
    oldSlugs,
    excerpt: input.excerpt,
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
    documentId,
    slug: input.slug,
    publishedAt,
  };
}

export async function publishPage({
  env,
  input,
}: {
  env: NodeJS.ProcessEnv;
  input: PublishPageInput | unknown;
}) {
  return doPublishPage(env, validatePublishPageInput(input as PublishPageInput));
}
