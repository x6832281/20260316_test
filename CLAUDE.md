# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI 萌新小窝** — a Chinese static website educating AI beginners. Content is stored as Markdown files under `data/` and rendered client-side via JavaScript. No build tools, bundlers, or package managers. Just static HTML/CSS/JS served as-is. Deployed at https://corely.top.

## Architecture

### Content discovery: manifest.json (primary)

`data/manifest.json` is the single source of truth for discovering `.md` content files. It maps file paths to metadata (title, summary, date, category, dir). The client-side `render-content.js` reads this manifest via `fetchManifest()` instead of relying on server directory listing.

**When to regenerate**: Run `python build_manifest.py` whenever `.md` files are added, removed, or renamed. This scans all `data/` subdirectories and writes the manifest.

**Feed generation**: Run `python generate_feeds.py` to regenerate `rss.xml` and `sitemap.xml` from the manifest.

### Static pages (`.html` in root)
Each page is a self-contained HTML file. Key pages:
- `index.html` — homepage with tabbed content sections (拆书心得, 知识创作, 文学理论, 书摘文案, 萌新学习, 去AI味)
- `article.html` — loads & renders markdown articles via URL params (`?id=xxx`)
- **Topic pages** (render content from manifest dynamically):
  - `newbie.html` — 萌新学习 topic listing
  - `deai.html` — 去AI味 topic listing
  - `knowledge.html` — 知识创作 topic listing
  - `littheory.html` — 文学理论 topic listing
  - `book-excerpts.html` — 书摘文案 topic listing
  - `book-analysis.html` — 拆书心得 topic listing
- `resource.html` — AI tool/resource navigation
- `ai.html` — AI learning path
- `game.html` — game dev with AI
- `board.html` — community message board (localStorage-based)
- `famous-books.html`, `famous-people.html`, `skill-evolution.html`
- `debate.html`, `faq.html`, `glossary.html`, `disclaimer.html`, `backup.html`

### JavaScript (data flow)
- `render-content.js` — main content rendering engine. Reads `data/manifest.json` via `fetchManifest()` → `fetchContentFromManifest(dirName)`. Each content section has a `getXxxData()` function that first tries manifest, then falls back to directory listing, then to hardcoded fallback data. Contains filter rendering functions (`renderXxxWithFilter()`) for tabbed card grids on homepage.
- `article-page.js` — article detail page logic. Contains `ARTICLES_MAP` mapping content IDs to file paths + metadata. Has its own regex-based markdown parser (`parseMarkdown`, `escapeHtml`). For IDs not in ARTICLES_MAP, it dynamically discovers files by fetching the directory or using the `?file=` param.
- `script.js` — search functionality (B站/GitHub/豆包/百度/Yandex/千问), service worker registration, mobile menu toggle, tab anchor navigation with IntersectionObserver, danmaku (bullet comments) system using localStorage, back-to-top button, card mouse tracking.
- `seo-manager.js` — dynamic SEO meta tag injection (Open Graph, canonical URLs, JSON-LD structured data)
- `baidu-push.js` — Baidu search engine submission

### Content (`data/`)
Markdown files organized by category:
- `data/萌新学习/` — beginner learning materials (13 files, 001-013)
- `data/去AI味/` — de-AI writing techniques (10 files, 001-010)
- `data/拆书心得/` — book analysis (呼兰河传, 红楼梦, 活着, 百年孤独, 围城, 三体, 平凡的世界)
- `data/文学理论/` — literary theory (narratology, structuralism, feminism, etc.)
- `data/知识创作/` — AI knowledge creation tools (GPT Academic, LangChain, Dify, Ollama, etc.)
- `data/精选项目/` — featured GitHub projects
- `data/书摘文案/` — book excerpts and quotes
- `data/manifest.json` — generated content index (do not edit manually)

### Styles
- `styles.css` — single large stylesheet, light/douban-style theme (white bg `#fff`, gray text `#333`, accent `#37A`)

### PWA
- `service-worker.js` — cache-first for CSS/JS, network-first for HTML nav. Cache version in `CACHE_NAME`.
- `manifest.json` (root) — PWA manifest

## Workflow

### Local development
No build step. Open any `.html` file directly in a browser or serve with any static server:
```
python -m http.server 8000
```

### Adding content — the dual-registration pattern
Content must be registered in **two places** (plus manifest regeneration):

1. **Run `python build_manifest.py`** — regenerates `data/manifest.json` so topic pages can discover the new content
2. **`article-page.js`** — add a mapping in `ARTICLES_MAP` so the article detail page knows which markdown file to load and what metadata (tag, tagClass) to render
3. **`index.html`** (optional) — if the content should appear on the homepage, add a card to the appropriate tab-content section

Topic pages (newbie.html, deai.html, etc.) discover content automatically from the manifest — no registration needed for those.

### Content ID naming convention
IDs follow `{category}-{number}` or `{category}-{descriptive-slug}` patterns:
- `newbie-001` through `newbie-013` — 萌新学习
- `deai-001` through `deai-010` — 去AI味
- `book-analysis-001` through `book-analysis-026` — 拆书心得
- `littheory-001` through `littheory-006` — 文学理论
- `book-excerpt-001` through `book-excerpt-006` — 书摘文案
- `knowledge-001` through `knowledge-015` — 知识创作
- `project-001-{slug}` through `project-006-{slug}` — 精选项目
- `trending-1` through `trending-10` — 热搜 (auto-linked from TRENDING_DATA)

### Content tags and accent classes
- `tag-ai` / `accent-ai` — AI topics (blue accent)
- `tag-game` / `accent-game` — game dev
- `tag-resource` / `accent-resource` — resources

### Internal links
All relative links are site-root-relative (e.g., `/article.html?id=xxx`). Article detail links use format `article.html?id={content-id}`.

## Notable implementation details

- `article-page.js` has a custom regex-based markdown parser — no external markdown library dependency
- `script.js` provides a search bar that redirects to external search engines
- Danmaku (弹幕) system stores board messages in `localStorage` under `board_messages` key
- `render-content.js` fallback chain: manifest → directory listing → hardcoded fallback data
- The `DIR_ID_PREFIX` mapping is duplicated in `render-content.js`, `article-page.js`, and `generate_feeds.py` — keep them in sync when adding new content categories
- Topic pages use `<meta name="page-type" content="topic">` to signal their page type
- CSS theme is light/douban-style with CSS custom properties in `:root` — changing variables cascades to all components
