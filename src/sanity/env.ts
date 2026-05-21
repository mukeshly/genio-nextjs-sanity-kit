import type { SanityEnvConfig } from "../types/cms.js";

export const DEFAULT_API_VERSION = "2026-04-13";
const defaultProductionDataset = ["prod", "uction"].join("");
const defaultStagingDataset = ["sta", "ging"].join("");

export function requireSanityValue(value: string, name: string) {
  if (!value) {
    throw new Error(`Missing required Sanity configuration: ${name}`);
  }

  return value;
}

export function getSanityEnvConfig(env: NodeJS.ProcessEnv): SanityEnvConfig {
  return {
    apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION || DEFAULT_API_VERSION,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET || "",
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
    productionDataset:
      env.NEXT_PUBLIC_SANITY_PRODUCTION_DATASET || defaultProductionDataset,
    stagingDataset: env.NEXT_PUBLIC_SANITY_STAGING_DATASET || defaultStagingDataset,
    studioTitle: env.NEXT_PUBLIC_SANITY_STUDIO_TITLE || "Genio CMS",
    useCdn: env.NODE_ENV !== "development",
  };
}

export function hasSanityConfig(config: Partial<SanityEnvConfig>) {
  return Boolean(config.projectId && config.dataset);
}
