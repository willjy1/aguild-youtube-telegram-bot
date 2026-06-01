# AGuild YouTube Summary Telegram Bot

Telegram bot for AGuild quest #5. It accepts a YouTube URL and returns a timestamped summary with key takeaways for English and Chinese videos.

[![CI](https://github.com/willjy1/aguild-youtube-telegram-bot/actions/workflows/ci.yml/badge.svg)](https://github.com/willjy1/aguild-youtube-telegram-bot/actions/workflows/ci.yml)

## Features

- Validates YouTube URLs before queueing work.
- Uses YouTube captions first when available.
- Falls back to OpenAI Whisper-compatible audio transcription when captions are missing.
- Produces timestamped summary sections, key takeaways, and language-specific output.
- Works in local polling mode or webhook mode for Railway/Vercel-style hosting.
- Includes tests for URL validation, transcript formatting, language detection, and summary parsing.

## Requirements

- Node.js 20+
- Telegram bot token from BotFather
- `OPENAI_API_KEY` for summarization and Whisper fallback

The bot can run without deployment credentials locally, but a live Telegram deployment requires `TELEGRAM_BOT_TOKEN`.

## Setup

```bash
npm install
cp .env.example .env
npm run build
npm test
npm run dev
```

Required `.env` values:

```bash
TELEGRAM_BOT_TOKEN=123456:telegram-token
OPENAI_API_KEY=sk-...
OPENAI_SUMMARY_MODEL=gpt-4.1-mini
OPENAI_TRANSCRIBE_MODEL=whisper-1
BOT_MODE=polling
```

## Railway Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for Railway, Render, Fly.io, webhook, and source-only handoff instructions.

## Usage

Send the bot a YouTube URL:

```text
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

The reply contains:

- Detected language
- Timestamped outline
- Key takeaways
- Short operational note if captions were used or Whisper fallback was required

## Operational Limits

- `MAX_VIDEO_SECONDS` defaults to 3600 to avoid runaway jobs.
- Very long videos should be split before summarization.
- Private, age-restricted, or region-blocked videos may fail caption and audio extraction.
- If no captions are available, Whisper fallback downloads the video's audio stream and requires OpenAI API access.

## Quest Handoff Notes

The source is ready for local verification. A live demo requires the quest giver or adventurer to provide:

- Telegram bot token
- hosting target or webhook URL
- OpenAI-compatible API key for summarization and transcription
- accepted payout/revision process
