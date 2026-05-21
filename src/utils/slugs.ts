export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function createReservedRootSlugs(extra: string[] = []) {
  return new Set([
    "",
    "about",
    "api",
    "blog",
    "faq",
    "robots.txt",
    "sitemap.xml",
    "studio",
    ...extra,
  ]);
}
