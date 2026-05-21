export { authorSchema } from "./author.js";
export { categorySchema } from "./category.js";
export { pageSchema } from "./page.js";
export { postSchema } from "./post.js";
export { siteSettingsSchema } from "./site-settings.js";
export declare function createSchemaTypes(options?: {
    includeCategory?: boolean;
    includeSiteSettings?: boolean;
}): (({
    type: "document";
    name: "author";
} & Omit<import("sanity").DocumentDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        title: string;
        subtitle: string;
        media: string;
    }, Record<"title" | "media" | "subtitle", any>> | undefined;
}) | ({
    type: "document";
    name: "category";
} & Omit<import("sanity").DocumentDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        title: string;
        subtitle: string;
    }, Record<"title" | "subtitle", any>> | undefined;
}) | ({
    type: "document";
    name: "page";
} & Omit<import("sanity").DocumentDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        title: string;
        subtitle: string;
        media: string;
        featured: string;
    }, any> | undefined;
}) | ({
    type: "document";
    name: "post";
} & Omit<import("sanity").DocumentDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        title: string;
        subtitle: string;
        media: string;
        featured: string;
        postType: string;
    }, any> | undefined;
}) | ({
    type: "document";
    name: "siteSettings";
} & Omit<import("sanity").DocumentDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<Record<string, string>, Record<never, any>> | undefined;
}))[];
//# sourceMappingURL=index.d.ts.map