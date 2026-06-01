import OpenAI, { toFile } from "openai";
import type { TranscriptSegment } from "./youtube.js";

export interface Transcriber {
  transcribe(audio: Buffer, filename: string): Promise<TranscriptSegment[]>;
}

interface WhisperSegment {
  start?: number;
  end?: number;
  text?: string;
}

interface WhisperVerboseResponse {
  text?: string;
  segments?: WhisperSegment[];
}

export class OpenAIWhisperTranscriber implements Transcriber {
  private readonly client: OpenAI;

  constructor(apiKey: string, private readonly model: string) {
    this.client = new OpenAI({ apiKey });
  }

  async transcribe(audio: Buffer, filename: string): Promise<TranscriptSegment[]> {
    const file = await toFile(audio, filename);
    const response = await this.client.audio.transcriptions.create({
      file,
      model: this.model,
      response_format: "verbose_json",
      timestamp_granularities: ["segment"]
    }) as WhisperVerboseResponse;

    if (response.segments?.length) {
      return response.segments
        .map((segment) => ({
          offsetSeconds: Math.max(0, segment.start ?? 0),
          durationSeconds: Math.max(0, (segment.end ?? segment.start ?? 0) - (segment.start ?? 0)),
          text: (segment.text ?? "").trim()
        }))
        .filter((segment) => segment.text.length > 0);
    }

    const text = response.text?.trim();
    return text ? [{ offsetSeconds: 0, durationSeconds: 0, text }] : [];
  }
}
