import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import type { SanityEnvConfig } from "../types/cms.js";

export function buildSanityImageUrl(
  config: Pick<SanityEnvConfig, "dataset" | "projectId">,
  source: SanityImageSource | null | undefined,
  width?: number,
  height?: number,
) {
  if (!source || !config.projectId || !config.dataset) {
    return null;
  }

  try {
    let builder = createImageUrlBuilder({
      dataset: config.dataset,
      projectId: config.projectId,
    }).image(source);

    if (width) {
      builder = builder.width(width);
    }

    if (height) {
      builder = builder.height(height);
    }

    return builder.url();
  } catch {
    return null;
  }
}
