import { toPlainText } from "next-sanity";
export function stripHtmlTags(value) {
    return value
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"');
}
export function normalizePlainText(value) {
    return value.replace(/\s+/g, " ").trim();
}
export function portableTextToPlainText(blocks) {
    const safeBlocks = Array.isArray(blocks)
        ? blocks.filter((block) => Boolean(block && typeof block === "object" && block._type === "block"))
        : [];
    return safeBlocks.length > 0 ? toPlainText(safeBlocks) : "";
}
