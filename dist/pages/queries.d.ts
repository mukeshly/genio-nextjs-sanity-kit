import type { SanityClient } from "next-sanity";
export declare const SITE_PAGES_QUERY: "\n  *[_type == \"page\" && defined(slug.current)] | order(publishedAt desc) {\n    _id,\n    _updatedAt,\n    title,\n    \"slug\": slug.current,\n    oldSlugs,\n    \"description\": excerpt,\n    featured,\n    publishedAt,\n    author->{\n      image{\n        alt,\n        asset\n      },\n      name,\n      role\n    },\n    coverImage{\n      alt,\n      asset\n    },\n    body,\n    tags,\n    seo\n  }\n";
export declare const SITE_PAGE_BY_SLUG_QUERY: "\n  *[_type == \"page\" && slug.current == $slug][0] {\n    _id,\n    _updatedAt,\n    title,\n    \"slug\": slug.current,\n    oldSlugs,\n    \"description\": excerpt,\n    featured,\n    publishedAt,\n    author->{\n      image{\n        alt,\n        asset\n      },\n      name,\n      role\n    },\n    coverImage{\n      alt,\n      asset\n    },\n    body,\n    tags,\n    seo\n  }\n";
export declare const SITE_PAGE_BY_OLD_SLUG_QUERY: "\n  *[_type == \"page\" && $slug in oldSlugs][0] {\n    _id,\n    _updatedAt,\n    title,\n    \"slug\": slug.current,\n    oldSlugs,\n    \"description\": excerpt,\n    featured,\n    publishedAt,\n    author->{\n      image{\n        alt,\n        asset\n      },\n      name,\n      role\n    },\n    coverImage{\n      alt,\n      asset\n    },\n    body,\n    tags,\n    seo\n  }\n";
export declare const SITE_PAGE_SLUGS_QUERY: "\n  *[_type == \"page\" && defined(slug.current)][]{\n    \"slug\": slug.current\n  }\n";
export declare function getAllSitePages(client: SanityClient, options?: {
    revalidate?: number;
    reservedRootSlugs?: string[];
}): Promise<import("../types/blog.js").SitePageSummary[]>;
export declare function getSitePageBySlug(client: SanityClient, slug: string, options?: {
    revalidate?: number;
    reservedRootSlugs?: string[];
}): Promise<import("../types/blog.js").SitePageSummary | null>;
export declare function getSitePageByOldSlug(client: SanityClient, slug: string, options?: {
    revalidate?: number;
    reservedRootSlugs?: string[];
}): Promise<import("../types/blog.js").SitePageSummary | null>;
export declare function getSitePageSlugs(client: SanityClient, options?: {
    revalidate?: number;
    reservedRootSlugs?: string[];
}): Promise<string[]>;
//# sourceMappingURL=queries.d.ts.map