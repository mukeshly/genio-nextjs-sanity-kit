export declare const categorySchema: {
    type: "document";
    name: "category";
} & Omit<import("sanity").DocumentDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        title: string;
        subtitle: string;
    }, Record<"title" | "subtitle", any>> | undefined;
};
//# sourceMappingURL=category.d.ts.map