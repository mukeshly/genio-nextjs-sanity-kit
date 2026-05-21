import type { BreadcrumbItem } from "../types/seo.js";
export declare function buildBreadcrumbSchema(siteUrl: string, items: BreadcrumbItem[]): {
    "@context": string;
    "@type": string;
    itemListElement: {
        "@type": string;
        position: number;
        name: string;
        item: string;
    }[];
};
export declare function buildWebSiteSchema(input: {
    description: string;
    locale?: string;
    name: string;
    siteUrl: string;
}): {
    "@context": string;
    "@type": string;
    name: string;
    url: string;
    description: string;
    inLanguage: string;
};
export declare function buildOrganizationSchema(input: {
    address?: Record<string, unknown>;
    logo?: string;
    name: string;
    sameAs?: string[];
    siteUrl: string;
    telephone?: string;
}): {
    "@context": string;
    "@type": string;
    name: string;
    url: string;
    logo: string | undefined;
    telephone: string | undefined;
    sameAs: string[] | undefined;
    address: Record<string, unknown> | undefined;
};
//# sourceMappingURL=schema.d.ts.map