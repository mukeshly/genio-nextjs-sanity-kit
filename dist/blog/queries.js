import { defineQuery } from "next-sanity";
import { toBlogPostSummary } from "./transforms.js";
export const BLOG_POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    _updatedAt,
    content,
    title,
    "slug": slug.current,
    oldSlugs,
    "description": excerpt,
    "category": select(
      defined(category->title) => category->{
        title,
        "slug": slug.current
      },
      defined(category) => category,
      null
    ),
    featured,
    tags,
    publishedAt,
    author->{
      image{
        alt,
        asset
      },
      name,
      role
    },
    coverImage{
      alt,
      asset
    },
    body,
    seo
  }
`);
export const BLOG_POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    _updatedAt,
    content,
    title,
    "slug": slug.current,
    oldSlugs,
    "description": excerpt,
    "category": select(
      defined(category->title) => category->{
        title,
        "slug": slug.current
      },
      defined(category) => category,
      null
    ),
    featured,
    tags,
    publishedAt,
    author->{
      image{
        alt,
        asset
      },
      name,
      role
    },
    coverImage{
      alt,
      asset
    },
    body,
    seo
  }
`);
export const BLOG_POST_BY_OLD_SLUG_QUERY = defineQuery(`
  *[_type == "post" && $slug in oldSlugs][0] {
    _id,
    _updatedAt,
    content,
    title,
    "slug": slug.current,
    oldSlugs,
    "description": excerpt,
    "category": select(
      defined(category->title) => category->{
        title,
        "slug": slug.current
      },
      defined(category) => category,
      null
    ),
    featured,
    tags,
    publishedAt,
    author->{
      image{
        alt,
        asset
      },
      name,
      role
    },
    coverImage{
      alt,
      asset
    },
    body,
    seo
  }
`);
export const BLOG_POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)][]{
    "slug": slug.current
  }
`);
export async function getAllBlogPosts(client, options) {
    const posts = await client.fetch(BLOG_POSTS_QUERY, {}, { next: { revalidate: options?.revalidate ?? 60 } });
    return posts.map((post) => toBlogPostSummary(post, options));
}
export async function getBlogPostBySlug(client, slug, options) {
    const post = await client.fetch(BLOG_POST_BY_SLUG_QUERY, { slug }, { next: { revalidate: options?.revalidate ?? 60 } });
    return post ? toBlogPostSummary(post, options) : null;
}
export async function getBlogPostByOldSlug(client, slug, options) {
    const post = await client.fetch(BLOG_POST_BY_OLD_SLUG_QUERY, { slug }, { next: { revalidate: options?.revalidate ?? 60 } });
    return post ? toBlogPostSummary(post, options) : null;
}
export async function getBlogPostSlugs(client, options) {
    const posts = await client.fetch(BLOG_POST_SLUGS_QUERY, {}, { next: { revalidate: options?.revalidate ?? 60 } });
    return posts.map((post) => post.slug);
}
