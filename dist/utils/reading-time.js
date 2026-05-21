import { normalizePlainText, portableTextToPlainText, stripHtmlTags } from "./text.js";
export function estimateReadingTimeFromText(value) {
    const normalized = normalizePlainText(value);
    if (!normalized) {
        return "1 min read";
    }
    const words = normalized.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 220));
    return `${minutes} min read`;
}
export function getPortableTextPlainText(blocks, htmlContent) {
    const portableText = normalizePlainText(portableTextToPlainText(blocks));
    if (portableText) {
        return portableText;
    }
    if (typeof htmlContent === "string" && htmlContent.trim()) {
        return normalizePlainText(stripHtmlTags(htmlContent));
    }
    return "";
}
export function estimateReadingTime(blocks, htmlContent) {
    return estimateReadingTimeFromText(getPortableTextPlainText(blocks, htmlContent));
}
