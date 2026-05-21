export declare const authorSchema: {
    type: "document";
    name: "author";
} & Omit<import("sanity").DocumentDefinition, "preview"> & {
    preview?: import("sanity").PreviewConfig<{
        title: string;
        subtitle: string;
        media: string;
    }, Record<"title" | "media" | "subtitle", any>> | undefined;
};
//# sourceMappingURL=author.d.ts.map