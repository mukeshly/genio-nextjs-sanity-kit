import "server-only";
import { createSanityWriteClient } from "../sanity/write-client.js";
import { getPublishSecret, isAuthorizedPublishRequest } from "../publish/auth.js";
import { publishBlogPost } from "../publish/publish-post.js";
import { publishPage } from "../publish/publish-page.js";
export function createPublishToolkit(env) {
    return {
        createSanityWriteClient(overrides = {}) {
            return createSanityWriteClient(env, overrides);
        },
        getPublishSecret(name) {
            return getPublishSecret(env, name);
        },
        isAuthorizedPublishRequest(request, secret = getPublishSecret(env)) {
            return isAuthorizedPublishRequest(request, secret);
        },
        publishBlogPost(input) {
            return publishBlogPost({ env, input });
        },
        publishPage(input) {
            return publishPage({ env, input });
        },
    };
}
