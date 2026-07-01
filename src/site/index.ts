import type { SanityClient } from "next-sanity";
import {
  getAllBlogPosts,
  getBlogBodyImageUrl,
  getBlogCoverImageUrl as getConfiguredBlogCoverImageUrl,
  getBlogPostByOldSlug,
  getBlogPostBySlug,
  getBlogPostPlainText,
  getBlogPostSlugs,
  getSanityImageUrl as getConfiguredSanityImageUrl,
  normalizeBlogPostBody,
} from "../blog/index.js";
import {
  getAllSitePages,
  getPageBodyImageUrl,
  getSitePageByOldSlug,
  getSitePageBySlug,
  getSitePageCoverImageUrl as getConfiguredPageCoverImageUrl,
  getSitePagePlainText,
  getSitePageSlugs,
} from "../pages/index.js";
import {
  createOptionalSanityReadClient,
  createSanityReadClient,
} from "../sanity/client.js";
import type {
  BlogPostDocument,
  PortableTextImage,
  SitePageDocument,
} from "../types/blog.js";
import type { SanityEnvConfig } from "../types/cms.js";

type SiteToolkitOptions = {
  defaultAuthorName?: string;
  fallbackCategoryLabel?: string;
  fallbackImage?: string;
  locale?: string;
  revalidate?: number;
  reservedRootSlugs?: string[];
  sanity: Partial<SanityEnvConfig>;
  siteUrl?: string;
  timeZone?: string;
};

type AbsoluteImageFallbackOptions = {
  absoluteFallback?: boolean;
};

function getImageConfig(config: Partial<SanityEnvConfig>) {
  return {
    dataset: config.dataset || "",
    projectId: config.projectId || "",
  };
}

function getSharedQueryOptions(options: SiteToolkitOptions) {
  return {
    dataset: options.sanity.dataset,
    defaultAuthorName: options.defaultAuthorName,
    fallbackCategoryLabel: options.fallbackCategoryLabel,
    locale: options.locale,
    projectId: options.sanity.projectId,
    revalidate: options.revalidate,
    reservedRootSlugs: options.reservedRootSlugs,
    timeZone: options.timeZone,
  };
}

export function createSiteToolkit(options: SiteToolkitOptions) {
  const imageConfig = getImageConfig(options.sanity);
  const queryOptions = getSharedQueryOptions(options);

  const getClient = (): SanityClient | null =>
    createOptionalSanityReadClient({
      apiVersion: options.sanity.apiVersion,
      dataset: options.sanity.dataset,
      projectId: options.sanity.projectId,
      useCdn: options.sanity.useCdn,
    });

  const getRequiredClient = (): SanityClient =>
    createSanityReadClient(options.sanity as SanityEnvConfig);

  return {
    createClient: getClient,
    createRequiredClient: getRequiredClient,
    hasSanityConfig: Boolean(
      options.sanity.apiVersion && options.sanity.dataset && options.sanity.projectId,
    ),
    getSanityImageUrl(
      source:
        | BlogPostDocument["coverImage"]
        | NonNullable<NonNullable<BlogPostDocument["author"]>["image"]>
        | SitePageDocument["coverImage"]
        | PortableTextImage
        | null
        | undefined,
      width: number,
      height: number,
    ) {
      return getConfiguredSanityImageUrl(imageConfig, source, width, height);
    },
    getBlogCoverImageUrl(
      post: Pick<BlogPostDocument, "coverImage">,
      imageOptions: AbsoluteImageFallbackOptions = {},
    ) {
      return getConfiguredBlogCoverImageUrl(imageConfig, post, {
        absoluteFallback: imageOptions.absoluteFallback,
        fallbackImage: options.fallbackImage,
        siteUrl: options.siteUrl,
      });
    },
    getBlogBodyImageUrl(source: PortableTextImage | null | undefined, width: number, height: number) {
      return getBlogBodyImageUrl(imageConfig, source, width, height);
    },
    getPageCoverImageUrl(
      page: Pick<SitePageDocument, "coverImage">,
      imageOptions: AbsoluteImageFallbackOptions = {},
    ) {
      return getConfiguredPageCoverImageUrl(imageConfig, page, {
        absoluteFallback: imageOptions.absoluteFallback,
        fallbackImage: options.fallbackImage,
        siteUrl: options.siteUrl,
      });
    },
    getPageBodyImageUrl(source: Parameters<typeof getPageBodyImageUrl>[1], width: number, height: number) {
      return getPageBodyImageUrl(imageConfig, source, width, height);
    },
    normalizeBlogPostBody(blocks: BlogPostDocument["body"] | null | undefined) {
      return normalizeBlogPostBody(imageConfig, blocks);
    },
    getBlogPostPlainText,
    getSitePagePlainText,
    async getAllBlogPosts() {
      const client = getClient();
      if (!client) return [];
      return getAllBlogPosts(client, queryOptions);
    },
    async getBlogPostBySlug(slug: string) {
      const client = getClient();
      if (!client) return null;
      return getBlogPostBySlug(client, slug, queryOptions);
    },
    async getBlogPostByOldSlug(slug: string) {
      const client = getClient();
      if (!client) return null;
      return getBlogPostByOldSlug(client, slug, queryOptions);
    },
    async getBlogPostSlugs() {
      const client = getClient();
      if (!client) return [];
      return getBlogPostSlugs(client, queryOptions);
    },
    async getAllSitePages() {
      const client = getClient();
      if (!client) return [];
      return getAllSitePages(client, queryOptions);
    },
    async getSitePageBySlug(slug: string) {
      const client = getClient();
      if (!client) return null;
      return getSitePageBySlug(client, slug, queryOptions);
    },
    async getSitePageByOldSlug(slug: string) {
      const client = getClient();
      if (!client) return null;
      return getSitePageByOldSlug(client, slug, queryOptions);
    },
    async getSitePageSlugs() {
      const client = getClient();
      if (!client) return [];
      return getSitePageSlugs(client, queryOptions);
    },
  };
}
