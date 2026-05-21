export declare const postSchema: {
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
};
//# sourceMappingURL=post.d.ts.map