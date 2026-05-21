export { authorSchema } from "./author.js";
export { categorySchema } from "./category.js";
export { pageSchema } from "./page.js";
export { postSchema } from "./post.js";
export { siteSettingsSchema } from "./site-settings.js";

import { authorSchema } from "./author.js";
import { categorySchema } from "./category.js";
import { pageSchema } from "./page.js";
import { postSchema } from "./post.js";
import { siteSettingsSchema } from "./site-settings.js";

export function createSchemaTypes(options?: {
  includeCategory?: boolean;
  includeSiteSettings?: boolean;
}) {
  const includeCategory = options?.includeCategory ?? true;
  const includeSiteSettings = options?.includeSiteSettings ?? true;

  return [
    authorSchema,
    ...(includeCategory ? [categorySchema] : []),
    postSchema,
    pageSchema,
    ...(includeSiteSettings ? [siteSettingsSchema] : []),
  ];
}
