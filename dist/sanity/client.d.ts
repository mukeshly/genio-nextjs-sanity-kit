import type { SanityClient } from "next-sanity";
import type { SanityEnvConfig } from "../types/cms.js";
export declare function createSanityReadClient(config: SanityEnvConfig): SanityClient;
export declare function createOptionalSanityReadClient(config: Partial<Pick<SanityEnvConfig, "apiVersion" | "dataset" | "projectId" | "useCdn">>): SanityClient | null;
//# sourceMappingURL=client.d.ts.map