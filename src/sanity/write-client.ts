import "server-only";
import { createClient } from "@sanity/client";
import type { ClientConfig, SanityClient } from "@sanity/client";
import { getSanityEnvConfig, requireSanityValue } from "./env.js";

export function createSanityWriteClient(
  env: NodeJS.ProcessEnv,
  overrides: Partial<ClientConfig> = {},
): SanityClient {
  const config = getSanityEnvConfig(env);

  return createClient({
    projectId: requireSanityValue(config.projectId, "NEXT_PUBLIC_SANITY_PROJECT_ID"),
    dataset: requireSanityValue(config.dataset, "NEXT_PUBLIC_SANITY_DATASET"),
    apiVersion: config.apiVersion,
    token: requireSanityValue(env.SANITY_API_WRITE_TOKEN || "", "SANITY_API_WRITE_TOKEN"),
    useCdn: false,
    ...overrides,
  });
}
