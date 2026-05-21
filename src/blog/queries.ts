import { defineQuery } from "next-sanity";
import type { SanityClient } from "next-sanity";
import type { BlogPostDocument } from "../types/blog.js";
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
    "postType": coalesce(postType, "article"),
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
    "postType": coalesce(postType, "article"),
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
    "postType": coalesce(postType, "article"),
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

export async function getAllBlogPosts(client: SanityClient, options?: { revalidate?: number }) {
  const posts = await client.fetch<BlogPostDocument[]>(
    BLOG_POSTS_QUERY,
    {},
    { next: { revalidate: options?.revalidate ?? 60 } },
  );

  return posts.map((post) => toBlogPostSummary(post, options));
}

export async function getBlogPostBySlug(
  client: SanityClient,
  slug: string,
  options?: { revalidate?: number },
) {
  const post = await client.fetch<BlogPostDocument | null>(
    BLOG_POST_BY_SLUG_QUERY,
    { slug },
    { next: { revalidate: options?.revalidate ?? 60 } },
  );

  return post ? toBlogPostSummary(post, options) : null;
}

export async function getBlogPostByOldSlug(
  client: SanityClient,
  slug: string,
  options?: { revalidate?: number },
) {
  const post = await client.fetch<BlogPostDocument | null>(
    BLOG_POST_BY_OLD_SLUG_QUERY,
    { slug },
    { next: { revalidate: options?.revalidate ?? 60 } },
  );

  return post ? toBlogPostSummary(post, options) : null;
}

export async function getBlogPostSlugs(client: SanityClient, options?: { revalidate?: number }) {
  const posts = await client.fetch<Array<{ slug: string }>>(
    BLOG_POST_SLUGS_QUERY,
    {},
    { next: { revalidate: options?.revalidate ?? 60 } },
  );

  return posts.map((post) => post.slug);
}
