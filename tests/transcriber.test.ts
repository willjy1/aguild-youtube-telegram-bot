import { describe, expect, it } from "vitest";
import type { Transcriber } from "../src/transcriber.js";
import type { TranscriptSegment } from "../src/youtube.js";

describe("transcriber contract", () => {
  it("allows a Whisper-compatible implementation to return timestamped segments", async () => {
    const transcriber: Transcriber = {
      async transcribe(): Promise<TranscriptSegment[]> {
        return [
          { offsetSeconds: 0, durationSeconds: 8, text: "Intro" },
          { offsetSeconds: 8, durationSeconds: 12, text: "Main topic" }
        ];
      }
    };

    await expect(transcriber.transcribe(Buffer.from("audio"), "video.webm")).resolves.toEqual([
      { offsetSeconds: 0, durationSeconds: 8, text: "Intro" },
      { offsetSeconds: 8, durationSeconds: 12, text: "Main topic" }
    ]);
  });
});
