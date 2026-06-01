import OpenAI from "openai";
import type { VideoTranscript } from "./youtube.js";
import { formatTranscriptForPrompt } from "./youtube.js";

export interface SummaryResult {
  language: "English" | "Chinese" | "Mixed/Unknown";
  markdown: string;
}

export interface SummaryClient {
  summarize(transcript: VideoTranscript): Promise<SummaryResult>;
}

export class OpenAISummaryClient implements SummaryClient {
  private readonly client: OpenAI;

  constructor(apiKey: string, private readonly model: string) {
    this.client = new OpenAI({ apiKey });
  }

  async summarize(transcript: VideoTranscript): Promise<SummaryResult> {
    const transcriptText = formatTranscriptForPrompt(transcript.segments);
    const language = detectLanguage(transcriptText);
    const response = await this.client.chat.completions.create({
      model: this.model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You summarize YouTube videos for a Telegram bot. Preserve timestamps, be concise, and write in the video's main language. For Chinese, use Simplified Chinese unless the transcript is clearly Traditional Chinese."
        },
        {
          role: "user",
          content: [
            `Video title: ${transcript.title ?? "Untitled"}`,
            `Transcript source: ${transcript.source}`,
            `Detected language: ${language}`,
            "",
            "Return Markdown with exactly these sections:",
            "1. Timestamped Summary",
            "2. Key Takeaways",
            "3. Follow-up Questions",
            "",
            "Transcript:",
            transcriptText.slice(0, 120000)
          ].join("\n")
        }
      ]
    });

    return {
      language,
      markdown: response.choices[0]?.message.content?.trim() ?? "No summary returned."
    };
  }
}

export function detectLanguage(text: string): SummaryResult["language"] {
  const sample = text.slice(0, 4000);
  const cjkChars = sample.match(/[\u3400-\u9fff]/g)?.length ?? 0;
  const latinWords = sample.match(/[A-Za-z]{2,}/g)?.length ?? 0;

  if (cjkChars >= 10 && cjkChars > latinWords) {
    return "Chinese";
  }
  if (latinWords >= 10) {
    return "English";
  }
  return "Mixed/Unknown";
}

export function chunkTelegramMessage(markdown: string, maxLength = 3800): string[] {
  if (markdown.length <= maxLength) {
    return [markdown];
  }

  const chunks: string[] = [];
  let remaining = markdown;
  while (remaining.length > maxLength) {
    const splitAt = Math.max(remaining.lastIndexOf("\n", maxLength), remaining.lastIndexOf(". ", maxLength));
    const safeSplit = splitAt > 500 ? splitAt : maxLength;
    chunks.push(remaining.slice(0, safeSplit).trim());
    remaining = remaining.slice(safeSplit).trim();
  }
  if (remaining.length > 0) {
    chunks.push(remaining);
  }
  return chunks;
}
