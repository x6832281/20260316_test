# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI 萌新小窝** — a Chinese static website educating AI beginners. Content is stored as Markdown files under `data/` and rendered client-side via JavaScript. No build tools, bundlers, or package managers. Just static HTML/CSS/JS served as-is. Deployed at https://corely.top.

## Architecture

### Static pages (`.html` in root)
Each page is a self-contained HTML file. Key pages:
- `index.html` — homepage with trending topics, featured articles
- `article.html` — loads & renders markdown articles via URL params (`?id=xxx`)
- `resource.html` — AI tool/resource navigation
- `ai.html` — AI learning path
- `game.html` — game dev with AI
- `board.html` — community message board
- `book-analysis.html` — book deep-dive analysis
- `ai-writing.html` — AI writing tutorials
- `webnovel.html` — web novel content
- `famous-books.html` — famous books listing
- `famous-people.html` — famous people listing
- `skill-evolution.html` — skill evolution page
- `debate.html`, `faq.html`, `glossary.html`, `disclaimer.html`, `backup.html`

### JavaScript (data flow)
- `render-content.js` — main content rendering engine; reads markdown from `data/` and renders to DOM. Contains hardcoded content arrays (`ARTICLES_DATA`, `TRENDING_DATA`) for homepage sections. Some sections (e.g., 萌新学习) dynamically fetch directory listings from `data/` subdirectories and parse markdown frontmatter.
- `article-page.js` — article detail page logic. Contains `ARTICLES_MAP` mapping content IDs to file paths + metadata. Has its own custom regex-based markdown parser — NOT using marked.js or any library. Fallback data functions for offline mode.
- `script.js` — search functionality (B站/GitHub/豆包/百度/Yandex), service worker registration, mobile menu toggle, tab anchor navigation, danmaku (bullet comments) system using localStorage.
- `seo-manager.js` — dynamic SEO meta tag injection (Open Graph, canonical URLs, JSON-LD structured data)
- `baidu-push.js` — Baidu search engine submission

### Content (`data/`)
Markdown files organized by category:
- `data/拆书心得/` — book analysis (呼兰河传 deep-dives)
- `data/文学理论/` — literary theory (narratology, structuralism, feminism, etc.)
- `data/知识创作/` — AI knowledge creation tools (GPT Academic, LangChain, Dify, Ollama, etc.)
- `data/精选项目/` — featured GitHub projects
- `data/萌新学习/` — beginner learning materials
- `data/书摘文案/` — book excerpts and quotes
- `data/历史备份/` — historical backups

Note: `article-page.js` also references file paths for `data/AI创意/`, `data/实战案例/`, `data/搞钱创业/`, `data/AI写作/`, and `weekly/weekly-package/articles/` — these directories do not currently exist in the repo; those `ARTICLES_MAP` entries are stale/dead links.

### Styles
- `styles.css` — single large stylesheet (~118KB), "Cyber Zen Garden" theme (dark bg, cyan/amber accents)

### PWA
- `service-worker.js` — cache-first for CSS/JS, network-first for HTML nav
- `manifest.json` — PWA manifest with SVG inline icons

## Workflow

### Local development
No build step. Open any `.html` file directly in a browser or serve with any static server:
```
# Python
python -m http.server 8000

# Node (if available)
npx serve .
```

### Adding content — the dual-registration pattern
This is the most important workflow to understand. Content must be registered in **two places**:

1. **`render-content.js`** — add the item to the appropriate content array (`ARTICLES_DATA`, `TRENDING_DATA`, or section-specific arrays) to display it on the homepage/section pages
2. **`article-page.js`** — add a mapping in `ARTICLES_MAP` so the article detail page knows which markdown file to load and what metadata (tag, tagClass) to render

### Content ID naming convention
IDs follow `{category}-{number}` or `{category}-{descriptive-slug}` patterns:
- `article-001` through `article-005` — featured articles (homepage)
- `newbie-001` through `newbie-013` — 萌新学习 / beginner tutorials (includes 去AI味 series 009-013)
- `book-analysis-001` through `book-analysis-026` — 拆书心得 / book analysis (呼兰河传, 红楼梦, 活着, 百年孤独, 围城, 三体, 平凡的世界)
- `knowledge-001` through `knowledge-015` — 知识创作 / AI knowledge tools
- `project-001-{slug}` through `project-006-{slug}` — 精选项目 / GitHub projects
- `literature-001` through `literature-006` — AI writing / literature
- `creative-001` through `creative-006` — AI creative works
- `case-001` through `case-006` — 实战案例 / practical cases
- `money-001` through `money-006` — 搞钱排行 / money-making
- `money-project-1` through `money-project-6` — 搞钱创业 / startup projects
- `trending-1` through `trending-10` — 热搜 / trending (auto-linked from `TRENDING_DATA`)

### Content tags and accent classes
- `tag-ai` / `accent-ai` — AI topics (cyan accent)
- `tag-game` / `accent-game` — game dev (amber accent)
- `tag-resource` / `accent-resource` — resources (purple accent)

### Internal links
All relative links are site-root-relative (e.g., `/article.html?id=xxx`). Article detail links use format `article.html?id={content-id}`.

## Notable implementation details

- `article-page.js` has a custom regex-based markdown parser (functions `parseMarkdown` and `escapeHtml`) — no external markdown library dependency
- `script.js` provides a search bar that redirects to external search engines (B站, GitHub, 豆包, 百度, Yandex, 通义千问)
- Danmaku (弹幕) system stores board messages in `localStorage` under `board_messages` key
- `render-content.js` has fallback data functions (e.g., `getFallbackNewbieData`) when dynamic directory listing fails
- PWA cache version is manually versioned via timestamp in `service-worker.js` (`CACHE_NAME`) and SW registration URL in `script.js`
