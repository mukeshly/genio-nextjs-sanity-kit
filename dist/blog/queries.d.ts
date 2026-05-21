import type { SanityClient } from "next-sanity";
export declare const BLOG_POSTS_QUERY: "\n  *[_type == \"post\" && defined(slug.current)] | order(publishedAt desc) {\n    _id,\n    _updatedAt,\n    content,\n    title,\n    \"slug\": slug.current,\n    oldSlugs,\n    \"description\": excerpt,\n    \"category\": select(\n      defined(category->title) => category->{\n        title,\n        \"slug\": slug.current\n      },\n      defined(category) => category,\n      null\n    ),\n    featured,\n    tags,\n    publishedAt,\n    author->{\n      image{\n        alt,\n        asset\n      },\n      name,\n      role\n    },\n    coverImage{\n      alt,\n      asset\n    },\n    body,\n    seo\n  }\n";
export declare const BLOG_POST_BY_SLUG_QUERY: "\n  *[_type == \"post\" && slug.current == $slug][0] {\n    _id,\n    _updatedAt,\n    content,\n    title,\n    \"slug\": slug.current,\n    oldSlugs,\n    \"description\": excerpt,\n    \"category\": select(\n      defined(category->title) => category->{\n        title,\n        \"slug\": slug.current\n      },\n      defined(category) => category,\n      null\n    ),\n    featured,\n    tags,\n    publishedAt,\n    author->{\n      image{\n        alt,\n        asset\n      },\n      name,\n      role\n    },\n    coverImage{\n      alt,\n      asset\n    },\n    body,\n    seo\n  }\n";
export declare const BLOG_POST_BY_OLD_SLUG_QUERY: "\n  *[_type == \"post\" && $slug in oldSlugs][0] {\n    _id,\n    _updatedAt,\n    content,\n    title,\n    \"slug\": slug.current,\n    oldSlugs,\n    \"description\": excerpt,\n    \"category\": select(\n      defined(category->title) => category->{\n        title,\n        \"slug\": slug.current\n      },\n      defined(category) => category,\n      null\n    ),\n    featured,\n    tags,\n    publishedAt,\n    author->{\n      image{\n        alt,\n        asset\n      },\n      name,\n      role\n    },\n    coverImage{\n      alt,\n      asset\n    },\n    body,\n    seo\n  }\n";
export declare const BLOG_POST_SLUGS_QUERY: "\n  *[_type == \"post\" && defined(slug.current)][]{\n    \"slug\": slug.current\n  }\n";
export declare function getAllBlogPosts(client: SanityClient, options?: {
    revalidate?: number;
}): Promise<import("../types/blog.js").BlogPostSummary[]>;
export declare function getBlogPostBySlug(client: SanityClient, slug: string, options?: {
    revalidate?: number;
}): Promise<import("../types/blog.js").BlogPostSummary | null>;
export declare function getBlogPostByOldSlug(client: SanityClient, slug: string, options?: {
    revalidate?: number;
}): Promise<import("../types/blog.js").BlogPostSummary | null>;
export declare function getBlogPostSlugs(client: SanityClient, options?: {
    revalidate?: number;
}): Promise<string[]>;
//# sourceMappingURL=queries.d.ts.map