# Genio Next.js Sanity Kit

Reusable Sanity, schema, SEO, and publishing primitives for Next.js sites.

This package is intended to hold the shared CMS layer used by client sites such as `Noonvilla-website`.

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

## Install In Client Sites

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

## Recommended Noonvilla Integration

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

`Noonvilla-website` currently does not expose category or site settings types in Studio, so those flags keep the generated schema aligned with the existing app shape.

### 3. Replace duplicated blog/page helpers

```ts
import { createSiteToolkit } from "genio-nextjs-sanity-kit/site";

const cms = createSiteToolkit({
  sanity: sanityConfig,
  defaultAuthorName: siteConfig.name,
  fallbackCategoryLabel: "Noon Villa Guide",
  fallbackImage: siteConfig.defaultOgImage,
  locale: "en-IN",
  reservedRootSlugs: ["location", "menu", "stay"],
  siteUrl: siteConfig.siteUrl,
  timeZone: "Asia/Kolkata",
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

Do not import server helpers from the package root. The root export surface is intentionally client-safe.

## Notes

- The package expects `next`, `react`, `react-dom`, `next-sanity`, and `sanity` to be provided by the consuming app.
- The shared read-side blog helpers now tolerate both legacy string categories and referenced category documents, which lets `Noonvilla-website` adopt the package before fully migrating its Studio schema.
- The shared publish helpers still create category references. If Noonvilla moves its publish route onto the shared publish flow, its Studio schema should also adopt the shared category document model.
