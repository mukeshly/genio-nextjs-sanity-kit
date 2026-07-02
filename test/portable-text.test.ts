import assert from "node:assert/strict";
import test from "node:test";

import { markdownToPortableText } from "../src/publish/portable-text.js";

test("converts inline markdown links in paragraphs into Portable Text marks", async () => {
  const body = await markdownToPortableText(
    "Read [Idea To Market Strategy](/idea-to-market-strategy) before launch.",
  );

  const paragraphBlock = body[0];
  assert.equal(paragraphBlock?._type, "block");
  assert.equal(paragraphBlock?.markDefs?.length, 1);
  assert.equal(paragraphBlock?.markDefs?.[0]?.href, "/idea-to-market-strategy");

  const linkedChild = paragraphBlock?.children?.find((child) => child.text === "Idea To Market Strategy");
  assert.ok(linkedChild);
  assert.deepEqual(linkedChild?.marks, [paragraphBlock?.markDefs?.[0]?._key]);
});

test("preserves whitespace around inline paragraph links", async () => {
  const body = await markdownToPortableText(
    "Rigorous [product idea validation research](/product-idea-validation-research) becomes paramount.",
  );

  const paragraphBlock = body[0];
  assert.equal(paragraphBlock?._type, "block");
  assert.equal(paragraphBlock?.children?.[0]?.text, "Rigorous ");
  assert.equal(paragraphBlock?.children?.[1]?.text, "product idea validation research");
  assert.equal(paragraphBlock?.children?.[2]?.text, " becomes paramount.");
});

test("converts markdown links inside list items into Portable Text marks", async () => {
  const body = await markdownToPortableText(
    "- [Idea To Market Strategy](/idea-to-market-strategy)\n- [Digital Product Strategy Roadmap](/digital-product-strategy-roadmap)",
  );

  const listBlocks = body.filter((block) => block._type === "block" && block.listItem === "bullet");
  assert.equal(listBlocks.length, 2);
  assert.equal(listBlocks[0]?.markDefs?.[0]?.href, "/idea-to-market-strategy");
  assert.equal(listBlocks[1]?.markDefs?.[0]?.href, "/digital-product-strategy-roadmap");
  assert.equal(listBlocks[0]?.children?.[0]?.text, "Idea To Market Strategy");
  assert.equal(listBlocks[1]?.children?.[0]?.text, "Digital Product Strategy Roadmap");
});

test("splits malformed single bullet lines with multiple adjacent markdown links into separate bullet items", async () => {
  const body = await markdownToPortableText(
    "- [Idea To Market Strategy](/idea-to-market-strategy)[Digital Product Strategy Roadmap](/digital-product-strategy-roadmap)[Strategic Product Design Prototyping](/strategic-product-design-prototyping)",
  );

  const listBlocks = body.filter((block) => block._type === "block" && block.listItem === "bullet");
  assert.equal(listBlocks.length, 3);
  assert.equal(listBlocks[0]?.children?.[0]?.text, "Idea To Market Strategy");
  assert.equal(listBlocks[1]?.children?.[0]?.text, "Digital Product Strategy Roadmap");
  assert.equal(listBlocks[2]?.children?.[0]?.text, "Strategic Product Design Prototyping");
  assert.equal(listBlocks[0]?.markDefs?.[0]?.href, "/idea-to-market-strategy");
  assert.equal(listBlocks[1]?.markDefs?.[0]?.href, "/digital-product-strategy-roadmap");
  assert.equal(listBlocks[2]?.markDefs?.[0]?.href, "/strategic-product-design-prototyping");
});

test("converts inline HTML anchor tags into Portable Text marks", async () => {
  const body = await markdownToPortableText(
    'For a deeper dive, read <a href="/strategic-product-design-prototyping">From Concept to Prototype</a> next.',
  );

  const paragraphBlock = body[0];
  assert.equal(paragraphBlock?._type, "block");
  assert.equal(paragraphBlock?.markDefs?.length, 1);
  assert.equal(paragraphBlock?.markDefs?.[0]?.href, "/strategic-product-design-prototyping");

  const linkedChild = paragraphBlock?.children?.find((child) => child.text === "From Concept to Prototype");
  assert.ok(linkedChild);
  assert.deepEqual(linkedChild?.marks, [paragraphBlock?.markDefs?.[0]?._key]);
});

test("converts standalone markdown images into Portable Text image blocks", async () => {
  const body = await markdownToPortableText(
    "Intro paragraph.\n\n![Article image](https://example.com/article-image.jpg)",
    {
      uploadImage: async (imageUrl) => {
        assert.equal(imageUrl, "https://example.com/article-image.jpg");
        return {
          _type: "reference",
          _ref: "image-test-asset",
        };
      },
    },
  );

  const imageBlock = body.find((block) => block._type === "image");
  assert.ok(imageBlock);
  assert.equal(imageBlock?._type, "image");
  assert.equal(imageBlock?.alt, "Article image");
  assert.equal(imageBlock?.asset?._ref, "image-test-asset");
});

test("converts standalone HTML images into Portable Text image blocks regardless of attribute order", async () => {
  const body = await markdownToPortableText(
    'Intro paragraph.\n\n<img alt="Article image" loading="lazy" src="https://example.com/article-image.jpg" />',
    {
      uploadImage: async (imageUrl) => {
        assert.equal(imageUrl, "https://example.com/article-image.jpg");
        return {
          _type: "reference",
          _ref: "image-test-asset",
        };
      },
    },
  );

  const imageBlock = body.find((block) => block._type === "image");
  assert.ok(imageBlock);
  assert.equal(imageBlock?._type, "image");
  assert.equal(imageBlock?.alt, "Article image");
  assert.equal(imageBlock?.asset?._ref, "image-test-asset");
});
