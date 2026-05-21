import "server-only";
import { publishBlogPost } from "../publish/publish-post.js";
import { publishPage } from "../publish/publish-page.js";
export declare function createPublishToolkit(env: NodeJS.ProcessEnv): {
    createSanityWriteClient(overrides?: {}): import("next-sanity").SanityClient;
    getPublishSecret(name?: string): string;
    isAuthorizedPublishRequest(request: Request, secret?: string): boolean;
    publishBlogPost(input: Parameters<typeof publishBlogPost>[0]["input"]): Promise<import("../index.js").PublishBlogResult>;
    publishPage(input: Parameters<typeof publishPage>[0]["input"]): Promise<import("../index.js").PublishPageResult>;
};
//# sourceMappingURL=server.d.ts.map