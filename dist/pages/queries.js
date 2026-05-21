import { defineQuery } from "next-sanity";
import { createReservedRootSlugs } from "../utils/slugs.js";
import { toSitePageSummary } from "./transforms.js";
export const SITE_PAGES_QUERY = defineQuery(`
  *[_type == "page" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    oldSlugs,
    "description": excerpt,
    featured,
    publishedAt,
    author->{
      image{
        alt,
        asset
      },
      name,
      role
    },
    coverImage{
      alt,
      asset
    },
    body,
    tags,
    seo
  }
`);
export const SITE_PAGE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    oldSlugs,
    "description": excerpt,
    featured,
    publishedAt,
    author->{
      image{
        alt,
        asset
      },
      name,
      role
    },
    coverImage{
      alt,
      asset
    },
    body,
    tags,
    seo
  }
`);
export const SITE_PAGE_BY_OLD_SLUG_QUERY = defineQuery(`
  *[_type == "page" && $slug in oldSlugs][0] {
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    oldSlugs,
    "description": excerpt,
    featured,
    publishedAt,
    author->{
      image{
        alt,
        asset
      },
      name,
      role
    },
    coverImage{
      alt,
      asset
    },
    body,
    tags,
    seo
  }
`);
export const SITE_PAGE_SLUGS_QUERY = defineQuery(`
  *[_type == "page" && defined(slug.current)][]{
    "slug": slug.current
  }
`);
export async function getAllSitePages(client, options) {
    const reserved = createReservedRootSlugs(options?.reservedRootSlugs);
    const pages = await client.fetch(SITE_PAGES_QUERY, {}, { next: { revalidate: options?.revalidate ?? 60 } });
    return pages.filter((page) => !reserved.has(page.slug)).map((page) => toSitePageSummary(page, options));
}
export async function getSitePageBySlug(client, slug, options) {
    const reserved = createReservedRootSlugs(options?.reservedRootSlugs);
    if (reserved.has(slug)) {
        return null;
    }
    const page = await client.fetch(SITE_PAGE_BY_SLUG_QUERY, { slug }, { next: { revalidate: options?.revalidate ?? 60 } });
    return page ? toSitePageSummary(page, options) : null;
}
export async function getSitePageByOldSlug(client, slug, options) {
    const reserved = createReservedRootSlugs(options?.reservedRootSlugs);
    if (reserved.has(slug)) {
        return null;
    }
    const page = await client.fetch(SITE_PAGE_BY_OLD_SLUG_QUERY, { slug }, { next: { revalidate: options?.revalidate ?? 60 } });
    return page ? toSitePageSummary(page, options) : null;
}
export async function getSitePageSlugs(client, options) {
    const reserved = createReservedRootSlugs(options?.reservedRootSlugs);
    const pages = await client.fetch(SITE_PAGE_SLUGS_QUERY, {}, { next: { revalidate: options?.revalidate ?? 60 } });
    return pages.map((page) => page.slug).filter((slug) => !reserved.has(slug));
}
