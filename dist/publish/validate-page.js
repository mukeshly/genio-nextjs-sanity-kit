import { slugify } from "../utils/slugs.js";
function assertString(value, field, min = 1) {
    if (typeof value !== "string" || value.trim().length < min) {
        throw new Error(`Invalid ${field}`);
    }
    return value.trim();
}
function normalizeTags(value, max) {
    if (!Array.isArray(value)) {
        return [];
    }
    return value
        .filter((tag) => typeof tag === "string")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, max);
}
export function validatePublishPageInput(input) {
    const title = assertString(input.title, "title", 8);
    const excerpt = assertString(input.excerpt, "excerpt", 40);
    const bodyMarkdown = assertString(input.bodyMarkdown, "bodyMarkdown", 120);
    const coverImageUrl = assertString(input.coverImageUrl, "coverImageUrl", 8);
    const coverImageAlt = assertString(input.coverImageAlt, "coverImageAlt", 5);
    const authorName = assertString(input.authorName, "authorName", 2);
    return {
        documentId: typeof input.documentId === "string" && input.documentId.trim()
            ? input.documentId.trim()
            : undefined,
        title,
        excerpt,
        bodyMarkdown,
        coverImageUrl,
        coverImageAlt,
        authorName,
        authorRole: typeof input.authorRole === "string" && input.authorRole.trim()
            ? input.authorRole.trim()
            : "Editorial Team",
        featured: Boolean(input.featured),
        publishedAt: typeof input.publishedAt === "string" && input.publishedAt.trim()
            ? new Date(input.publishedAt).toISOString()
            : new Date().toISOString(),
        slug: input.slug ? slugify(input.slug) : slugify(title),
        tags: normalizeTags(input.tags, 12),
        seo: input.seo || {},
    };
}
