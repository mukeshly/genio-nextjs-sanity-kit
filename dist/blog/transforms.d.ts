import type { BlogPostDocument, BlogPostSummary, PortableTextImage, PortableTextNode } from "../types/blog.js";
export declare function toBlogPostSummary(post: BlogPostDocument, options?: {
    defaultAuthorName?: string;
    dataset?: string;
    fallbackCategoryLabel?: string;
    locale?: string;
    projectId?: string;
    revalidate?: number;
    timeZone?: string;
}): BlogPostSummary;
export declare function getBlogPostPlainText(blocks: BlogPostDocument["body"] | null | undefined, htmlContent?: string | null): string;
export declare function normalizeBlogPostBody(config: {
    dataset: string;
    projectId: string;
}, blocks: BlogPostDocument["body"] | null | undefined): PortableTextNode[];
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
export declare function getBlogBodyImageUrl(config: {
    dataset: string;
    projectId: string;
}, source: PortableTextImage | null | undefined, width: number, height: number): string | null;
//# sourceMappingURL=transforms.d.ts.map