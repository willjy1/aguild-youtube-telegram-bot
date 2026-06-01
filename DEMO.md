# Credential-Free Demo

This demo is for source-only review before live Telegram and OpenAI credentials are available.

Run it with:

```bash
npm run demo
```

Expected output:

```text
Video: AGuild demo: shipping a Telegram YouTube summarizer
Language: English
Transcript source: captions

## Timestamped Summary
- [0:00] The walkthrough introduces the Telegram bot and its purpose.
- [0:14] The bot validates YouTube links, tries captions first, and uses Whisper as a fallback.
- [0:35] The summary model returns a timestamped outline, key takeaways, and follow-up questions.
- [0:55] The demo path is runnable without private credentials.

## Key Takeaways
- Reviewers can verify the response format without deploying a live bot.
- Production use still needs Telegram and OpenAI-compatible runtime credentials.
- The same formatting path is used for caption and Whisper transcript sources.

## Follow-up Questions
- Which hosting target should receive the live webhook deployment?
- Should the accepted bot default to English, Chinese, or transcript-language output?
```

The live bot uses the same response sections after it fetches captions or falls back to Whisper transcription.
