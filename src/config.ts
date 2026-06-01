import { z } from "zod";

const ConfigSchema = z.object({
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_SUMMARY_MODEL: z.string().default("gpt-4.1-mini"),
  OPENAI_TRANSCRIBE_MODEL: z.string().default("whisper-1"),
  BOT_MODE: z.enum(["polling", "webhook"]).default("polling"),
  WEBHOOK_URL: z.string().url().optional(),
  PORT: z.coerce.number().int().positive().default(3000),
  MAX_VIDEO_SECONDS: z.coerce.number().int().positive().default(3600)
});

export type BotConfig = z.infer<typeof ConfigSchema>;

export function loadConfig(env: NodeJS.ProcessEnv = process.env): BotConfig {
  const parsed = ConfigSchema.safeParse(env);
  if (!parsed.success) {
    const details = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
    throw new Error(`Invalid configuration: ${details}`);
  }

  if (parsed.data.BOT_MODE === "webhook" && !parsed.data.WEBHOOK_URL) {
    throw new Error("WEBHOOK_URL is required when BOT_MODE=webhook");
  }

  return parsed.data;
}
