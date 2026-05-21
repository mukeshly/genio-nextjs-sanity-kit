import { defineField, defineType } from "sanity";
export const siteSettingsSchema = defineType({
    name: "siteSettings",
    title: "Site Settings",
    type: "document",
    fields: [
        defineField({
            name: "siteName",
            title: "Site name",
            type: "string",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "siteUrl",
            title: "Site URL",
            type: "url",
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: "defaultOgImage",
            title: "Default OG image",
            type: "image",
            options: {
                hotspot: true,
            },
        }),
        defineField({
            name: "seo",
            title: "SEO defaults",
            type: "object",
            fields: [
                defineField({ name: "metaTitle", title: "Meta title", type: "string" }),
                defineField({ name: "metaDescription", title: "Meta description", type: "text" }),
            ],
        }),
    ],
});
