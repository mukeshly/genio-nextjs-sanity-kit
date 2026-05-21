import type { BreadcrumbItem } from "../types/seo.js";

export function buildBreadcrumbSchema(siteUrl: string, items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path ? new URL(item.path, siteUrl).toString() : siteUrl,
    })),
  };
}

export function buildWebSiteSchema(input: {
  description: string;
  locale?: string;
  name: string;
  siteUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: input.name,
    url: input.siteUrl,
    description: input.description,
    inLanguage: input.locale || "en-US",
  };
}

export function buildOrganizationSchema(input: {
  address?: Record<string, unknown>;
  logo?: string;
  name: string;
  sameAs?: string[];
  siteUrl: string;
  telephone?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: input.name,
    url: input.siteUrl,
    logo: input.logo,
    telephone: input.telephone,
    sameAs: input.sameAs,
    address: input.address,
  };
}
