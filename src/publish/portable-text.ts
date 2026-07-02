import type {
  PortableTextBlock,
  PortableTextImage,
  PortableTextMarkDef,
  PortableTextNode,
  PortableTextSpan,
} from "../types/blog.js";

function makeKey() {
  return Math.random().toString(36).slice(2, 12);
}

function createSpan(text: string, marks: string[] = []): PortableTextSpan {
  return {
    _key: makeKey(),
    _type: "span",
    marks,
    text,
  };
}

function createLinkMarkDef(href: string): PortableTextMarkDef {
  return {
    _key: makeKey(),
    _type: "link",
    href,
  };
}

type InlineMatch =
  | { kind: "markdown-link"; index: number; length: number; raw: string; text: string; href: string }
  | { kind: "html-link"; index: number; length: number; raw: string; text: string; href: string };

const MARKDOWN_LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;
const HTML_LINK_RE = /<a\s+[^>]*href=(["'])(.*?)\1[^>]*>(.*?)<\/a>/gi;
const MARKDOWN_IMAGE_RE = /^!\[([^\]]*)\]\(([^)]+)\)$/;
const HTML_IMAGE_RE = /^<img\b[^>]*\/?>$/i;

function getHtmlAttribute(tag: string, attributeName: string) {
  const attributeRe = new RegExp(`${attributeName}=(["'])(.*?)\\1`, "i");
  return tag.match(attributeRe)?.[2]?.trim() || "";
}

function getNextInlineMatch(source: string): InlineMatch | null {
  MARKDOWN_LINK_RE.lastIndex = 0;
  HTML_LINK_RE.lastIndex = 0;

  const markdownMatch = MARKDOWN_LINK_RE.exec(source);
  const htmlMatch = HTML_LINK_RE.exec(source);

  const candidates: InlineMatch[] = [];

  if (markdownMatch && typeof markdownMatch.index === "number") {
    candidates.push({
      kind: "markdown-link",
      index: markdownMatch.index,
      length: markdownMatch[0].length,
      raw: markdownMatch[0],
      text: markdownMatch[1],
      href: markdownMatch[2],
    });
  }

  if (htmlMatch && typeof htmlMatch.index === "number") {
    candidates.push({
      kind: "html-link",
      index: htmlMatch.index,
      length: htmlMatch[0].length,
      raw: htmlMatch[0],
      text: htmlMatch[3],
      href: htmlMatch[2],
    });
  }

  if (candidates.length === 0) {
    return null;
  }

  return candidates.sort((a, b) => a.index - b.index)[0];
}

function isLinkSeparator(text: string) {
  return /^[\s,;|/:-]*$/.test(text);
}

function splitAdjacentLinkOnlyListItem(content: string) {
  const items: string[] = [];
  let cursor = 0;

  while (cursor < content.length) {
    const next = getNextInlineMatch(content.slice(cursor));
    if (!next) {
      return items.length > 1 && isLinkSeparator(content.slice(cursor)) ? items : null;
    }

    const absoluteIndex = cursor + next.index;
    if (!isLinkSeparator(content.slice(cursor, absoluteIndex))) {
      return null;
    }

    items.push(next.raw);
    cursor = absoluteIndex + next.length;
  }

  return items.length > 1 ? items : null;
}

function createInlineChildren(text: string) {
  const children: PortableTextSpan[] = [];
  const markDefs: PortableTextMarkDef[] = [];

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

type MarkdownToPortableTextOptions = {
  uploadImage?: (imageUrl: string) => Promise<{ _type: "reference"; _ref: string }>;
};

async function createImageBlock(
  alt: string,
  imageUrl: string,
  options: MarkdownToPortableTextOptions,
): Promise<PortableTextImage> {
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

async function lineToPortableTextNode(
  line: string,
  style: PortableTextBlock["style"],
  options: MarkdownToPortableTextOptions,
): Promise<PortableTextNode> {
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

export async function markdownToPortableText(
  markdown: string,
  options: MarkdownToPortableTextOptions = {},
): Promise<PortableTextNode[]> {
  const lines = markdown
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd());

  const blocks: PortableTextNode[] = [];
  let paragraph: string[] = [];

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
      const listContent = line.slice(2).trim();
      const splitItems = splitAdjacentLinkOnlyListItem(listContent);
      if (splitItems) {
        for (const item of splitItems) {
          const { children, markDefs } = createInlineChildren(item);
          blocks.push({
            _key: makeKey(),
            _type: "block",
            style: "normal",
            listItem: "bullet",
            level: 1,
            markDefs,
            children,
          });
        }
        continue;
      }

      const { children, markDefs } = createInlineChildren(listContent);
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
