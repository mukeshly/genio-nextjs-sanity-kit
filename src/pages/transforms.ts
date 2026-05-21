import { buildSanityImageUrl } from "../sanity/image.js";
import type { PortableTextImage, SitePageDocument, SitePageSummary } from "../types/blog.js";
import { formatPublishedDate, isMeaningfullyUpdated } from "../utils/dates.js";
import { estimateReadingTime, getPortableTextPlainText } from "../utils/reading-time.js";
export { createReservedRootSlugs } from "../utils/slugs.js";

export function toSitePageSummary(
  page: SitePageDocument,
  options?: { locale?: string; revalidate?: number; reservedRootSlugs?: string[]; timeZone?: string },
): SitePageSummary {
  const wasUpdated = isMeaningfullyUpdated(page.publishedAt, page._updatedAt);

  return {
    ...page,
    body: page.body || [],
    publishedLabel: formatPublishedDate(
      page.publishedAt,
      options?.locale,
      options?.timeZone,
    ),
    updatedLabel: wasUpdated
      ? formatPublishedDate(page._updatedAt, options?.locale, options?.timeZone)
      : undefined,
    wasUpdated,
    readingTime: estimateReadingTime(page.body),
  };
}

export function getSitePagePlainText(blocks: SitePageDocument["body"] | null | undefined) {
  return getPortableTextPlainText(blocks);
}

export function getSitePageCoverImageUrl(
  config: { dataset: string; projectId: string },
  page: Pick<SitePageDocument, "coverImage">,
  options: { absoluteFallback?: boolean; fallbackImage?: string; siteUrl?: string } = {},
) {
  if (page.coverImage?.asset?._ref) {
    const imageUrl = buildSanityImageUrl(config, page.coverImage, 1600, 900);
    if (imageUrl) return imageUrl;
  }

  if (options.absoluteFallback && options.fallbackImage && options.siteUrl) {
    return new URL(options.fallbackImage, options.siteUrl).toString();
  }

  return options.fallbackImage || null;
}

export function getPageBodyImageUrl(
  config: { dataset: string; projectId: string },
  source: PortableTextImage | null | undefined,
  width: number,
  height: number,
) {
  return source ? buildSanityImageUrl(config, source, width, height) : null;
}
