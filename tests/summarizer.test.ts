import { describe, expect, it } from "vitest";
import { chunkTelegramMessage, detectLanguage } from "../src/summarizer.js";

describe("summarizer utilities", () => {
  it("detects English and Chinese transcript language", () => {
    expect(detectLanguage("This is an English transcript with enough words to classify the content properly.")).toBe("English");
    expect(detectLanguage(
      "\u8fd9\u662f\u4e00\u4e2a\u4e2d\u6587\u89c6\u9891\u7684\u5b57\u5e55\u5185\u5bb9\uff0c" +
      "\u5305\u542b\u8db3\u591f\u591a\u7684\u6c49\u5b57\u6765\u5224\u65ad\u4e3b\u8981\u8bed\u8a00\u3002"
    )).toBe("Chinese");
  });

  it("chunks long Telegram messages", () => {
    const chunks = chunkTelegramMessage(`a\n${"x".repeat(9000)}`, 3800);
    expect(chunks.length).toBeGreaterThan(2);
    expect(chunks.every((chunk) => chunk.length <= 3800)).toBe(true);
  });
});
