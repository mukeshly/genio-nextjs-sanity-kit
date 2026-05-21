import { defineArrayMember, defineField, defineType } from "sanity";

export const pageSchema = defineType({
  name: "page",
  title: "Site Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule: any) => rule.required().min(8).max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule: any) => rule.required(),
    }),
    defineField({
      name: "oldSlugs",
      title: "Old slugs",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule: any) => rule.unique(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (rule: any) => rule.required().min(40).max(220),
    }),
    defineField({
      name: "featured",
      title: "Featured page",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (rule: any) => rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      validation: (rule: any) => rule.max(12),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (rule: any) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule: any) => rule.required(),
        }),
      ],
      validation: (rule: any) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              defineArrayMember({
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (rule: any) =>
                      rule.uri({
                        allowRelative: true,
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              validation: (rule: any) => rule.required(),
            }),
          ],
        }),
      ],
      validation: (rule: any) => rule.required().min(1),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "metaTitle",
          title: "Meta title",
          type: "string",
          validation: (rule: any) => rule.max(70),
        }),
        defineField({
          name: "metaDescription",
          title: "Meta description",
          type: "text",
          rows: 3,
          validation: (rule: any) => rule.max(160),
        }),
        defineField({
          name: "focusKeyword",
          title: "Focus keyword",
          type: "string",
          validation: (rule: any) => rule.max(80),
        }),
        defineField({
          name: "ogTitle",
          title: "Open Graph title",
          type: "string",
          validation: (rule: any) => rule.max(90),
        }),
        defineField({
          name: "ogDescription",
          title: "Open Graph description",
          type: "text",
          rows: 3,
          validation: (rule: any) => rule.max(200),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "seo.focusKeyword",
      media: "coverImage",
      featured: "featured",
    },
    prepare({ featured, media, subtitle, title }: any) {
      const baseSubtitle = subtitle || "Page";
      return {
        title,
        subtitle: featured ? `${baseSubtitle} • Featured` : baseSubtitle,
        media,
      };
    },
  },
});
