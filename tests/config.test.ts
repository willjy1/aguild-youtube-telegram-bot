import { describe, expect, it } from "vitest";
import { loadConfig } from "../src/config.js";

describe("configuration", () => {
  const baseEnv = {
    TELEGRAM_BOT_TOKEN: "123456:test-token",
    OPENAI_API_KEY: "sk-test"
  };

  it("loads safe defaults for local polling mode", () => {
    expect(loadConfig(baseEnv)).toMatchObject({
      BOT_MODE: "polling",
      MAX_VIDEO_SECONDS: 3600,
      OPENAI_SUMMARY_MODEL: "gpt-4.1-mini",
      OPENAI_TRANSCRIBE_MODEL: "whisper-1",
      PORT: 3000
    });
  });

  it("requires a webhook URL in webhook mode", () => {
    expect(() => loadConfig({ ...baseEnv, BOT_MODE: "webhook" })).toThrow(
      "WEBHOOK_URL is required when BOT_MODE=webhook"
    );
  });

  it("accepts a valid webhook deployment configuration", () => {
    expect(loadConfig({
      ...baseEnv,
      BOT_MODE: "webhook",
      WEBHOOK_URL: "https://bot.example.com",
      PORT: "8080",
      MAX_VIDEO_SECONDS: "900"
    })).toMatchObject({
      BOT_MODE: "webhook",
      WEBHOOK_URL: "https://bot.example.com",
      PORT: 8080,
      MAX_VIDEO_SECONDS: 900
    });
  });
});
