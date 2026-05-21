import type { SanityEnvConfig } from "../types/cms.js";
export declare const DEFAULT_API_VERSION = "2026-04-13";
export declare function requireSanityValue(value: string, name: string): string;
export declare function getSanityEnvConfig(env: NodeJS.ProcessEnv): SanityEnvConfig;
export declare function hasSanityConfig(config: Partial<SanityEnvConfig>): boolean;
//# sourceMappingURL=env.d.ts.map