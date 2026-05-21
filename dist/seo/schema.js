export function buildBreadcrumbSchema(siteUrl, items) {
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
export function buildWebSiteSchema(input) {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: input.name,
        url: input.siteUrl,
        description: input.description,
        inLanguage: input.locale || "en-US",
    };
}
export function buildOrganizationSchema(input) {
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
