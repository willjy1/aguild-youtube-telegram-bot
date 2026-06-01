# Deployment Handoff

This bot is source-ready and can be deployed without code changes once the quest giver provides runtime secrets.

## Required Secrets

| Variable | Purpose |
| --- | --- |
| `TELEGRAM_BOT_TOKEN` | Token from BotFather for the live Telegram bot |
| `OPENAI_API_KEY` | Summarization and Whisper-compatible transcription |
| `OPENAI_SUMMARY_MODEL` | Defaults to `gpt-4.1-mini` |
| `OPENAI_TRANSCRIBE_MODEL` | Defaults to `whisper-1` |
| `BOT_MODE` | Use `webhook` for hosted deployment, `polling` for local testing |
| `WEBHOOK_URL` | Public HTTPS app URL when `BOT_MODE=webhook` |
| `PORT` | Host-provided port, defaults to `3000` |
| `MAX_VIDEO_SECONDS` | Safety cap for Whisper fallback audio downloads |

## Local Smoke Test

```bash
npm ci
npm test
npm run build
npm audit
npm run dev
```

Then message the bot with a public YouTube URL.

## Railway

1. Create a Railway service from this repository.
2. Set the required secrets above.
3. Use `BOT_MODE=webhook`.
4. Set `WEBHOOK_URL` to the Railway public service URL.
5. Deploy with the default Dockerfile.

Expected successful startup log:

```text
Webhook bot listening on port <PORT>
```

## Render or Fly.io

Use the Dockerfile and the same environment variables. The container runs `npm start`, which serves Telegram webhook requests in webhook mode.

## Source-Only Handoff

If deployment credentials should not be shared, the quest giver can fork the repository, set the environment variables in their own host, and run the verification commands above. No private token needs to be committed or sent through GitHub.
