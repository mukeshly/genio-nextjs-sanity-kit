import type { PortableTextBlock } from "./blog.js";
export type PublishBlogInput = {
    authorName: string;
    authorRole?: string;
    bodyMarkdown: string;
    category: string;
    coverImageAlt: string;
    coverImageUrl: string;
    documentId?: string;
    excerpt: string;
    featured?: boolean;
    publishedAt?: string;
    seo?: {
        metaDescription?: string;
        metaTitle?: string;
        ogDescription?: string;
        ogTitle?: string;
    };
    slug?: string;
    tags?: string[];
    title: string;
};
export type PublishPageInput = {
    authorName: string;
    authorRole?: string;
    bodyMarkdown: string;
    coverImageAlt: string;
    coverImageUrl: string;
    documentId?: string;
    excerpt: string;
    featured?: boolean;
    publishedAt?: string;
    seo?: {
        metaDescription?: string;
        metaTitle?: string;
        ogDescription?: string;
        ogTitle?: string;
    };
    slug?: string;
    tags?: string[];
    title: string;
};
export type PublishOperationResult = {
    documentId: string;
    slug: string;
    publishedAt: string;
};
export type PublishBlogResult = PublishOperationResult & {
    categoryId: string;
    authorId: string;
};
export type PublishPageResult = PublishOperationResult & {
    authorId: string;
};
export type ValidatedPublishBlogInput = Omit<PublishBlogInput, "category"> & {
    authorRole: string;
    category: string;
    featured: boolean;
    publishedAt: string;
    seo: NonNullable<PublishBlogInput["seo"]>;
    slug: string;
    tags: string[];
};
export type ValidatedPublishPageInput = Omit<PublishPageInput, "authorRole"> & {
    authorRole: string;
    featured: boolean;
    publishedAt: string;
    seo: NonNullable<PublishPageInput["seo"]>;
    slug: string;
    tags: string[];
};
export type PortableTextBlocks = PortableTextBlock[];
//# sourceMappingURL=publish.d.ts.map