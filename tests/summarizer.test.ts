import { describe, expect, it } from "vitest";
import { chunkTelegramMessage, detectLanguage } from "../src/summarizer.js";

describe("summarizer utilities", () => {
  it("detects English and Chinese transcript language", () => {
    expect(detectLanguage("This is an English transcript with enough words to classify the content properly.")).toBe("English");
    expect(detectLanguage("这是一个中文视频的字幕内容，包含足够多的汉字来判断主要语言。")).toBe("Chinese");
  });

  it("chunks long Telegram messages", () => {
    const chunks = chunkTelegramMessage(`a\n${"x".repeat(9000)}`, 3800);
    expect(chunks.length).toBeGreaterThan(2);
    expect(chunks.every((chunk) => chunk.length <= 3800)).toBe(true);
  });
});
