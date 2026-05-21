import type { PortableTextImage, SitePageDocument, SitePageSummary } from "../types/blog.js";
export { createReservedRootSlugs } from "../utils/slugs.js";
export declare function toSitePageSummary(page: SitePageDocument, options?: {
    locale?: string;
    revalidate?: number;
    reservedRootSlugs?: string[];
    timeZone?: string;
}): SitePageSummary;
export declare function getSitePagePlainText(blocks: SitePageDocument["body"] | null | undefined): string;
export declare function getSitePageCoverImageUrl(config: {
    dataset: string;
    projectId: string;
}, page: Pick<SitePageDocument, "coverImage">, options?: {
    absoluteFallback?: boolean;
    fallbackImage?: string;
    siteUrl?: string;
}): string | null;
export declare function getPageBodyImageUrl(config: {
    dataset: string;
    projectId: string;
}, source: PortableTextImage | null | undefined, width: number, height: number): string | null;
//# sourceMappingURL=transforms.d.ts.map