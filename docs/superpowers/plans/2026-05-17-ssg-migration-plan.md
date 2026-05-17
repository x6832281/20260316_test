# SSG 架构升级 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the static site to Vite-powered SSG with CSS/JS code splitting and article pre-rendering

**Architecture:** Vite multi-page setup with all HTML/CSS/JS under `src/`, build output to `dist/`. CSS/JS split by page type (main + page-specific). Articles pre-rendered at build time from Markdown using `marked` library. Nginx rewrites `article.html?id=xxx` → `article/xxx.html` for backward compatibility.

**Tech Stack:** Vite 6, marked 15, vanilla HTML/CSS/JS (no framework)

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `vite.config.mjs`
- Create: `src/` directory with subdirectories
- Create: `scripts/` directory

- [ ] **Step 1: Create directory structure**

```bash
cd /e/learning/web/20260316_test
mkdir -p src/styles/pages src/scripts scripts
```

- [ ] **Step 2: Initialize package.json**

```bash
cd /e/learning/web/20260316_test
npm init -y
```

Edit `package.json` to add:

```json
{
  "name": "ai-mengxin-xiaowo",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "node scripts/validate.mjs && node scripts/generate-articles.mjs && vite build && python generate_feeds.py",
    "build:articles": "node scripts/generate-articles.mjs",
    "validate": "node scripts/validate.mjs",
    "build:vite": "vite build",
    "preview": "vite preview"
  }
}
```

- [ ] **Step 3: Install dependencies**

```bash
cd /e/learning/web/20260316_test
npm install --save-dev vite@^6 marked@^15
```

Expected: `node_modules/` created, `package-lock.json` created.

- [ ] **Step 4: Create vite.config.mjs**

```mjs
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'src',
  base: '/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/index.html'),
        article: resolve(__dirname, 'src/article.html'),
        board: resolve(__dirname, 'src/board.html'),
        ai: resolve(__dirname, 'src/ai.html'),
        game: resolve(__dirname, 'src/game.html'),
        resource: resolve(__dirname, 'src/resource.html'),
        webnovel: resolve(__dirname, 'src/webnovel.html'),
        newbie: resolve(__dirname, 'src/newbie.html'),
        deai: resolve(__dirname, 'src/deai.html'),
        knowledge: resolve(__dirname, 'src/knowledge.html'),
        littheory: resolve(__dirname, 'src/littheory.html'),
        'book-analysis': resolve(__dirname, 'src/book-analysis.html'),
        'book-excerpts': resolve(__dirname, 'src/book-excerpts.html'),
        'famous-books': resolve(__dirname, 'src/famous-books.html'),
        'famous-people': resolve(__dirname, 'src/famous-people.html'),
        'skill-evolution': resolve(__dirname, 'src/skill-evolution.html'),
        debate: resolve(__dirname, 'src/debate.html'),
        faq: resolve(__dirname, 'src/faq.html'),
        glossary: resolve(__dirname, 'src/glossary.html'),
        disclaimer: resolve(__dirname, 'src/disclaimer.html'),
        backup: resolve(__dirname, 'src/backup.html'),
        'ai-writing': resolve(__dirname, 'src/ai-writing.html'),
      }
    }
  }
})
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vite.config.mjs src/ scripts/
git commit -m "feat: scaffold Vite project structure with multi-page config"
```

---

### Task 2: Migrate HTML to src/

**Files:**
- Copy: `*.html` from root → `src/` (all 24 HTML files)
- Copy: `baidu-push.js` → `src/scripts/baidu-push.js`
- Copy: `seo-manager.js` → `src/scripts/seo-manager.js`
- No changes to HTML content yet (CSS/JS paths stay same for now, Vite handles resolution)

- [ ] **Step 1: Copy all HTML files to src/**

```bash
cd /e/learning/web/20260316_test
cp *.html src/
```

Expected: 24 HTML files now in `src/`.

- [ ] **Step 2: Copy baidu-push.js and seo-manager.js to src/scripts/**

```bash
cd /e/learning/web/20260316_test
cp baidu-push.js src/scripts/
cp seo-manager.js src/scripts/
```

- [ ] **Step 3: Test Vite build**

```bash
cd /e/learning/web/20260316_test
npx vite build
```

Expected: Build succeeds, `dist/` directory created with all HTML files and CSS/JS bundled.
Ignore any missing asset warnings for now (CSS/JS not yet in src/).

- [ ] **Step 4: Commit**

```bash
git add src/*.html src/scripts/baidu-push.js src/scripts/seo-manager.js
git commit -m "feat: migrate HTML files and static JS to src/ directory"
```

---

### Task 3: Article SSG Generation Script

**Files:**
- Create: `scripts/generate-articles.mjs`
- Create: `scripts/get-article-id.mjs` (shared ID generation logic, extracted from generate_feeds.py)

- [ ] **Step 1: Create shared ID generation module**

`scripts/get-article-id.mjs`:

```mjs
import { basename } from 'path'

const DIR_ID_PREFIX = {
  '萌新学习': 'newbie',
  '去AI味': 'deai',
  '拆书心得': 'book-analysis',
  '文学理论': 'littheory',
  '书摘文案': 'book-excerpt',
  '知识创作': 'knowledge',
  '精选项目': 'project'
}

export function getArticleId(path, dirName) {
  const fileName = basename(path)
  const prefixMatch = fileName.match(/^(\d{3})/)
  const prefix = prefixMatch ? prefixMatch[1] : '001'

  if (dirName === '知识创作') {
    return 'knowledge-' + fileName.replace('.md', '')
  } else if (dirName === '精选项目') {
    const slug = fileName.replace('.md', '').replace(prefix + '-', '')
    return 'project-' + prefix + '-' + slug
  } else {
    const idPrefix = DIR_ID_PREFIX[dirName] || dirName
    return idPrefix + '-' + prefix
  }
}
```

- [ ] **Step 2: Create article generation script**

`scripts/generate-articles.mjs`:

```mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { marked } from 'marked'
import { getArticleId } from './get-article-id.mjs'

const BASE_URL = 'https://corely.top'
const OG_IMAGE = BASE_URL + '/logo.svg'

function loadManifest() {
  const raw = readFileSync('data/manifest.json', 'utf-8')
  return JSON.parse(raw)
}

function readMarkdown(filePath) {
  if (!existsSync(filePath)) {
    console.error(`  ⚠ 文件不存在: ${filePath}`)
    return null
  }
  return readFileSync(filePath, 'utf-8')
}

function parseDate(dateStr) {
  const cleaned = dateStr.replace(/\s*\|.*$/, '').trim()
  return cleaned || '2026-01-01'
}

function buildRelatedLinks(html, articleId) {
  // Insert internal links context at the end of the article
  return html + `\n<!-- article-id: ${articleId} -->\n`
}

function generateArticleHtml(article, mdContent) {
  const { id, title, summary, date, category, dir } = article
  const htmlContent = marked.parse(mdContent)
  const cleanSummary = (summary || title).replace(/\*\*/g, '')
  const articleJson = JSON.stringify({ id, title, summary: cleanSummary, date, category, dir })

  const articleWithMeta = buildRelatedLinks(htmlContent, id)

  const template = readFileSync('src/article.html', 'utf-8')
    .replace('{{ARTICLE_HTML}}', articleWithMeta)
    .replace('{{PAGE_TITLE}}', `${title} | AI 萌新小窝`)
    .replace('{{PAGE_DESC}}', cleanSummary)
    .replace('{{PAGE_TAG}}', category || dir)
    .replace('{{PAGE_DATE}}', parseDate(date))
    .replace('{{ARTICLE_JSON}}', articleJson)
    .replace('{{CANONICAL_URL}}', `${BASE_URL}/article.html?id=${id}`)
    .replace('{{OG_IMAGE}}', OG_IMAGE)

  return template
}

function main() {
  console.log('Generating article pages...')

  // Add a placeholder in the template file
  // We use {{ARTICLE_HTML}} etc as markers that get replaced

  const manifest = loadManifest()
  const articles = []

  for (const [filePath, meta] of Object.entries(manifest)) {
    const id = getArticleId(filePath, meta.dir)
    const mdContent = readMarkdown(filePath)
    if (!mdContent) continue

    const article = {
      id,
      title: meta.title,
      summary: meta.summary,
      date: meta.date,
      category: meta.category || meta.dir,
      dir: meta.dir
    }
    articles.push(article)
  }

  // Ensure output dir
  const outputDir = 'dist/article'
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  let count = 0
  for (const article of articles) {
    const mdContent = readMarkdown(
          Object.keys(loadManifest()).find(k => getArticleId(k, loadManifest()[k].dir) === article.id)
        || `data/${article.dir}/${article.id}.md`
    )
    if (!mdContent) continue

    try {
      const html = generateArticleHtml(article, mdContent)
      const outPath = join(outputDir, `${article.id}.html`)
      writeFileSync(outPath, html, 'utf-8')
      console.log(`  ✓ ${article.id}`)
      count++
    } catch (err) {
      console.error(`  ✗ ${article.id}: ${err.message}`)
    }
  }

  console.log(`\nDone: ${count} articles generated`)
}

main()
```

Wait, there's a problem with the above - I'm reading the manifest twice and the logic for finding the markdown file path is convoluted. Let me fix this.

`scripts/generate-articles.mjs`:

```mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { marked } from 'marked'
import { getArticleId } from './get-article-id.mjs'

const BASE_URL = 'https://corely.top'
const OG_IMAGE = BASE_URL + '/logo.svg'

function main() {
  console.log('Generating article pages...')

  const manifestRaw = readFileSync('data/manifest.json', 'utf-8')
  const manifest = JSON.parse(manifestRaw)
  const template = readFileSync('src/article.html', 'utf-8')

  const outputDir = 'dist/article'
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  let count = 0
  for (const [filePath, meta] of Object.entries(manifest)) {
    const id = getArticleId(filePath, meta.dir)

    if (!existsSync(filePath)) {
      console.error(`  ⚠ 文件不存在: ${filePath} (ID: ${id})`)
      continue
    }

    const mdContent = readFileSync(filePath, 'utf-8')
    const htmlContent = marked.parse(mdContent)

    const cleanSummary = (meta.summary || meta.title || '').replace(/\*\*/g, '')
    const articleJson = JSON.stringify({
      id,
      title: meta.title,
      summary: cleanSummary,
      date: meta.date,
      category: meta.category || meta.dir,
      dir: meta.dir
    })

    const pageHtml = template
      .replace('{{ARTICLE_HTML}}', htmlContent)
      .replace('{{PAGE_TITLE}}', `${meta.title} | AI 萌新小窝`)
      .replace('{{PAGE_DESC}}', cleanSummary)
      .replace('{{PAGE_TAG}}', meta.category || meta.dir)
      .replace('{{PAGE_DATE}}', (meta.date || '').replace(/\s*\|.*$/, '').trim())
      .replace('{{ARTICLE_JSON}}', articleJson)
      .replace('{{CANONICAL_URL}}', `${BASE_URL}/article.html?id=${id}`)
      .replace('{{OG_IMAGE}}', OG_IMAGE)

    const outPath = join(outputDir, `${id}.html`)
    writeFileSync(outPath, pageHtml, 'utf-8')
    console.log(`  ✓ ${id}`)
    count++
  }

  console.log(`\nDone: ${count} articles generated`)
}

main()
```

- [ ] **Step 3: Add placeholders to article.html template**

Read `src/article.html` and add these placeholders:

The article.html needs `{{ARTICLE_HTML}}` in the content area, `{{PAGE_TITLE}}` in `<title>`, etc. These exist naturally except we need to add them. The key changes:

Replace line 11 (`<title>文章加载中... | AI 萌新小窝</title>`):
```html
<title>{{PAGE_TITLE}}</title>
```

Replace line 6 (`<meta name="description" content="...">`):
```html
<meta name="description" content="{{PAGE_DESC}}">
```

After line 66 (`<h1 class="sr-only" id="articleH1">`), remove the loading spinner and add placeholder:
```html
<h1 class="sr-only" id="articleH1">{{PAGE_TITLE}}</h1>
{{ARTICLE_HTML}}
```

Replace the `.article-loading` div (lines 67-70):
```html
{{ARTICLE_HTML}}
```

Add a data script tag before closing `</body>`:
```html
<script>window.__ARTICLE_DATA__ = {{ARTICLE_JSON}};</script>
```

Replace the article tag and date spans in the header to be populated from template:
```html
<span class="article-tag" id="articleTag">{{PAGE_TAG}}</span>
<span class="article-date" id="articleDate">{{PAGE_DATE}}</span>
```

Add canonical to line 11 area or keep the placeholder dynamic.

Note: I need to be careful - the article.html currently has a loading state and JS-based rendering. After this change, the article.html template becomes dual-purpose: during dev (no build) it works as before with JS, during SSG build the placeholders get replaced.

Actually, let me think about this differently. The `src/article.html` should still work in dev mode with Vite. The placeholders get replaced by the SSG script during build. So:

- In dev mode: article.html shows `{{ARTICLE_HTML}}` literally as text unless JS handles it
- In production: SSG script replaces placeholders

This is problematic. Better approach: The SSG script should work differently - it should read `src/article.html` as a template, not modify it in place. The generated HTML files in `dist/article/` will have the real content. The `src/article.html` stays as-is with client-side rendering for dev mode.

So the generate script just reads the file, does string replacements, and writes output. No changes needed to article.html for the placeholders to work - they're search-and-replace targets in the script.

But wait - if `src/article.html` doesn't have `{{ARTICLE_HTML}}` markers, the script won't have anything to replace. I need to add them somehow.

Best approach: Keep `src/article.html` as-is for dev mode. The SSG script uses a separate template string (embedded in the script or a dedicated template file) that has the placeholders. The generated pages don't need to be exact copies of src/article.html - they just need the same structure with real content.

Let me revise: Create `src/templates/article-template.html` which is based on `src/article.html` but with placeholders.

Actually, simplest approach: The generate-articles.mjs script has the template embedded as a string. The dev experience doesn't need pre-rendered articles. Let me just keep it simple.

No wait, the template needs to be maintainable - if we update the article page layout, we need the template to match. Let me use a different approach:

The `generate-articles.mjs` reads `src/article.html`, then replaces specific sections:
- The loading div → article HTML content
- The title → real title
- The meta description → real description
- etc.

This way there's only one source of truth for the article page layout, and the template stays in sync automatically. The JavaScript-based rendering (`article-page.js`) handles the dev mode case - it checks if content is already rendered, and if not (because it sees `{{ARTICLE_HTML}}` literally), it renders via JS.

Let me rethink this entirely. The cleanest approach:

1. Keep `src/article.html` as the base template
2. The SSG script reads it, replaces parts, writes output
3. For dev mode, `article-page.js` already handles the rendering - it sees the loading state and renders via JS
4. For the placeholders that aren't valid HTML, use HTML comments so they're invisible in dev mode

Actually the simplest: use data attributes or empty containers with IDs that JS populates, and the SSG script fills them in:

```html
<div id="articleContent" data-title="{{PAGE_TITLE}}" data-desc="{{PAGE_DESC}}">
```

But this gets complicated. Let me just go with the simplest approach:

The SSG script uses `src/article.html` as the template, does search-and-replace on it, writes output to `dist/article/*.html`. The `src/article.html` file never has `{{}}` placeholders - instead the script uses specific DOM structure patterns to inject content.

OK, I'm overcomplicating this. Let me use a dedicated template approach:

Create `src/templates/article-template.html` - a copy of `src/article.html` but with placeholders like `{{ARTICLE_HTML}}`, `{{PAGE_TITLE}}`, etc. The script reads this template, fills placeholders, writes output.

For dev mode, `src/article.html` is untouched and still works with JS rendering.

This is the cleanest separation. Let me update the plan.

Actually, even simpler - just have placeholders directly in `src/article.html` as HTML comments that get replaced by the script. In dev mode, they're invisible comments:

```html
<!--{{ARTICLE_HTML}}-->
```

No, this doesn't work well either. Let me just embed the template as a JS string in the generate script. It's the most self-contained and easy to maintain since the generate script is the only consumer.

OK, final approach. I'll use a dedicated template file + the generate script reads it. Let me simplify and just write the plan with actual code.

Let me stop overthinking and write the plan. I'll use a simple template approach where generate-articles.mjs has the template as a string literal.<｜end▁of▁thinking｜>

<｜｜DSML｜｜tool_calls>
<｜｜DSML｜｜invoke name="Write">
<｜｜DSML｜｜parameter name="content" string="true"># SSG 架构升级 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the static site to Vite-powered SSG with CSS/JS code splitting and article pre-rendering

**Architecture:** Vite multi-page setup with all HTML/CSS/JS under `src/`, build output to `dist/`. CSS/JS split by page type (main + page-specific). Articles pre-rendered at build time from Markdown using `marked` library. Nginx rewrites `article.html?id=xxx` → `article/xxx.html` for backward compatibility.

**Tech Stack:** Vite 6, marked 15, vanilla HTML/CSS/JS (no framework)

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `vite.config.mjs`
- Create: `src/` directory with subdirectories
- Create: `scripts/` directory

- [ ] **Step 1: Create directory structure**

```bash
cd /e/learning/web/20260316_test
mkdir -p src/styles/pages src/scripts scripts
```

- [ ] **Step 2: Initialize package.json**

```bash
cd /e/learning/web/20260316_test
npm init -y
```

Edit `package.json` to replace its content:

```json
{
  "name": "ai-mengxin-xiaowo",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "node scripts/validate.mjs && node scripts/generate-articles.mjs && vite build && python generate_feeds.py",
    "build:articles": "node scripts/generate-articles.mjs",
    "validate": "node scripts/validate.mjs",
    "build:vite": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^6.0.0",
    "marked": "^15.0.0"
  }
}
```

- [ ] **Step 3: Install dependencies**

```bash
cd /e/learning/web/20260316_test
npm install
```

Expected: `node_modules/` created, `package-lock.json` created.

- [ ] **Step 4: Create vite.config.mjs**

```mjs
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: 'src',
  base: '/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/index.html'),
        article: resolve(__dirname, 'src/article.html'),
        board: resolve(__dirname, 'src/board.html'),
        ai: resolve(__dirname, 'src/ai.html'),
        game: resolve(__dirname, 'src/game.html'),
        resource: resolve(__dirname, 'src/resource.html'),
        webnovel: resolve(__dirname, 'src/webnovel.html'),
        newbie: resolve(__dirname, 'src/newbie.html'),
        deai: resolve(__dirname, 'src/deai.html'),
        knowledge: resolve(__dirname, 'src/knowledge.html'),
        littheory: resolve(__dirname, 'src/littheory.html'),
        'book-analysis': resolve(__dirname, 'src/book-analysis.html'),
        'book-excerpts': resolve(__dirname, 'src/book-excerpts.html'),
        'famous-books': resolve(__dirname, 'src/famous-books.html'),
        'famous-people': resolve(__dirname, 'src/famous-people.html'),
        'skill-evolution': resolve(__dirname, 'src/skill-evolution.html'),
        debate: resolve(__dirname, 'src/debate.html'),
        faq: resolve(__dirname, 'src/faq.html'),
        glossary: resolve(__dirname, 'src/glossary.html'),
        disclaimer: resolve(__dirname, 'src/disclaimer.html'),
        backup: resolve(__dirname, 'src/backup.html'),
        'ai-writing': resolve(__dirname, 'src/ai-writing.html'),
      }
    }
  }
})
```

- [ ] **Step 5: Add dist/ and node_modules/ to .gitignore**

```bash
echo -e '\n# Build output\ndist/\n\n# Dependencies\nnode_modules/' >> .gitignore
```

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vite.config.mjs .gitignore src/ scripts/
git commit -m "feat: scaffold Vite project structure with multi-page config"
```

---

### Task 2: Migrate HTML and Static Files to src/

**Files:**
- Copy: all `*.html` from root → `src/`
- Copy: `baidu-push.js` → `src/scripts/baidu-push.js`
- Copy: `seo-manager.js` → `src/scripts/seo-manager.js`
- Modify: all `src/*.html` — update CSS/JS paths to use `/` root-relative paths (Vite's base is `/`)

- [ ] **Step 1: Copy all HTML files to src/**

```bash
cd /e/learning/web/20260316_test
cp *.html src/
```

- [ ] **Step 2: Copy baidu-push.js and seo-manager.js**

```bash
cp baidu-push.js src/scripts/baidu-push.js
cp seo-manager.js src/scripts/seo-manager.js
```

- [ ] **Step 3: Update CSS/JS references in src/*.html**

Vite requires all referenced assets to be resolvable from `src/`. Currently pages reference `styles.css`, `script.js`, etc. from root. We need to:

1. Keep root-level CSS/JS files as-is (they're still referenced by root HTML during transition)
2. In `src/*.html`, change relative paths to root-relative `/` paths

Since Vite uses `src/` as root, a reference to `styles.css` in `src/index.html` will resolve to `src/styles.css`. We need to keep the actual styles.css in `src/` for now.

```bash
# Copy the main CSS/JS to src/ as a starting point before splitting
cp styles.css src/styles.css
cp render-content.js src/scripts/render-content.js
cp article-page.js src/scripts/article-page.js
cp script.js src/scripts/script.js
```

Now update the paths in all `src/*.html`:
- `styles.css` → `./styles.css` (already relative, same directory)
- `script.js` → `./scripts/script.js`
- `render-content.js` → `./scripts/render-content.js`
- `article-page.js` → `./scripts/article-page.js`
- `baidu-push.js` → `./scripts/baidu-push.js`
- `seo-manager.js` → `./scripts/seo-manager.js`

These relative paths work in both Vite dev and Vite build modes.

- [ ] **Step 4: Test Vite build**

```bash
cd /e/learning/web/20260316_test
npx vite build
```

Expected output: Build succeeds, `dist/` directory created with all HTML files and JS/CSS bundled. Each HTML file in `dist/` has its CSS/JS references rewritten to hashed asset paths.

- [ ] **Step 5: Commit**

```bash
git add src/*.html src/styles.css src/scripts/ src/ baidu-push.js
git commit -m "feat: migrate HTML and static assets to src/ with Vite build working"
```

---

### Task 3: Article SSG Generation — Template + Script

**Files:**
- Create: `scripts/get-article-id.mjs` (shared ID generation logic)
- Create: `scripts/generate-articles.mjs`
- Create: `src/templates/article.html` (template with placeholders)

- [ ] **Step 1: Create shared ID generation module**

`scripts/get-article-id.mjs`:

```mjs
import { basename } from 'path'

const DIR_ID_PREFIX = {
  '萌新学习': 'newbie',
  '去AI味': 'deai',
  '拆书心得': 'book-analysis',
  '文学理论': 'littheory',
  '书摘文案': 'book-excerpt',
  '知识创作': 'knowledge',
  '精选项目': 'project'
}

export function getArticleId(filePath, dirName) {
  const fileName = basename(filePath)
  const prefixMatch = fileName.match(/^(\d{3})/)
  const prefix = prefixMatch ? prefixMatch[1] : '001'

  if (dirName === '知识创作') {
    return 'knowledge-' + fileName.replace('.md', '')
  } else if (dirName === '精选项目') {
    const slug = fileName.replace('.md', '').replace(prefix + '-', '')
    return 'project-' + prefix + '-' + slug
  } else {
    const idPrefix = DIR_ID_PREFIX[dirName] || dirName
    return idPrefix + '-' + prefix
  }
}
```

- [ ] **Step 2: Create article template**

Copy `src/article.html` to `src/templates/article.html` and add placeholders.

```bash
mkdir -p src/templates
cp src/article.html src/templates/article.html
```

Edit `src/templates/article.html` — add these placeholders:

Line 6: `<meta name="description" content="{{PAGE_DESC}}">`
Line 11: `<title>{{PAGE_TITLE}}</title>`
Line 59-61: Add tag and date data attributes
```html
<span class="article-tag" id="articleTag">{{PAGE_TAG}}</span>
<span class="article-date" id="articleDate">{{PAGE_DATE}}</span>
```

Lines 67-70: Replace loading spinner
```html
{{ARTICLE_HTML}}
```

Line 111: Replace `https://corely.top/article.html` with `{{CANONICAL_URL}}`

Add before the `</article>` closing tag:
```html
<script>window.__ARTICLE_DATA__ = {{ARTICLE_JSON}};</script>
```

- [ ] **Step 3: Create article generation script**

`scripts/generate-articles.mjs`:

```mjs
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { marked } from 'marked'
import { getArticleId } from './get-article-id.mjs'

const BASE_URL = 'https://corely.top'
const OG_IMAGE = BASE_URL + '/logo.svg'

function resolveFilePath(filePath) {
  return filePath
}

function main() {
  console.log('Generating article pages...')

  const manifest = JSON.parse(readFileSync('data/manifest.json', 'utf-8'))
  const template = readFileSync('src/templates/article.html', 'utf-8')

  const outputDir = 'dist/article'
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  let count = 0
  for (const [filePath, meta] of Object.entries(manifest)) {
    const id = getArticleId(filePath, meta.dir)

    if (!existsSync(filePath)) {
      console.error(`  ⚠ 文件不存在: ${filePath} (ID: ${id})`)
      continue
    }

    const mdContent = readFileSync(filePath, 'utf-8')
    const htmlContent = marked.parse(mdContent)

    const cleanSummary = (meta.summary || meta.title || '').replace(/\*\*/g, '')
    const cleanDate = (meta.date || '').replace(/\s*\|.*$/, '').trim()

    const articleJson = JSON.stringify({
      id,
      title: meta.title,
      summary: cleanSummary,
      date: cleanDate,
      category: meta.category || meta.dir,
      dir: meta.dir
    })

    const pageHtml = template
      .replace('{{ARTICLE_HTML}}', htmlContent)
      .replace('{{PAGE_TITLE}}', `${meta.title} | AI 萌新小窝`)
      .replace('{{PAGE_DESC}}', cleanSummary)
      .replace('{{PAGE_TAG}}', meta.category || meta.dir)
      .replace('{{PAGE_DATE}}', cleanDate)
      .replace('{{ARTICLE_JSON}}', articleJson)
      .replace('{{CANONICAL_URL}}', `${BASE_URL}/article.html?id=${id}`)
      .replace('{{OG_IMAGE}}', OG_IMAGE)

    writeFileSync(join(outputDir, `${id}.html`), pageHtml, 'utf-8')
    console.log(`  ✓ ${id}`)
    count++
  }

  console.log(`\nDone: ${count} articles generated`)
}

main()
```

- [ ] **Step 4: Test the generation script**

```bash
cd /e/learning/web/20260316_test
mkdir -p dist/article
node scripts/generate-articles.mjs
```

Expected: All 80+ articles generated in `dist/article/` directory. Each file is a complete HTML page.

- [ ] **Step 5: Commit**

```bash
git add scripts/get-article-id.mjs scripts/generate-articles.mjs src/templates/
git commit -m "feat: add article SSG generation script and template"
```

---

### Task 4: Validation Script

**Files:**
- Create: `scripts/validate.mjs`

- [ ] **Step 1: Create validation script**

`scripts/validate.mjs`:

```mjs
import { readFileSync, existsSync } from 'fs'
import { getArticleId } from './get-article-id.mjs'

const errors = []

function main() {
  console.log('Running pre-build validation...')

  // 1. Load manifest
  if (!existsSync('data/manifest.json')) {
    errors.push('data/manifest.json not found')
    report()
  }
  const manifest = JSON.parse(readFileSync('data/manifest.json', 'utf-8'))

  // 2. Check all manifest file paths exist
  for (const [filePath] of Object.entries(manifest)) {
    if (!existsSync(filePath)) {
      errors.push(`manifest references missing file: ${filePath}`)
    }
  }

  // 3. Check for ID conflicts (two files generating same ID)
  const idMap = {}
  for (const [filePath, meta] of Object.entries(manifest)) {
    const id = getArticleId(filePath, meta.dir)
    if (idMap[id]) {
      errors.push(`ID conflict: "${id}" from "${filePath}" and "${idMap[id]}"`)
    }
    idMap[id] = filePath
  }

  // 4. Check required template exists
  if (!existsSync('src/templates/article.html')) {
    errors.push('template missing: src/templates/article.html')
  }

  report()
}

function report() {
  if (errors.length === 0) {
    console.log('✓ All checks passed')
    process.exit(0)
  } else {
    console.error(`\n✗ ${errors.length} validation error(s):`)
    errors.forEach(e => console.error(`  • ${e}`))
    process.exit(1)
  }
}

main()
```

- [ ] **Step 2: Test validation script**

```bash
cd /e/learning/web/20260316_test
node scripts/validate.mjs
```

Expected: `✓ All checks passed`. To test failure case, temporarily rename a file and run again.

- [ ] **Step 3: Commit**

```bash
git add scripts/validate.mjs
git commit -m "feat: add pre-build validation script"
```

---

### Task 5: CSS Splitting (styles.css → main.css + page-specific)

**Files:**
- Create: `src/styles/main.css` (global: base, layout, nav, footer, danmaku, animations, variables)
- Create: `src/styles/pages/home.css` (hero, tabs, card grids, search, homepage-specific)
- Create: `src/styles/pages/article.css` (article reading layout, markdown styles, share bar, stats)
- Create: `src/styles/pages/board.css` (board form, message list, board-specific)
- Create: `src/styles/pages/topic.css` (topic listing filter buttons, card grid)
- Create: `src/styles/pages/webnovel.css` (--wn-* theme variables and webnovel-specific styles)
- Create: `src/styles/pages/resource.css` (--rn-* theme variables and resource-specific styles)
- Create: `src/styles/pages/ai.css` (--nb-* theme variables and AI-page-specific styles)

Strategy: Each new CSS file imports from `styles.css` by copying the relevant sections. Then each HTML page imports only what it needs.

- [ ] **Step 1: Create main.css — global/variable styles**

Read `styles.css` and extract into `src/styles/main.css`:

```
Lines 1-47:   CSS variables (:root) — all variables
Lines 48-59:  Reset/base (html, body, *, etc)
Lines 60-166: Typography/utilities
Lines 167-256: Header/navbar
Lines 257-403: Danmaku system
Lines 404-468: Danmaku responsive + toggle
Lines 469-540: Search section styles
Lines 541-700: Back to top, utilities, animations (@keyframes)
Lines 701-1000: Article cards (shared between home and topic pages)
Lines 1001-1135: Footer
Lines 1136-1276: Miscellaneous shared styles
Lines 1277-1434: Book analysis grid
Lines 4607-4630: prefers-reduced-motion
Lines 4631-5274: Shared component styles (modals, pagination, etc)
```

This is approximately lines 1-540 + 701-1135 + 4607-5274 from the original, roughly ~2500 lines.

- [ ] **Step 2: Create page-specific CSS files**

`src/styles/pages/home.css`:
```
Lines 1277-1434: Section titles, hero
Lines 1435-1595: Homepage responsive (768px)
Lines 1596-1620: Homepage responsive (480px)
Lines 2200-2246: Tab content
Lines 2247-2317: Board section (some shared with board.css)
Lines 4411-4606: Tab button enhanced styles, section headers
```

`src/styles/pages/article.css`:
```
Lines 1621-2000: Article page layout, reading styles
Lines 2001-2246: Share bar, stats, related articles
```

`src/styles/pages/board.css`:
```
Lines 2318-2678: Board page styles
Lines 2679-2778: Debounce styles
```

`src/styles/pages/topic.css`:
```
Lines 2779-3196: Topic page layout (used by newbie.html, deai.html etc)
Lines 3197-3233: Topic responsive
```

`src/styles/pages/webnovel.css`:
```
Lines 3234-3580: Webnovel theme variables + styles
Lines 3580-3667: Webnovel responsive
```

`src/styles/pages/resource.css`:
```
Lines 3668-3948: Resource page theme + styles
Lines 3948-3974: Resource responsive
```

`src/styles/pages/ai.css`:
```
Lines 3975-4410: AI page theme + styles
Lines 4585-4606: AI page responsive
```

Note: The precise line ranges will vary during extraction. The important thing is each page-specific CSS should include ONLY the styles needed for that page type.

- [ ] **Step 3: Update each HTML page to import the right CSS**

Each `src/*.html` currently has `<link rel="stylesheet" href="./styles.css">`. Replace with:

**src/index.html:**
```html
<link rel="stylesheet" href="./styles/main.css">
<link rel="stylesheet" href="./styles/pages/home.css">
```

**src/article.html:**
```html
<link rel="stylesheet" href="./styles/main.css">
<link rel="stylesheet" href="./styles/pages/article.css">
```

**src/board.html:**
```html
<link rel="stylesheet" href="./styles/main.css">
<link rel="stylesheet" href="./styles/pages/board.css">
```

**src/newbie.html, src/deai.html, src/knowledge.html, src/littheory.html, src/book-analysis.html, src/book-excerpts.html:**
```html
<link rel="stylesheet" href="./styles/main.css">
<link rel="stylesheet" href="./styles/pages/topic.css">
```

**src/webnovel.html:**
```html
<link rel="stylesheet" href="./styles/main.css">
<link rel="stylesheet" href="./styles/pages/webnovel.css">
```

**src/resource.html:**
```html
<link rel="stylesheet" href="./styles/main.css">
<link rel="stylesheet" href="./styles/pages/resource.css">
```

**src/ai.html:**
```html
<link rel="stylesheet" href="./styles/main.css">
<link rel="stylesheet" href="./styles/pages/ai.css">
```

All other pages (game.html, faq.html, glossary.html, etc):
```html
<link rel="stylesheet" href="./styles/main.css">
```

- [ ] **Step 4: Test build**

```bash
cd /e/learning/web/20260316_test
npx vite build
```

Expected: Build succeeds. Each HTML page in `dist/` should have the correct CSS files linked with hashed filenames.

- [ ] **Step 5: Remove old styles.css from src/**

```bash
rm src/styles.css
```

- [ ] **Step 6: Test build again**

```bash
cd /e/learning/web/20260316_test
npx vite build
```

Expected: Build succeeds (no page references old styles.css anymore).

- [ ] **Step 7: Commit**

```bash
git add src/styles/ src/*.html
git commit -m "refactor: split styles.css into main.css + 7 page-specific CSS files"
```

---

### Task 6: JS Splitting

**Files:**
- Create: `src/scripts/main.js` (from script.js: menu, search, danmaku, SW registration, back-to-top)
- Create: `src/scripts/home.js` (from render-content.js: homepage card rendering, getXxxData, tab switching)
- Create: `src/scripts/article.js` (from article-page.js: markdown parser, ARTICLES_MAP, related articles, stats, likes)
- Create: `src/scripts/topic.js` (from render-content.js: topic listing rendering)
- Create: `src/scripts/board.js` (from script.js and board.html inline: Supabase operations, CRUD, local storage)

Strategy: Create each file, copy relevant functions, then update HTML script tags.

- [ ] **Step 1: Create main.js**

Copy from `script.js` the following sections:
- Mobile menu toggle (querySelector('.mobile-menu-btn'), addEventListener)
- Search engine buttons (querySelectorAll('.engine-btn'), search action)
- Service worker registration (if 'serviceWorker' in navigator)
- Danmaku/bullet comment system (class Danmaku or similar)
- Back-to-top button
- Card mouse tracking effect
- Any utility functions used across pages

- [ ] **Step 2: Create home.js**

Copy from `render-content.js`:
- `fetchManifest()` or `fetchContentFromManifest()` — general fetch functions
- `getNewbieData()`, `getDeaiData()`, `getLiteraryTheoryData()`, etc. — homepage data functions
- `renderXxxWithFilter()` — homepage filter rendering
- Card rendering functions for homepage (article cards in tab content)
- `renderHomepage()` or initialization code specific to index.html

- [ ] **Step 3: Create topic.js**

Copy from `render-content.js`:
- Functions used by topic listing pages (newbie.html, deai.html, etc)
- Card grid rendering for category listings
- Filter button logic for topic pages

- [ ] **Step 4: Create article.js**

Copy from `article-page.js`:
- `ARTICLES_MAP` constant
- `parseMarkdown()`, `escapeHtml()` — markdown parser
- `loadRelatedArticles()` — related article logic with `RELATED_CATS`
- View count / like functionality
- Share functions (shareToWeibo, shareToQQ, copyLink, etc)
- Article initialization / URL parameter parsing

Add export for ARTICLES_MAP at the end:
```js
if (typeof module !== 'undefined') {
  module.exports = { ARTICLES_MAP }
}
```

- [ ] **Step 5: Create board.js**

Extract from `board.html` inline script:
- Supabase client initialization
- Message submission (`messageForm.addEventListener('submit')`)
- Message loading (`loadMessages()`)
- Display functions (`displayMessages()`)
- Local storage fallback (`saveToLocal()`, `loadFromLocalStorage()`)
- Real-time subscription
- Utility functions (`escapeHtml`, `formatTime`)

- [ ] **Step 6: Update HTML script references**

Each `.html` file in `src/` — replace old script paths with new split paths:

**src/index.html:**
```html
<script src="./scripts/main.js" defer></script>
<script src="./scripts/home.js" defer></script>
<script src="./scripts/seo-manager.js" defer></script>
<script src="./scripts/baidu-push.js" defer></script>
```

**src/article.html:**
```html
<script src="./scripts/main.js" defer></script>
<script src="./scripts/article.js" defer></script>
<script src="./scripts/seo-manager.js" defer></script>
<script src="./scripts/baidu-push.js" defer></script>
```

**src/board.html:**
```html
<script src="./scripts/board.js" defer></script>
<script src="./scripts/main.js" defer></script>
<script src="./scripts/baidu-push.js" defer></script>
```

**Topic pages (newbie.html, deai.html, etc):**
```html
<script src="./scripts/main.js" defer></script>
<script src="./scripts/topic.js" defer></script>
<script src="./scripts/seo-manager.js" defer></script>
<script src="./scripts/baidu-push.js" defer></script>
```

Other pages (game.html, resource.html, ai.html, webnovel.html, etc):
```html
<script src="./scripts/main.js" defer></script>
<script src="./scripts/baidu-push.js" defer></script>
```

- [ ] **Step 7: Test build**

```bash
cd /e/learning/web/20260316_test
npx vite build
```

Expected: Build succeeds. Check `dist/` for correct JS output.

- [ ] **Step 8: Commit**

```bash
git add src/scripts/main.js src/scripts/home.js src/scripts/topic.js src/scripts/article.js src/scripts/board.js src/*.html
git commit -m "refactor: split JS into main/home/topic/article/board modules"
```

---

### Task 7: Update Generation Script and Service Worker

**Files:**
- Modify: `scripts/generate-articles.mjs` — use template from `src/templates/` path
- Modify: `service-worker.js` — update cache name and asset list

- [ ] **Step 1: Verify generate-articles.mjs still works after JS split**

```bash
cd /e/learning/web/20260316_test
node scripts/generate-articles.mjs
```

Expected: All articles still generate correctly. The template uses the new split CSS/JS imports.

- [ ] **Step 2: Update service-worker.js cache version**

Edit `service-worker.js`:
```
CACHE_NAME = 'kaka-cache-v20260517-ssg'
```

Update `ASSETS_TO_CACHE` to remove old monolithic files, add new split paths:
```js
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/article/book-analysis-001.html',
  '/styles/main.css',
  '/styles/pages/home.css',
  '/styles/pages/article.css',
  '/styles/pages/board.css',
  '/styles/pages/topic.css',
  '/styles/pages/webnovel.css',
  '/styles/pages/resource.css',
  '/styles/pages/ai.css',
  '/scripts/main.js',
  '/scripts/home.js',
  '/scripts/article.js',
  '/scripts/topic.js',
  '/scripts/board.js',
  '/scripts/seo-manager.js',
  '/scripts/baidu-push.js',
  '/manifest.json'
]
```

Note: In production (Vite build), file paths get hashes. The service worker will need a `?v=` param or we need to use the generated asset manifest. For now, use the unbundled paths — they'll work because Vite's dev server serves them directly, and in production the service worker will cache-fallback correctly.

Actually, post-build, the asset paths in dist/ are like `/assets/main-abc123.css`. The service worker should cache those. Let me use a simpler approach: just cache the root HTML pages and let the fetch handler do the rest (it already falls back to cache).

- [ ] **Step 3: Commit**

```bash
git add service-worker.js
git commit -m "chore: update service worker cache version for SSG build"
```

---

### Task 8: Full Build Test and Verification

- [ ] **Step 1: Run full build pipeline**

```bash
cd /e/learning/web/20260316_test
node scripts/validate.mjs && node scripts/generate-articles.mjs && npx vite build && python generate_feeds.py
```

Expected: All four steps succeed.

- [ ] **Step 2: Verify dist/ output structure**

```bash
ls /e/learning/web/20260316_test/dist/
```
Expected: Contains all HTML pages + `article/` directory + `assets/` directory (with hashed CSS/JS).

```bash
ls /e/learning/web/20260316_test/dist/article/ | head -5
```
Expected: 80+ HTML files, one per article.

- [ ] **Step 3: Preview with Vite**

```bash
cd /e/learning/web/20260316_test
npx vite preview
```

Expected: Server starts at localhost. Open in browser, verify:
- Homepage loads with correct styles
- Navigation works
- Article pages at `/article/book-analysis-001.html` show full content
- Topic pages show article lists
- Board page loads

- [ ] **Step 4: Fix any issues found during preview**

Common issues to check:
- Missing styles → add missing CSS imports
- Broken JS → ensure functions are properly exported/imported
- Broken image paths → fix relative paths
- Service worker errors → update cache paths

- [ ] **Step 5: Verify article.html?id=xxx still works**

Test that `article.html?id=book-analysis-001` redirects correctly (when Nginx rewrite is in place) or at minimum, the template file renders with `window.__ARTICLE_DATA__` populated.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: complete SSG build pipeline with full verification"
```

---

### Task 9: Nginx Rewrite Configuration

**Files:**
- Create: `nginx-ssg.conf` — Nginx config snippet for the rewrite rule

- [ ] **Step 1: Create Nginx config snippet**

`nginx-ssg.conf`:

```nginx
# SSG rewrite: /article.html?id=xxx → /article/xxx.html
# Place this in the server block of your Nginx config

location /article.html {
    if ($arg_id ~ "^[a-z0-9-]+$") {
        rewrite ^ /article/$arg_id.html? last;
    }
}

# Cache static assets aggressively
location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Cache article pages
location /article/ {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
}
```

- [ ] **Step 2: Add deploy instructions**

Add to `CLAUDE.md` under deployment:
```
### Nginx
Add `include /path/to/nginx-ssg.conf;` inside your server block.
```

- [ ] **Step 3: Commit**

```bash
git add nginx-ssg.conf CLAUDE.md
git commit -m "docs: add Nginx SSG rewrite config and deployment instructions"
```

---

### Task 10: Final Cleanup and Documentation Update

**Files:**
- Modify: `CLAUDE.md` — update architecture description, directory structure, dev workflow
- Remove: old root-level files that are now in `src/` (verify nothing references them)

- [ ] **Step 1: Update CLAUDE.md**

Replace the Architecture and Workflow sections to reflect the new Vite-based setup. Key changes:
- `src/` is now the source directory
- CSS/JS are split into module files
- Build requires `npm run build`, not direct file access
- Development uses `npm run dev`

- [ ] **Step 2: Remove obsolete root-level JS**

Files no longer needed at root (after verifying nothing references them):
- `render-content.js` → removed (now in `src/scripts/home.js` + `src/scripts/topic.js`)
- `article-page.js` → removed (now in `src/scripts/article.js`)
- `script.js` → removed (now in `src/scripts/main.js` + some in `src/scripts/board.js`)

- [ ] **Step 3: Final build verification**

```bash
cd /e/learning/web/20260316_test
npm run build
```

Expected: All 4 steps pass cleanly.

- [ ] **Step 4: Final commit**

```bash
git add .
git commit -m "chore: cleanup obsolete files and update documentation for SSG architecture"
```
