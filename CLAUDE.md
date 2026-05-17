# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI 萌新小窝** — a Chinese static website teaching AI beginners how to read and write with AI. Content is stored as Markdown files under `data/` and rendered client-side via JavaScript. No build tools, bundlers, or package managers. Just static HTML/CSS/JS served as-is. Deployed at https://corely.top.

## Architecture

### Static pages (`.html` in root)
Each page is a self-contained HTML file:
- `index.html` — homepage with trending topics, book analysis, knowledge creation, literary theory, book excerpts, beginner tutorials, de-AI tips
- `article.html` — loads & renders markdown articles via URL params (`?id=xxx`)
- `resource.html` — AI tool/resource navigation, `ai.html` — AI learning path, `game.html` — game dev with AI
- `board.html` — community message board, `book-analysis.html` — book deep-dive analysis
- `ai-writing.html` — AI writing tutorials, `webnovel.html` — web novel content
- `famous-books.html` — famous books listing, `famous-people.html` — famous people listing
- `skill-evolution.html` — skill evolution, `debate.html`, `faq.html`, `glossary.html`, `disclaimer.html`, `backup.html`, `404.html`

### JavaScript (data flow)

- **`render-content.js`** — main content rendering engine. Two rendering strategies:
  - **Dynamic fetch**: Sections like 萌新学习, 去AI味, 知识创作 fetch directory listings from `data/` subdirectories, parse each `.md` file for frontmatter (title, description, date), and render cards. Falls back to hardcoded data if the fetch fails.
  - **Hardcoded arrays**: `ARTICLES_DATA`, `TRENDING_DATA`, and section-specific arrays (`CASES_DATA`, `LITTHEORY_DATA`, etc.) for sections that don't use dynamic directory listing.
- **`article-page.js`** — article detail page. Contains `ARTICLES_MAP` mapping content IDs → file paths + metadata. Has a custom regex-based markdown parser (`parseMarkdown`, `escapeHtml`) — NO external library. Also contains fallback data functions for offline mode.
- **`script.js`** — search bar redirecting to external engines (B站, GitHub, 豆包, 千问, 百度, Yandex), service worker registration, mobile menu toggle, tab anchor navigation, danmaku system (localStorage key: `board_messages`).
- **`seo-manager.js`** — dynamic SEO meta tag injection (Open Graph, canonical URLs, JSON-LD structured data). Called by `article-page.js` when loading articles.
- **`baidu-push.js`** — submits URLs to Baidu search engine for indexing.

### Content (`data/`)
Markdown files organized by category:
- `data/拆书心得/` — book analysis (呼兰河传, 红楼梦, 活着, 百年孤独, etc.)
- `data/文学理论/` — literary theory (narratology, structuralism, feminism, post-modernism, comparative lit)
- `data/知识创作/` — AI knowledge creation tools (GPT Academic, LangChain, Dify, Ollama, etc.)
- `data/精选项目/` — featured GitHub open-source projects
- `data/萌新学习/` — beginner learning materials
- `data/书摘文案/` — book excerpts and quotes
- `data/去AI味/` — de-AI writing techniques (Prompt templates, high-frequency words, case studies)
- `data/历史备份/` — historical backups

The `ARTICLES_MAP` in `article-page.js` may contain entries for content not yet created — always verify a `.md` file exists before assuming a content ID works.

### Styles
- `styles.css` — single large stylesheet (~5600 lines), "Cyber Zen Garden" theme (dark bg `#0a0a0f`, cyan `#00f5d4` and amber `#f4a261` accents).

### PWA
- `service-worker.js` — cache-first for CSS/JS/fonts, network-first for HTML nav
- `manifest.json` — PWA manifest with inline SVG icons

### SEO / RSS / Sitemap
- `sitemap.xml`, `rss.xml` — manually maintained. When adding new content pages, update both.
- `robots.txt` — allows all crawlers, points to sitemap
- Baidu ecosystem: `baidu-push.js` for URL submission + Baidu analytics (`hm.js` in `index.html`) + `baidu_verify_codeva-hKe8DPIHeP.html` for site ownership verification.

### Content generation (`.trae/`)
- `.trae/skills/knowledge-creation-skill/` — skill for generating AI knowledge/tool articles
- `.trae/skills/literary-theory-skill/` — skill for generating literary theory articles
- `.trae/documents/` — planning documents (git branch guide, traffic optimization)

## Workflow

### Local development
No build step. Open any `.html` file directly in a browser or serve with any static server:
```
python -m http.server 8000
# or: npx serve .
```

### Cache-busting version stamps
CSS and JS files are loaded with `?v=YYYYMMDD` query strings to bust PWA/service-worker caches:
```html
<link rel="stylesheet" href="styles.css?v=20260513">
<script src="render-content.js?v=20260513" defer></script>
```
When editing CSS/JS, bump the version stamp to the current date. Also update `CACHE_NAME` in `service-worker.js` (its timestamp) and the SW registration URL in `script.js`.

### Adding content — the triple-registration pattern
Content must be registered in up to **three places** depending on the section:

1. **`article-page.js` `ARTICLES_MAP`** — maps content ID to `.md` file path + metadata (`tag`, `tagClass`). Required for ALL article content.
2. **`render-content.js`** — add to the relevant content array (e.g., `ARTICLES_DATA`, `TRENDING_DATA`) or ensure the dynamic fetch function covers the new ID. Required for homepage/section listing visibility.
3. **`index.html` inline HTML** — some sections (拆书心得, 文学理论, 书摘文案, 萌新学习, 去AI味) have hardcoded card HTML directly in `index.html` tab sections, independent of `render-content.js`. These must be manually updated or they go stale.

**Which sections use which approach:**
| Section | `index.html` | `render-content.js` | Dynamic fetch? |
|---|---|---|---|
| 拆书心得 | Hardcoded cards | Not rendered by JS | No |
| 知识创作 | Empty container `#knowledge-creation-container` | Fills via `renderKnowledgeCreation()` | Yes — fetches `data/知识创作/` |
| 文学理论 | Hardcoded cards | Not rendered by JS | No |
| 书摘文案 | Hardcoded cards | Not rendered by JS | No |
| 萌新学习 | Hardcoded cards | Fills via `renderNewbieContent()` | Yes — fetches `data/萌新学习/` |
| 去AI味 | Hardcoded cards | Fills via `renderDeaiContent()` | Yes — fetches `data/去AI味/` |

The index.html inline cards and the dynamic JS-rendered cards can diverge. When adding content to dynamic-fetch sections, update the index.html inline HTML to match OR remove the inline cards and let JS handle it entirely.

### Content ID naming convention
- `newbie-001` through `newbie-013` — 萌新学习 / beginner tutorials (includes 去AI味 series 009-013)
- `book-analysis-001` through `book-analysis-026` — 拆书心得 / book analysis
- `knowledge-001` through `knowledge-015` — 知识创作 / AI knowledge tools
- `deai-001` through `deai-010` — 去AI味 / de-AI writing
- `project-001-{slug}` through `project-006-{slug}` — 精选项目 / GitHub projects
- `littheory-001` through `littheory-006` — 文学理论
- `literature-001` through `literature-006`, `creative-001` through `creative-006`, `case-001` through `case-006` — AI writing / creative / practical cases
- `money-001` through `money-006`, `money-project-1` through `money-project-6` — money-making content
- `trending-1` through `trending-10`, `article-001` through `article-005` — homepage featured
- `book-excerpt-001` through `book-excerpt-006` — 书摘文案

### Internal links
All links are site-root-relative (`/article.html?id=xxx`). Article detail links use `article.html?id={content-id}`. Some links also carry a `&file=` param for direct file reference.

### Markdown frontmatter conventions
Each `.md` file in `data/` should have:
```markdown
# Title (first H1)

## 📌 一句话总结

**brief summary text**

**发布时间**：YYYY-MM-DD

**分类**：category name
```
These fields are parsed by `render-content.js` dynamic fetch functions via regex.
