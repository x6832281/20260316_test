# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repo is mid-pivot. Two things are true at once:

1. **Current code** is a minimal Vite static site — a single "search box" homepage that dispatches a query to one of several search engines (Bilibili, GitHub, Doubao, Qianwen, Yandex, Baidu) in a new tab. `package.json` calls it `search-page`.
2. **Forward direction** (in `docs/PRODUCT_PLAN.md` and `.trae/rules/project_rules.md`) is a different product: **你的古代人生 / Your Ancient Life** — an AI + gamified interactive platform that lets users "live" inside real ancient Chinese history (a daily irreversible fate choice + an AI confidant). Planned stack: Vite + Vue 3 + TypeScript + Tailwind + vue-i18n, bilingual zh/en first, local storage (no backend), deploy on Vercel/Cloudflare Pages.

Treat `README.md` as **stale** — it describes an even older "AI 萌新小窝" content site whose SSG article pipeline, `src/`, `data/`, and Python scripts have all been deleted. Do not trust its file structure.

The committed `index.html` is currently truncated to `<!DOCTYPE html>` only; the working search UI is wired up in `script.js` + `styles.css` (which reference `#search-input`, `.search-engines`, `.engine-btn`). Restoring the markup is in-scope when working on the homepage.

## Commands

```bash
npm install        # install Vite
npm run dev        # vite dev server
npm run build      # vite build → dist/
npm run preview    # preview the built dist/
```

No linter, no test framework is configured. Windows: use plain `npm` — there is no Python in the current build (the old `py generate_feeds.py` / `build_manifest.py` steps are gone).

## Architecture (current)

- `index.html` — entry (currently truncated; should contain the search container markup).
- `script.js` — all behavior. `SEARCH_ENGINES` maps an engine key → `{ url, param, home }`. `search(engine)` builds `?param=query` when a query + search URL exist, else falls back to the engine homepage; opens in a new tab with `opener = null`. Event delegation on `.search-engines` reads `data-engine` from the clicked `.engine-btn`; Enter in the input defaults to `bilibili`.
- `styles.css` — light-theme design tokens in `:root` (accent `#37A` teal), responsive at 640px breakpoint. No build step transforms CSS.
- `vite.config.mjs` — `root: '.'`, `base: './'` (relative paths, important for sub-path/static hosting), `outDir: dist`.

Deploy target is static files in `dist/` (historically Nginx at https://corely.top).

## Product constraints (from `.trae/rules/project_rules.md`)

These are durable product rules — apply them to any new feature work toward the forward direction:

- Core positioning: AI + gamification + ancient Chinese history + global market. Not a content/encyclopedia/blog/article-aggregation site.
- Bilingual (zh/en) structure must be reserved in all user-facing copy.
- Start lightweight with a Vite static site; prioritize shareable/retentive/extensible forms (tests, dialogue, civilization-comparison features first).
- Monetization path: traffic → subscription → content/IP.

## Notes

- `.trae/` holds the Trae IDE's project rules; `docs/PRODUCT_PLAN.md` is the detailed v3 product spec for the ancient-life platform.
- `.uploads/` is gitignored scratch space (not tracked).
