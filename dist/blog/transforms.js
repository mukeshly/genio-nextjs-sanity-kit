import { buildSanityImageUrl } from "../sanity/image.js";
import { formatPublishedDate, isMeaningfullyUpdated } from "../utils/dates.js";
import { estimateReadingTime, getPortableTextPlainText } from "../utils/reading-time.js";
function getCategoryLabel(category, fallbackCategoryLabel) {
    if (typeof category === "string" && category.trim()) {
        return category;
    }
    if (category && typeof category === "object" && category.title) {
        return category.title;
    }
    return fallbackCategoryLabel || "General";
}
export function toBlogPostSummary(post, options) {
    const wasUpdated = isMeaningfullyUpdated(post.publishedAt, post._updatedAt);
    return {
        ...post,
        author: post.author || {
            name: options?.defaultAuthorName || "Editorial Team",
        },
        body: post.body || [],
        content: post.content || null,
        categoryLabel: getCategoryLabel(post.category, options?.fallbackCategoryLabel),
        publishedLabel: formatPublishedDate(post.publishedAt, options?.locale, options?.timeZone),
        updatedLabel: wasUpdated
            ? formatPublishedDate(post._updatedAt, options?.locale, options?.timeZone)
            : undefined,
        wasUpdated,
        readingTime: estimateReadingTime(post.body, post.content),
    };
}
export function getBlogPostPlainText(blocks, htmlContent) {
    return getPortableTextPlainText(blocks, htmlContent);
}
export function getBlogCoverImageUrl(config, post, options = {}) {
    if (post.coverImage?.asset?._ref) {
        const imageUrl = buildSanityImageUrl(config, post.coverImage, 1600, 900);
        if (imageUrl)
            return imageUrl;
    }
    if (options.absoluteFallback && options.fallbackImage && options.siteUrl) {
        return new URL(options.fallbackImage, options.siteUrl).toString();
    }
    return options.fallbackImage || null;
}
export function getSanityImageUrl(config, source, width, height) {
    return buildSanityImageUrl(config, source, width, height);
}
