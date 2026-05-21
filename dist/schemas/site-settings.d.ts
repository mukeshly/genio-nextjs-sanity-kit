export declare const siteSettingsSchema: {
    type: "document";
    name: "siteSettings";
} & Omit<import("sanity").DocumentDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<Record<string, string>, Record<never, any>> | undefined;
};
//# sourceMappingURL=site-settings.d.ts.map