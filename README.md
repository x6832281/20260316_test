# 你的古代人生 / Your Ancient Life

An AI + gamified platform that lets global users live inside real ancient Chinese history. Every day the world faces one historical fork; your irreversible choice is written into a private life-scroll by an AI confidant. Bilingual zh/en.

## Develop

```bash
npm install
npm run dev      # vite dev server
npm test         # vitest run
npm run build    # vue-tsc --noEmit && vite build → dist/
npm run preview  # preview dist/
```

Copy `.env.example` to `.env` and fill in `VITE_OPENAI_API_KEY`.

## Architecture

- `src/data/events/` — historical event library (Tang 天宝年间 first). One `getDailyEvent(date)` feeds both layers.
- Recall layer (`src/components/DailyFork.vue`, `FateCard.vue`, `GroupResult.vue`): daily global fork, irreversible choice, shareable fate card, group reveal.
- Depth layer (`PersonaCreate.vue`, `DestinyJournal.vue`, `ConfidantAdvice.vue`): private persona + AI confidant + journal, stored locally.
- `workers/aggregate/` — Cloudflare Worker + KV counting global choices only.
- `src/ai/` — injectable OpenAI-compatible client + pure prompt builders + fate-card/confidant/narration generators.

See `docs/superpowers/specs/2026-06-27-ancient-life-v4-design.md` for the design.

## Security note

`VITE_OPENAI_API_KEY` is read client-side, so it is **embedded in the production JS bundle** — any visitor can extract it from `dist/assets/index-*.js`. For any public deployment it MUST be a restricted, revocable key with spend caps (ideally a proxy that rate-limits and rewrites the request). The long-term fix is to route AI calls through a proxy Worker that holds the real key server-side and never ships it to browsers; that is out of the current MVP scope. The aggregate Worker takes no secret and counts choices only.
