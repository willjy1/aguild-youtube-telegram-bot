import { describe, expect, it } from "vitest";
import {
  extractFirstYouTubeUrl,
  extractYouTubeVideoId,
  formatTimestamp,
  formatTranscriptForPrompt,
  isYouTubeUrl,
  normalizeTranscriptText
} from "../src/youtube.js";

describe("youtube utilities", () => {
  it("extracts common YouTube URL shapes", () => {
    expect(extractYouTubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(extractYouTubeVideoId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(extractYouTubeVideoId("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(extractYouTubeVideoId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("rejects non-YouTube URLs", () => {
    expect(isYouTubeUrl("https://example.com/watch?v=dQw4w9WgXcQ")).toBe(false);
    expect(isYouTubeUrl("not a url")).toBe(false);
  });

  it("extracts a YouTube URL from normal chat text", () => {
    expect(extractFirstYouTubeUrl("please summarize https://youtu.be/dQw4w9WgXcQ, thanks")).toBe(
      "https://youtu.be/dQw4w9WgXcQ"
    );
    expect(extractFirstYouTubeUrl("no link here")).toBeNull();
  });

  it("formats timestamps for Telegram-readable summaries", () => {
    expect(formatTimestamp(0)).toBe("0:00");
    expect(formatTimestamp(65)).toBe("1:05");
    expect(formatTimestamp(3661)).toBe("1:01:01");
  });

  it("formats transcript segments for LLM prompts", () => {
    expect(formatTranscriptForPrompt([
      { offsetSeconds: 0, durationSeconds: 2, text: "Intro" },
      { offsetSeconds: 62, durationSeconds: 5, text: "Main idea" }
    ])).toBe("[0:00] Intro\n[1:02] Main idea");
  });

  it("normalizes common caption HTML entities", () => {
    expect(normalizeTranscriptText("Tom &amp; Jerry said &quot;hi&#39; &#x41;")).toBe("Tom & Jerry said \"hi' A");
    expect(normalizeTranscriptText("  2 &lt; 3   and 4 &gt; 1  ")).toBe("2 < 3 and 4 > 1");
  });
});
