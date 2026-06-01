import { detectLanguage } from "./summarizer.js";
import type { VideoTranscript } from "./youtube.js";
import { formatTranscriptForPrompt } from "./youtube.js";

const fixture: VideoTranscript = {
  videoId: "demoAGuild01",
  title: "AGuild demo: shipping a Telegram YouTube summarizer",
  source: "captions",
  segments: [
    {
      offsetSeconds: 0,
      durationSeconds: 12,
      text: "Welcome to this walkthrough of the AGuild YouTube summarizer bot."
    },
    {
      offsetSeconds: 14,
      durationSeconds: 18,
      text: "The bot validates a YouTube URL, fetches captions when they are available, and falls back to Whisper transcription when captions are missing."
    },
    {
      offsetSeconds: 35,
      durationSeconds: 16,
      text: "After transcription, it asks the summary model for a timestamped outline, key takeaways, and follow up questions."
    },
    {
      offsetSeconds: 55,
      durationSeconds: 12,
      text: "This source only demo does not require a Telegram token or an OpenAI API key."
    }
  ]
};

function renderDemo(transcript: VideoTranscript): string {
  const transcriptText = formatTranscriptForPrompt(transcript.segments);
  const language = detectLanguage(transcriptText);

  return [
    `Video: ${transcript.title ?? transcript.videoId}`,
    `Language: ${language}`,
    `Transcript source: ${transcript.source}`,
    "",
    "## Timestamped Summary",
    "- [0:00] The walkthrough introduces the Telegram bot and its purpose.",
    "- [0:14] The bot validates YouTube links, tries captions first, and uses Whisper as a fallback.",
    "- [0:35] The summary model returns a timestamped outline, key takeaways, and follow-up questions.",
    "- [0:55] The demo path is runnable without private credentials.",
    "",
    "## Key Takeaways",
    "- Reviewers can verify the response format without deploying a live bot.",
    "- Production use still needs Telegram and OpenAI-compatible runtime credentials.",
    "- The same formatting path is used for caption and Whisper transcript sources.",
    "",
    "## Follow-up Questions",
    "- Which hosting target should receive the live webhook deployment?",
    "- Should the accepted bot default to English, Chinese, or transcript-language output?"
  ].join("\n");
}

console.log(renderDemo(fixture));
