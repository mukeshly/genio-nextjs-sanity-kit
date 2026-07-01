function makeKey() {
    return Math.random().toString(36).slice(2, 12);
}
function createSpan(text, marks = []) {
    return {
        _key: makeKey(),
        _type: "span",
        marks,
        text,
    };
}
function createLinkMarkDef(href) {
    return {
        _key: makeKey(),
        _type: "link",
        href,
    };
}
const MARKDOWN_LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;
const HTML_LINK_RE = /<a\s+[^>]*href=(["'])(.*?)\1[^>]*>(.*?)<\/a>/gi;
const MARKDOWN_IMAGE_RE = /^!\[([^\]]*)\]\(([^)]+)\)$/;
const HTML_IMAGE_RE = /^<img\b[^>]*\/?>$/i;
function getHtmlAttribute(tag, attributeName) {
    const attributeRe = new RegExp(`${attributeName}=(["'])(.*?)\\1`, "i");
    return tag.match(attributeRe)?.[2]?.trim() || "";
}
function getNextInlineMatch(source) {
    MARKDOWN_LINK_RE.lastIndex = 0;
    HTML_LINK_RE.lastIndex = 0;
    const markdownMatch = MARKDOWN_LINK_RE.exec(source);
    const htmlMatch = HTML_LINK_RE.exec(source);
    const candidates = [];
    if (markdownMatch && typeof markdownMatch.index === "number") {
        candidates.push({
            kind: "markdown-link",
            index: markdownMatch.index,
            length: markdownMatch[0].length,
            text: markdownMatch[1],
            href: markdownMatch[2],
        });
    }
    if (htmlMatch && typeof htmlMatch.index === "number") {
        candidates.push({
            kind: "html-link",
            index: htmlMatch.index,
            length: htmlMatch[0].length,
            text: htmlMatch[3],
            href: htmlMatch[2],
        });
    }
    if (candidates.length === 0) {
        return null;
    }
    return candidates.sort((a, b) => a.index - b.index)[0];
}
function createInlineChildren(text) {
    const children = [];
    const markDefs = [];
    let cursor = 0;
    while (cursor < text.length) {
        const next = getNextInlineMatch(text.slice(cursor));
        if (!next) {
            children.push(createSpan(text.slice(cursor)));
            break;
        }
        const absoluteIndex = cursor + next.index;
        if (absoluteIndex > cursor) {
            children.push(createSpan(text.slice(cursor, absoluteIndex)));
        }
        const markDef = createLinkMarkDef(next.href);
        markDefs.push(markDef);
        children.push(createSpan(next.text, [markDef._key]));
        cursor = absoluteIndex + next.length;
    }
    const normalizedChildren = children.filter((child) => child.text.length > 0);
    return {
        children: normalizedChildren.length > 0 ? normalizedChildren : [createSpan(text)],
        markDefs,
    };
}
async function createImageBlock(alt, imageUrl, options) {
    if (!options.uploadImage) {
        throw new Error("Markdown body image found but no uploadImage handler was provided.");
    }
    const asset = await options.uploadImage(imageUrl);
    return {
        _key: makeKey(),
        _type: "image",
        alt,
        asset,
    };
}
async function lineToPortableTextNode(line, style, options) {
    const markdownImage = line.match(MARKDOWN_IMAGE_RE);
    if (markdownImage) {
        return createImageBlock(markdownImage[1].trim(), markdownImage[2].trim(), options);
    }
    if (HTML_IMAGE_RE.test(line)) {
        const imageUrl = getHtmlAttribute(line, "src");
        if (!imageUrl) {
            throw new Error("HTML body image found but no src attribute was provided.");
        }
        return createImageBlock(getHtmlAttribute(line, "alt"), imageUrl, options);
    }
    const { children, markDefs } = createInlineChildren(line);
    return {
        _key: makeKey(),
        _type: "block",
        style,
        markDefs,
        children,
    };
}
export async function markdownToPortableText(markdown, options = {}) {
    const lines = markdown
        .replace(/\r\n/g, "\n")
        .split("\n")
        .map((line) => line.trimEnd());
    const blocks = [];
    let paragraph = [];
    const flushParagraph = async () => {
        const text = paragraph.join(" ").trim();
        if (!text) {
            paragraph = [];
            return;
        }
        blocks.push(await lineToPortableTextNode(text, "normal", options));
        paragraph = [];
    };
    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) {
            await flushParagraph();
            continue;
        }
        if (line.startsWith("## ")) {
            await flushParagraph();
            blocks.push(await lineToPortableTextNode(line.slice(3).trim(), "h2", options));
            continue;
        }
        if (line.startsWith("### ")) {
            await flushParagraph();
            blocks.push(await lineToPortableTextNode(line.slice(4).trim(), "h3", options));
            continue;
        }
        if (line.startsWith("> ")) {
            await flushParagraph();
            blocks.push(await lineToPortableTextNode(line.slice(2).trim(), "blockquote", options));
            continue;
        }
        if (/^- /.test(line)) {
            await flushParagraph();
            const { children, markDefs } = createInlineChildren(line.slice(2).trim());
            blocks.push({
                _key: makeKey(),
                _type: "block",
                style: "normal",
                listItem: "bullet",
                level: 1,
                markDefs,
                children,
            });
            continue;
        }
        if (/^\d+\.\s/.test(line)) {
            await flushParagraph();
            const { children, markDefs } = createInlineChildren(line.replace(/^\d+\.\s/, "").trim());
            blocks.push({
                _key: makeKey(),
                _type: "block",
                style: "normal",
                listItem: "number",
                level: 1,
                markDefs,
                children,
            });
            continue;
        }
        if (MARKDOWN_IMAGE_RE.test(line) || HTML_IMAGE_RE.test(line)) {
            await flushParagraph();
            blocks.push(await lineToPortableTextNode(line, "normal", options));
            continue;
        }
        paragraph.push(line);
    }
    await flushParagraph();
    if (blocks.length === 0) {
        throw new Error("bodyMarkdown did not produce any content blocks");
    }
    return blocks;
}
