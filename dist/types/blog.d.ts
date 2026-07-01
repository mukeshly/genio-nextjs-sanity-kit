export type PortableTextSpan = {
    _key: string;
    _type: "span";
    marks?: string[];
    text: string;
};
export type PortableTextMarkDef = {
    _key: string;
    _type: "link";
    href: string;
};
export type PortableTextBlock = {
    _key: string;
    _type: "block";
    children?: PortableTextSpan[];
    markDefs?: PortableTextMarkDef[];
    listItem?: "bullet" | "number";
    level?: number;
    style?: "normal" | "h2" | "h3" | "blockquote";
};
export type PortableTextImage = {
    _key: string;
    _type: "image";
    alt?: string;
    url?: string;
    _seoImageUrl?: string;
    asset?: {
        _ref: string;
        _type: "reference";
    };
};
export type PortableTextNode = PortableTextBlock | PortableTextImage;
export type AuthorReference = {
    image?: {
        _type: "image";
        alt?: string;
        asset: {
            _ref: string;
            _type: "reference";
        };
    };
    name: string;
    role?: string;
};
export type CategoryReference = {
    title: string;
    slug?: string;
};
export type CategoryValue = CategoryReference | string;
export type PostType = "article" | "pillar";
export type SeoFields = {
    metaDescription?: string;
    metaTitle?: string;
    focusKeyword?: string;
    ogDescription?: string;
    ogTitle?: string;
};
export type BlogPostDocument = {
    _id: string;
    _updatedAt: string;
    content?: string | null;
    oldSlugs?: string[];
    author?: AuthorReference;
    body?: PortableTextNode[] | null;
    category?: CategoryValue | null;
    coverImage?: {
        _type: "image";
        alt: string;
        asset: {
            _ref: string;
            _type: "reference";
        };
    };
    description: string;
    featured?: boolean;
    postType: PostType;
    publishedAt: string;
    slug: string;
    tags?: string[];
    title: string;
    seo?: SeoFields;
};
export type BlogPostSummary = BlogPostDocument & {
    categoryLabel: string;
    publishedLabel: string;
    updatedLabel?: string;
    wasUpdated: boolean;
    readingTime: string;
};
export type SitePageDocument = {
    _id: string;
    _updatedAt: string;
    title: string;
    slug: string;
    oldSlugs?: string[];
    description: string;
    featured?: boolean;
    publishedAt: string;
    body?: PortableTextNode[] | null;
    author?: AuthorReference;
    coverImage?: {
        _type: "image";
        alt: string;
        asset: {
            _ref: string;
            _type: "reference";
        };
    };
    tags?: string[];
    seo?: SeoFields;
};
export type SitePageSummary = SitePageDocument & {
    publishedLabel: string;
    updatedLabel?: string;
    wasUpdated: boolean;
    readingTime: string;
};
//# sourceMappingURL=blog.d.ts.map