# Genio Next.js Sanity Kit

Reusable Sanity, schema, SEO, and publishing primitives for Next.js sites.

This package provides a shared CMS layer that can be reused across multiple client projects.

## Package Structure

- `genio-nextjs-sanity-kit`
  Client-safe root exports for shared types, read-client helpers, schemas, blog/page queries, and SEO helpers.
- `genio-nextjs-sanity-kit/sanity`
  Sanity environment, read-client, and image URL helpers.
- `genio-nextjs-sanity-kit/sanity/server`
  Server-only write client helpers.
- `genio-nextjs-sanity-kit/site`
  Env-bound read-side adapters that expose blog, page, and image helpers without passing a client around on every call.
- `genio-nextjs-sanity-kit/site/server`
  Env-bound server adapters for publish routes and write-client access.
- `genio-nextjs-sanity-kit/blog`
  Blog queries and transforms.
- `genio-nextjs-sanity-kit/pages`
  Site page queries and transforms.
- `genio-nextjs-sanity-kit/publish`
  Server-only publishing helpers for posts and pages.
- `genio-nextjs-sanity-kit/schemas`
  Shared Sanity schema definitions.
- `genio-nextjs-sanity-kit/seo`
  Metadata and schema helpers.
- `genio-nextjs-sanity-kit/types`
  Shared TypeScript contracts.

## Build

```bash
npm install
npm run check
npm run build
```

`npm pack` will rebuild automatically through `prepack`.

## Install In Consuming Sites

Recommended install model for public GitHub consumption:

```json
{
  "dependencies": {
    "genio-nextjs-sanity-kit": "git+https://github.com/mukeshly/genio-nextjs-sanity-kit.git#v0.1.0"
  }
}
```

Then run:

```bash
npm install
```

Update by bumping the git tag in the consuming site's `package.json` and re-running `npm install`.

## Release Workflow

```bash
npm install
npm run check
npm run build
git tag v0.1.0
git push origin main --tags
```

For future releases:

```bash
npm run check
npm run build
git commit -am "Release v0.1.1"
git tag v0.1.1
git push origin main --tags
```

## Recommended Integration

### 1. Centralize Sanity env

```ts
import { getSanityEnvConfig, hasSanityConfig } from "genio-nextjs-sanity-kit/sanity";

export const sanityConfig = getSanityEnvConfig(process.env);
export const sanityConnected = hasSanityConfig(sanityConfig);
```

Use `createOptionalSanityReadClient(sanityConfig)` when the site should tolerate missing CMS env locally. Use `createSanityReadClient(sanityConfig)` when missing env should fail fast.

### 2. Replace local schema assembly

```ts
import { createSchemaTypes } from "genio-nextjs-sanity-kit/schemas";

export const schemaTypes = createSchemaTypes({
  includeCategory: false,
  includeSiteSettings: false,
});
```

Set `includeCategory` and `includeSiteSettings` to match the Sanity Studio shape used by the consuming app. Disable them when those document types are still managed locally or are not yet part of the shared schema.

### 3. Replace duplicated blog/page helpers

```ts
import { createSiteToolkit } from "genio-nextjs-sanity-kit/site";

const cms = createSiteToolkit({
  sanity: sanityConfig,
  defaultAuthorName: siteConfig.name,
  fallbackCategoryLabel: "Editorial",
  fallbackImage: siteConfig.defaultOgImage,
  locale: "en-US",
  reservedRootSlugs: ["about", "contact"],
  siteUrl: siteConfig.siteUrl,
  timeZone: "UTC",
});
```

That returns thin app-level helpers such as:

- `cms.getAllBlogPosts()`
- `cms.getBlogPostBySlug(slug)`
- `cms.getAllSitePages()`
- `cms.getSitePageBySlug(slug)`
- `cms.getBlogCoverImageUrl(post, { absoluteFallback: true })`
- `cms.getPageCoverImageUrl(page, { absoluteFallback: true })`
- `cms.getSanityImageUrl(source, width, height)`

The shared query layer and adapter support:

- read-client based fetching
- old-slug lookups
- reserved page slug filtering
- reading-time and published-date transforms
- image URL generation helpers
- legacy string categories and referenced category documents

### 4. Move publish routes to server-only imports

```ts
import { createPublishToolkit } from "genio-nextjs-sanity-kit/site/server";

const publish = createPublishToolkit(process.env);
```

That exposes:

- `publish.getPublishSecret()`
- `publish.isAuthorizedPublishRequest(request)`
- `publish.publishBlogPost(payload)`
- `publish.publishPage(payload)`
- `publish.createSanityWriteClient()`

`publishBlogPost(payload)` accepts an optional `postType` of `"article"` or `"pillar"` and defaults to `"article"` when omitted. Both post types are modeled as Sanity `post` documents. Use `publishPage(payload)` only for true standalone CMS pages.

Do not import server helpers from the package root. The root export surface is intentionally client-safe.

## Migrating Existing Posts

If a dataset already has `post` documents created before `postType` was added, backfill them before editors start updating old posts in Studio. The read-side blog queries already fall back to `"article"` for missing values, so the safe rollout order is:

1. Deploy the kit version that includes the read-side `postType` fallback.
2. Run the migration script against each Sanity dataset.
3. Confirm no posts are left without `postType`.
4. Let editors resume updating older posts normally.

Dry run:

```bash
SANITY_PROJECT_ID=... \
SANITY_DATASET=... \
SANITY_API_WRITE_TOKEN=... \
npm run migrate:post-type
```

Apply changes:

```bash
SANITY_PROJECT_ID=... \
SANITY_DATASET=... \
SANITY_API_WRITE_TOKEN=... \
npm run migrate:post-type -- --write
```

Verification query:

```groq
*[_type == "post" && !defined(postType)]{ _id, title }
```

## Notes

- The package expects `next`, `react`, `react-dom`, `next-sanity`, and `sanity` to be provided by the consuming app.
- The shared read-side blog helpers tolerate both legacy string categories and referenced category documents, which helps teams adopt the package before fully migrating their Studio schema.
- The shared publish helpers create category references. If a consuming app moves its publish route onto the shared publish flow, its Studio schema should also adopt the shared category document model.
