import { Bot } from "grammy";
import type { BotConfig } from "./config.js";
import type { SummaryClient } from "./summarizer.js";
import { chunkTelegramMessage } from "./summarizer.js";
import type { Transcriber } from "./transcriber.js";
import { extractFirstYouTubeUrl, fetchVideoTranscript } from "./youtube.js";

export function createBot(config: BotConfig, summaryClient: SummaryClient, transcriber: Transcriber): Bot {
  const bot = new Bot(config.TELEGRAM_BOT_TOKEN);

  bot.command("start", async (ctx) => {
    await ctx.reply("Send me a YouTube URL. I will return a timestamped summary and key takeaways.");
  });

  bot.on("message:text", async (ctx) => {
    const text = ctx.message.text.trim();
    const url = extractFirstYouTubeUrl(text);
    if (!url) {
      await ctx.reply("Please send a valid YouTube URL.");
      return;
    }

    const progress = await ctx.reply("Reading transcript and preparing summary...");
    try {
      const transcript = await fetchVideoTranscript(url, transcriber, config.MAX_VIDEO_SECONDS);
      if (transcript.segments.length === 0) {
        throw new Error("No transcript segments were found.");
      }

      const summary = await summaryClient.summarize(transcript);
      const header = [
        `Video: ${transcript.title ?? transcript.videoId}`,
        `Language: ${summary.language}`,
        `Transcript source: ${transcript.source}`,
        ""
      ].join("\n");

      for (const chunk of chunkTelegramMessage(`${header}${summary.markdown}`)) {
        await ctx.reply(chunk);
      }
      await ctx.api.deleteMessage(ctx.chat.id, progress.message_id).catch(() => undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      await ctx.reply(`Could not summarize this video yet: ${message}`);
    }
  });

  return bot;
}
