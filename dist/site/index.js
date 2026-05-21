import { getAllBlogPosts, getBlogCoverImageUrl as getConfiguredBlogCoverImageUrl, getBlogPostByOldSlug, getBlogPostBySlug, getBlogPostPlainText, getBlogPostSlugs, getSanityImageUrl as getConfiguredSanityImageUrl, } from "../blog/index.js";
import { getAllSitePages, getPageBodyImageUrl, getSitePageByOldSlug, getSitePageBySlug, getSitePageCoverImageUrl as getConfiguredPageCoverImageUrl, getSitePagePlainText, getSitePageSlugs, } from "../pages/index.js";
import { createOptionalSanityReadClient, createSanityReadClient, } from "../sanity/client.js";
function getImageConfig(config) {
    return {
        dataset: config.dataset || "",
        projectId: config.projectId || "",
    };
}
function getSharedQueryOptions(options) {
    return {
        defaultAuthorName: options.defaultAuthorName,
        fallbackCategoryLabel: options.fallbackCategoryLabel,
        locale: options.locale,
        revalidate: options.revalidate,
        reservedRootSlugs: options.reservedRootSlugs,
        timeZone: options.timeZone,
    };
}
export function createSiteToolkit(options) {
    const imageConfig = getImageConfig(options.sanity);
    const queryOptions = getSharedQueryOptions(options);
    const getClient = () => createOptionalSanityReadClient({
        apiVersion: options.sanity.apiVersion,
        dataset: options.sanity.dataset,
        projectId: options.sanity.projectId,
        useCdn: options.sanity.useCdn,
    });
    const getRequiredClient = () => createSanityReadClient(options.sanity);
    return {
        createClient: getClient,
        createRequiredClient: getRequiredClient,
        hasSanityConfig: Boolean(options.sanity.apiVersion && options.sanity.dataset && options.sanity.projectId),
        getSanityImageUrl(source, width, height) {
            return getConfiguredSanityImageUrl(imageConfig, source, width, height);
        },
        getBlogCoverImageUrl(post, imageOptions = {}) {
            return getConfiguredBlogCoverImageUrl(imageConfig, post, {
                absoluteFallback: imageOptions.absoluteFallback,
                fallbackImage: options.fallbackImage,
                siteUrl: options.siteUrl,
            });
        },
        getPageCoverImageUrl(page, imageOptions = {}) {
            return getConfiguredPageCoverImageUrl(imageConfig, page, {
                absoluteFallback: imageOptions.absoluteFallback,
                fallbackImage: options.fallbackImage,
                siteUrl: options.siteUrl,
            });
        },
        getPageBodyImageUrl(source, width, height) {
            return getPageBodyImageUrl(imageConfig, source, width, height);
        },
        getBlogPostPlainText,
        getSitePagePlainText,
        async getAllBlogPosts() {
            const client = getClient();
            if (!client)
                return [];
            return getAllBlogPosts(client, queryOptions);
        },
        async getBlogPostBySlug(slug) {
            const client = getClient();
            if (!client)
                return null;
            return getBlogPostBySlug(client, slug, queryOptions);
        },
        async getBlogPostByOldSlug(slug) {
            const client = getClient();
            if (!client)
                return null;
            return getBlogPostByOldSlug(client, slug, queryOptions);
        },
        async getBlogPostSlugs() {
            const client = getClient();
            if (!client)
                return [];
            return getBlogPostSlugs(client, queryOptions);
        },
        async getAllSitePages() {
            const client = getClient();
            if (!client)
                return [];
            return getAllSitePages(client, queryOptions);
        },
        async getSitePageBySlug(slug) {
            const client = getClient();
            if (!client)
                return null;
            return getSitePageBySlug(client, slug, queryOptions);
        },
        async getSitePageByOldSlug(slug) {
            const client = getClient();
            if (!client)
                return null;
            return getSitePageByOldSlug(client, slug, queryOptions);
        },
        async getSitePageSlugs() {
            const client = getClient();
            if (!client)
                return [];
            return getSitePageSlugs(client, queryOptions);
        },
    };
}
