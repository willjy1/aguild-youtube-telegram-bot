import ytdl from "ytdl-core";
import { YoutubeTranscript } from "youtube-transcript";

export interface TranscriptSegment {
  offsetSeconds: number;
  durationSeconds: number;
  text: string;
}

export interface VideoTranscript {
  videoId: string;
  title?: string;
  source: "captions" | "whisper";
  segments: TranscriptSegment[];
}

const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"]);

export function extractYouTubeVideoId(input: string): string | null {
  try {
    const url = new URL(input.trim());
    if (!YOUTUBE_HOSTS.has(url.hostname)) {
      return null;
    }

    if (url.hostname === "youtu.be") {
      return cleanVideoId(url.pathname.slice(1));
    }

    if (url.pathname === "/watch") {
      return cleanVideoId(url.searchParams.get("v") ?? "");
    }

    const shortsMatch = url.pathname.match(/^\/shorts\/([^/?#]+)/);
    if (shortsMatch) {
      return cleanVideoId(shortsMatch[1]);
    }

    const embedMatch = url.pathname.match(/^\/embed\/([^/?#]+)/);
    if (embedMatch) {
      return cleanVideoId(embedMatch[1]);
    }

    return null;
  } catch {
    return null;
  }
}

export function isYouTubeUrl(input: string): boolean {
  return extractYouTubeVideoId(input) !== null;
}

export async function fetchCaptionTranscript(url: string): Promise<VideoTranscript> {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    throw new Error("Invalid YouTube URL");
  }

  const [transcript, info] = await Promise.all([
    YoutubeTranscript.fetchTranscript(url),
    ytdl.getBasicInfo(url).catch(() => null)
  ]);

  return {
    videoId,
    title: info?.videoDetails.title,
    source: "captions",
    segments: transcript.map((entry) => ({
      offsetSeconds: Math.max(0, entry.offset / 1000),
      durationSeconds: Math.max(0, entry.duration / 1000),
      text: normalizeTranscriptText(entry.text)
    })).filter((entry) => entry.text.length > 0)
  };
}

export function formatTranscriptForPrompt(segments: TranscriptSegment[]): string {
  return segments
    .map((segment) => `[${formatTimestamp(segment.offsetSeconds)}] ${segment.text}`)
    .join("\n");
}

export function formatTimestamp(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  }
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function cleanVideoId(value: string): string | null {
  const id = value.trim();
  return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
}

function normalizeTranscriptText(value: string): string {
  return value.replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}
