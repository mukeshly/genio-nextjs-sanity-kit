import type { SanityClient } from "next-sanity";
import { getBlogPostPlainText } from "../blog/index.js";
import { getPageBodyImageUrl, getSitePagePlainText } from "../pages/index.js";
import type { BlogPostDocument, PortableTextImage, SitePageDocument } from "../types/blog.js";
import type { SanityEnvConfig } from "../types/cms.js";
type SiteToolkitOptions = {
    defaultAuthorName?: string;
    fallbackCategoryLabel?: string;
    fallbackImage?: string;
    locale?: string;
    revalidate?: number;
    reservedRootSlugs?: string[];
    sanity: Partial<SanityEnvConfig>;
    siteUrl?: string;
    timeZone?: string;
};
type AbsoluteImageFallbackOptions = {
    absoluteFallback?: boolean;
};
export declare function createSiteToolkit(options: SiteToolkitOptions): {
    createClient: () => SanityClient | null;
    createRequiredClient: () => SanityClient;
    hasSanityConfig: boolean;
    getSanityImageUrl(source: BlogPostDocument["coverImage"] | NonNullable<NonNullable<BlogPostDocument["author"]>["image"]> | SitePageDocument["coverImage"] | PortableTextImage | null | undefined, width: number, height: number): string | null;
    getBlogCoverImageUrl(post: Pick<BlogPostDocument, "coverImage">, imageOptions?: AbsoluteImageFallbackOptions): string | null;
    getPageCoverImageUrl(page: Pick<SitePageDocument, "coverImage">, imageOptions?: AbsoluteImageFallbackOptions): string | null;
    getPageBodyImageUrl(source: Parameters<typeof getPageBodyImageUrl>[1], width: number, height: number): string | null;
    getBlogPostPlainText: typeof getBlogPostPlainText;
    getSitePagePlainText: typeof getSitePagePlainText;
    getAllBlogPosts(): Promise<import("../types/blog.js").BlogPostSummary[]>;
    getBlogPostBySlug(slug: string): Promise<import("../types/blog.js").BlogPostSummary | null>;
    getBlogPostByOldSlug(slug: string): Promise<import("../types/blog.js").BlogPostSummary | null>;
    getBlogPostSlugs(): Promise<string[]>;
    getAllSitePages(): Promise<import("../types/blog.js").SitePageSummary[]>;
    getSitePageBySlug(slug: string): Promise<import("../types/blog.js").SitePageSummary | null>;
    getSitePageByOldSlug(slug: string): Promise<import("../types/blog.js").SitePageSummary | null>;
    getSitePageSlugs(): Promise<string[]>;
};
export {};
//# sourceMappingURL=index.d.ts.map