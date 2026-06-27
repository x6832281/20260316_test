# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repo is **你的古代人生 / Your Ancient Life** — an AI + gamified platform that lets global users "live" inside real ancient Chinese history. Every day the world faces one historical fork (the **recall layer**); the same fork also writes into the user's private Tang-dynasty life with an AI confidant (the **depth layer**). Bilingual zh/en, local storage (no backend except a global aggregate-count worker).

- **Design spec:** `docs/superpowers/specs/2026-06-27-ancient-life-v4-design.md` (v4; supersedes the v3 `docs/PRODUCT_PLAN.md`, which is kept for history).
- **Implementation plan:** `docs/superpowers/plans/2026-06-27-ancient-life-v4-mvp.md`.
- **Product rules:** `.trae/rules/project_rules.md`.
- Stack: Vite 6 + Vue 3 + TypeScript + Tailwind + vue-i18n, Vitest for tests, Cloudflare Workers + KV for the aggregate counter. Deploy target: Vercel / Cloudflare Pages.

## Commands

```bash
npm install        # install deps
npm run dev        # vite dev server
npm run build      # vue-tsc --noEmit && vite build → dist/
npm run preview    # preview the built dist/
npm test           # vitest run
```

Tests: `npm test` (Vitest). No linter. Windows: use plain `npm`.

## Architecture (current)

Dual-layer SPA. One shared historical event library feeds both layers ("one question, two uses").

- `src/data/events/` — historical event library (Tang 天宝年间 first). `getDailyEvent(date)` is deterministic by UTC date, so the whole world sees one fork per day.
- **Recall layer** (`src/components/DailyFork.vue`, `FateCard.vue`, `GroupResult.vue`): daily global fork, irreversible 三选一, AI fate card (shareable), group-result reveal.
- **Depth layer** (`src/components/PersonaCreate.vue`, `DestinyJournal.vue`, `ConfidantAdvice.vue`): private persona (bound to a real reign year) + AI confidant + AI-narrated journal, stored locally.
- `src/ai/` — injectable OpenAI-compatible chat client (`client.ts`) + pure prompt builders (`prompts.ts`) + fate-card / confidant / narration generators. All AI output is constrained to "must fit the year, no inventing major historical facts."
- `src/store/` — `persona.ts` + `destiny.ts` (localStorage; keys `yal.persona`, `yal.journal`).
- `src/lib/` — shared types (`types.ts`; `LocalizedText` carries a string index signature so `text[locale]` type-checks) + anonymous `deviceId.ts`.
- `src/i18n/` — vue-i18n with `zh` / `en` locales.
- `workers/aggregate/` — Cloudflare Worker + KV that counts choices only (one per device per event). The ONLY backend. Browser client in `src/aggregate/client.ts` (injectable fetch).
- `vite.config.ts` — `root: '.'`, `base: './'` (relative paths for sub-path/static hosting), `outDir: dist`.

`npm run build` runs `vue-tsc --noEmit && vite build`. Deploy target: Vercel / Cloudflare Pages.

## Product constraints (from `.trae/rules/project_rules.md`)

These are durable product rules — apply them to any new feature work:

- Core positioning: AI + gamification + ancient Chinese history + global market. Not a content/encyclopedia/blog/article-aggregation site.
- Bilingual (zh/en) structure must be reserved in all user-facing copy.
- Start lightweight with a Vite static site; prioritize shareable/retentive/extensible forms (tests, dialogue, civilization-comparison features first).
- Monetization path: traffic → subscription → content/IP.

## Notes

- `.trae/` holds the Trae IDE's project rules. The current design is the v4 spec at `docs/superpowers/specs/2026-06-27-ancient-life-v4-design.md`.
- `.uploads/` is gitignored scratch space (not tracked).
- To run the AI features locally, copy `.env.example` to `.env` and set `VITE_OPENAI_API_KEY` (and `VITE_AGGREGATE_URL` once the Worker is deployed). Without a key, AI calls fail gracefully — the recall choice still locks and the depth layer shows a retryable error (the fate is not sealed if nothing persisted).
