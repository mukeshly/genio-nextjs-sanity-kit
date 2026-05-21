import type { BlogPostDocument, BlogPostSummary, PortableTextImage } from "../types/blog.js";
export declare function toBlogPostSummary(post: BlogPostDocument, options?: {
    defaultAuthorName?: string;
    fallbackCategoryLabel?: string;
    locale?: string;
    revalidate?: number;
    timeZone?: string;
}): BlogPostSummary;
export declare function getBlogPostPlainText(blocks: BlogPostDocument["body"] | null | undefined, htmlContent?: string | null): string;
export declare function getBlogCoverImageUrl(config: {
    dataset: string;
    projectId: string;
}, post: Pick<BlogPostDocument, "coverImage">, options?: {
    absoluteFallback?: boolean;
    fallbackImage?: string;
    siteUrl?: string;
}): string | null;
export declare function getSanityImageUrl(config: {
    dataset: string;
    projectId: string;
}, source: BlogPostDocument["coverImage"] | NonNullable<BlogPostDocument["author"]>["image"] | PortableTextImage | null | undefined, width: number, height: number): string | null;
//# sourceMappingURL=transforms.d.ts.map