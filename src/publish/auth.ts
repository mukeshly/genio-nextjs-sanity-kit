export function getPublishSecret(
  env: NodeJS.ProcessEnv,
  name = "BLOG_PUBLISH_API_SECRET",
) {
  const secret = env[name];
  if (!secret) {
    throw new Error(`Missing ${name} on server`);
  }

  return secret;
}

export function isAuthorizedPublishRequest(request: Request, secret: string) {
  const authHeader = request.headers.get("authorization");
  const normalizedAuthHeader = authHeader?.trim() || null;
  const authToken = normalizedAuthHeader?.startsWith("Bearer ")
    ? normalizedAuthHeader.slice("Bearer ".length).trim()
    : normalizedAuthHeader;
  const requestSecret = request.headers.get("x-blog-publish-secret");

  return authToken === secret || requestSecret === secret;
}
