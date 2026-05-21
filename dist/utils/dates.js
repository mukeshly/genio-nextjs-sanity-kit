export function formatPublishedDate(value, locale = "en-IN", timeZone = "Asia/Kolkata") {
    return new Intl.DateTimeFormat(locale, {
        dateStyle: "long",
        timeZone,
    }).format(new Date(value));
}
export function isMeaningfullyUpdated(publishedAt, updatedAt) {
    return new Date(updatedAt).getTime() - new Date(publishedAt).getTime() > 60 * 60 * 1000;
}
