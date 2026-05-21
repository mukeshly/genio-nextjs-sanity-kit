import "server-only";
import { createSanityWriteClient } from "../sanity/write-client.js";
import { getPublishSecret, isAuthorizedPublishRequest } from "../publish/auth.js";
import { publishBlogPost } from "../publish/publish-post.js";
import { publishPage } from "../publish/publish-page.js";

export function createPublishToolkit(env: NodeJS.ProcessEnv) {
  return {
    createSanityWriteClient(overrides = {}) {
      return createSanityWriteClient(env, overrides);
    },
    getPublishSecret(name?: string) {
      return getPublishSecret(env, name);
    },
    isAuthorizedPublishRequest(request: Request, secret = getPublishSecret(env)) {
      return isAuthorizedPublishRequest(request, secret);
    },
    publishBlogPost(input: Parameters<typeof publishBlogPost>[0]["input"]) {
      return publishBlogPost({ env, input });
    },
    publishPage(input: Parameters<typeof publishPage>[0]["input"]) {
      return publishPage({ env, input });
    },
  };
}
