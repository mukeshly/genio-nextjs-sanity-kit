import { createClient } from "next-sanity";
import type { SanityClient } from "next-sanity";
import type { SanityEnvConfig } from "../types/cms.js";
import { requireSanityValue } from "./env.js";

export function createSanityReadClient(config: SanityEnvConfig): SanityClient {
  return createClient({
    apiVersion: config.apiVersion,
    dataset: requireSanityValue(config.dataset, "NEXT_PUBLIC_SANITY_DATASET"),
    projectId: requireSanityValue(config.projectId, "NEXT_PUBLIC_SANITY_PROJECT_ID"),
    useCdn: config.useCdn ?? true,
    perspective: "published",
  });
}

export function createOptionalSanityReadClient(
  config: Partial<Pick<SanityEnvConfig, "apiVersion" | "dataset" | "projectId" | "useCdn">>,
): SanityClient | null {
  if (!config.projectId || !config.dataset || !config.apiVersion) {
    return null;
  }

  return createClient({
    apiVersion: config.apiVersion,
    dataset: config.dataset,
    projectId: config.projectId,
    useCdn: config.useCdn ?? true,
    perspective: "published",
  });
}
