import { createImageUrlBuilder } from "@sanity/image-url";
export function buildSanityImageUrl(config, source, width, height) {
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
    }
    catch {
        return null;
    }
}
