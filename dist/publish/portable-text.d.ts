import type { PortableTextNode } from "../types/blog.js";
type MarkdownToPortableTextOptions = {
    uploadImage?: (imageUrl: string) => Promise<{
        _type: "reference";
        _ref: string;
    }>;
};
export declare function markdownToPortableText(markdown: string, options?: MarkdownToPortableTextOptions): Promise<PortableTextNode[]>;
export {};
//# sourceMappingURL=portable-text.d.ts.map