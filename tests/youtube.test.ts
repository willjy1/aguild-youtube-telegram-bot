import { describe, expect, it } from "vitest";
import { extractYouTubeVideoId, formatTimestamp, formatTranscriptForPrompt, isYouTubeUrl } from "../src/youtube.js";

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
});
