import "dotenv/config";
import http from "node:http";
import { webhookCallback } from "grammy";
import { run } from "@grammyjs/runner";
import { createBot } from "./bot.js";
import { loadConfig } from "./config.js";
import { OpenAISummaryClient } from "./summarizer.js";
import { OpenAIWhisperTranscriber } from "./transcriber.js";

async function main(): Promise<void> {
  const config = loadConfig();
  const summaryClient = new OpenAISummaryClient(config.OPENAI_API_KEY, config.OPENAI_SUMMARY_MODEL);
  const transcriber = new OpenAIWhisperTranscriber(config.OPENAI_API_KEY, config.OPENAI_TRANSCRIBE_MODEL);
  const bot = createBot(config, summaryClient, transcriber);

  if (config.BOT_MODE === "webhook") {
    await bot.api.setWebhook(config.WEBHOOK_URL!);
    const server = http.createServer(webhookCallback(bot, "http"));
    server.listen(config.PORT, () => {
      console.log(`Webhook bot listening on port ${config.PORT}`);
    });
    return;
  }

  run(bot);
  console.log("Polling bot started.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
