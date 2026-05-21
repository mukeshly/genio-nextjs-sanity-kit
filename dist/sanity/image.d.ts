import type { SanityImageSource } from "@sanity/image-url";
import type { SanityEnvConfig } from "../types/cms.js";
export declare function buildSanityImageUrl(config: Pick<SanityEnvConfig, "dataset" | "projectId">, source: SanityImageSource | null | undefined, width?: number, height?: number): string | null;
//# sourceMappingURL=image.d.ts.map