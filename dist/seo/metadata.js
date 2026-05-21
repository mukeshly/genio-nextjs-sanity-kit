export function buildMetadata({ title, description, site, image = site.defaultOgImage, openGraphType = "website", openGraphTitle, openGraphDescription, path = "/", }) {
    const url = new URL(path, site.siteUrl).toString();
    const imageUrl = new URL(image, site.siteUrl).toString();
    const resolvedOpenGraphTitle = openGraphTitle || title;
    const resolvedOpenGraphDescription = openGraphDescription || description;
    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: resolvedOpenGraphTitle,
            description: resolvedOpenGraphDescription,
            url,
            siteName: site.name,
            locale: site.locale,
            type: openGraphType,
            images: [
                {
                    url: imageUrl,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: resolvedOpenGraphTitle,
            description: resolvedOpenGraphDescription,
            images: [imageUrl],
        },
    };
}
