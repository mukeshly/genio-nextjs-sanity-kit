import type { PortableTextBlock, PublishBlogInput, PublishBlogResult } from "../types/index.js";
export declare function markdownToPortableText(markdown: string): PortableTextBlock[];
export declare function publishBlogPost({ env, input, }: {
    env: NodeJS.ProcessEnv;
    input: PublishBlogInput | unknown;
}): Promise<PublishBlogResult>;
//# sourceMappingURL=publish-post.d.ts.map