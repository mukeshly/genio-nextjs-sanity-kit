export declare const pageSchema: {
    type: "document";
    name: "page";
} & Omit<import("sanity").DocumentDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        title: string;
        subtitle: string;
        media: string;
        featured: string;
    }, any> | undefined;
};
//# sourceMappingURL=page.d.ts.map