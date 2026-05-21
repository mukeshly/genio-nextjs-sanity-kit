import type { Metadata } from "next";
export type SiteSeoConfig = {
    defaultOgImage: string;
    locale: string;
    name: string;
    siteUrl: string;
};
export type BuildMetadataInput = {
    title: string;
    description: string;
    site: SiteSeoConfig;
    image?: string;
    openGraphDescription?: string;
    openGraphTitle?: string;
    openGraphType?: "website" | "article";
    path?: string;
};
export type ResolvedMetadata = Metadata;
export type BreadcrumbItem = {
    name: string;
    path?: string;
};
//# sourceMappingURL=seo.d.ts.map