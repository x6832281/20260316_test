# SSG 架构升级：Vite + 预渲染

## 概述

将「AI 萌新小窝」从纯客户端渲染的静态站点升级为 Vite 驱动的 SSG 架构。在不改变部署方式的前提下，实现 CSS/JS 按需加载、文章页预渲染、构建时一致性校验。核心目标：提升首屏性能、改善搜索引擎抓取、统一数据流。

## 设计原则

- **增量改造**：不重写现有功能，只拆分和迁移
- **部署不变**：`dist/` 仍然是纯静态文件，Nginx 直接托管
- **向后兼容**：已有 URL 和外部链接不失效

## 目录结构

```
/
├── src/                          # 源码目录（新增）
│   ├── index.html                # 入口页面（从根目录迁移）
│   ├── article.html              # 文章渲染页（模板）
│   ├── board.html
│   ├── ai.html / game.html / resource.html / ...
│   ├── newbie.html / deai.html / knowledge.html / (分类页)
│   ├── famous-books.html / famous-people.html / skill-evolution.html
│   ├── debate.html / faq.html / glossary.html / disclaimer.html / backup.html
│   │
│   ├── styles/
│   │   ├── main.css              # 全局样式：基础、布局、导航、页脚
│   │   └── pages/
│   │       ├── home.css          # 首页：hero、tab、卡片网格
│   │       ├── article.css       # 文章页：阅读排版、markdown 样式
│   │       ├── board.css         # 留言板
│   │       ├── topic.css         # 分类列表页
│   │       ├── webnovel.css      # 小说页主题
│   │       ├── resource.css      # 资源页主题
│   │       └── ai.css            # AI 学习页主题
│   │
│   └── scripts/
│       ├── main.js               # 通用：菜单、搜索、弹幕、SW 注册
│       ├── home.js               # 首页：分类渲染、tab 切换
│       ├── article.js            # 文章页：阅读进度、相关文章、统计
│       ├── board.js              # 留言板：Supabase 操作、本地存储
│       ├── topic.js              # 分类页：manifest 渲染列表
│       ├── seo-manager.js        # SEO 标签注入（现状保留）
│       └── baidu-push.js         # 百度推送（现状保留）
│
├── data/                         # 不变，Markdown 源文件 + manifest.json
├── scripts/                      # 构建脚本
│   ├── build.mjs                 # Vite 构建入口
│   ├── generate-articles.mjs     # Markdown → HTML 文章页生成器
│   └── validate.mjs              # 一致性校验脚本
│
├── dist/                         # 构建产物，部署此目录
│   ├── index.html
│   ├── article/
│   │   ├── book-analysis-001.html
│   │   ├── newbie-001.html
│   │   ├── ...
│   ├── assets/                   # 带 hash 的打包 CSS/JS
│   └── ...
│
├── docs/superpowers/specs/       # 设计文档
├── CLAUDE.md
├── package.json
├── vite.config.mjs
├── build_manifest.py             # 保留
└── generate_feeds.py             # 保留
```

## CSS/JS 拆分

### 拆分策略

从现有 `styles.css` 和 `render-content.js`/`article-page.js`/`script.js` 三个大文件拆分出按页面职责的模块。

**CSS 拆分配置（vite.config.mjs）：**
- `main.css` → 全局样式（基础、布局、导航、页脚、弹幕）
- `pages/home.css` → 首页：（hero、tab 切换、卡片网格、搜索区）
- `pages/article.css` → 文章页（阅读排版、markdown 渲染样式、分享栏、阅读统计）
- `pages/board.css` → 留言板（表单、留言列表、弹幕）
- `pages/topic.css` → 分类列表页（筛选按钮、卡片网格）
- `pages/webnovel.css` → webnovel 页专属主题变量和样式
- `pages/resource.css` → resource 页专属主题变量和样式
- `pages/ai.css` → AI 学习页专属主题变量和样式

**JS 拆分：**
- `main.js` → 从 `script.js` 提取通用逻辑（菜单 toggle、搜索栏、弹幕系统、SW 注册、回到顶部）
- `home.js` → 从 `render-content.js` 提取首页专属（`getXxxData()`、`renderXxxWithFilter()`、首页卡片渲染）
- `article.js` → 从 `article-page.js` 提取（`ARTICLES_MAP`、markdown 解析、相关文章推荐、阅读统计、点赞）
- `board.js` → 从 `board.html` 内联脚本和 `script.js` 提取（Supabase CRUD、本地存储回退、弹幕显示）
- `topic.js` → 从 `render-content.js` 提取分类列表页逻辑（读取 manifest、渲染卡片列表）

### 页面加载矩阵

| 页面 | CSS | JS |
|------|-----|-----|
| index.html | main + home | main + home + baidu-push |
| article/{id}.html | main + article | main + article + baidu-push |
| board.html | main + board | main + board + baidu-push |
| newbie/deai/... | main + topic | main + topic + baidu-push |
| webnovel.html | main + webnovel | main + baidu-push |
| resource.html | main + resource | main + baidu-push |
| ai.html | main + ai | main + baidu-push |
| game/faq/glossary/... | main | main + baidu-push |

Vite 构建时自动为每个入口页面分析其 CSS/JS 依赖，生成最优打包。

## 文章页预渲染

### 目标

将 `article.html?id=xxx` 改写为构建时生成独立的 HTML 文件，让搜索引擎直接抓取到完整内容，同时保留客户端 JS 做交互增强。

### 模板机制

`src/article.html` 作为模板文件，包含完整页面骨架（导航、页脚、分享栏、评论区），文章内容部分通过占位符注入。

占位符列表：

| 占位符 | 来源 | 说明 |
|--------|------|------|
| `{{ARTICLE_HTML}}` | Markdown 渲染结果 | 文章正文 HTML |
| `{{PAGE_TITLE}}` | manifest 中的 title | `<title>` 标签 |
| `{{PAGE_DESC}}` | manifest 中的 summary | `<meta name="description">` |
| `{{PAGE_TAG}}` | manifest 中的 category | 文章标签 |
| `{{PAGE_DATE}}` | manifest 中的 date | 文章日期 |
| `{{ARTICLE_JSON}}` | 序列化元数据 | 注入 `window.__ARTICLE_DATA__` 供 JS 使用 |
| `{{CANONICAL_URL}}` | 生成的 URL | canonical 标签 |
| `{{OG_IMAGE}}` | 固定 logo URL | OG 标签 |

### 生成脚本

`scripts/generate-articles.mjs` 逻辑：
1. 读取 `data/manifest.json`
2. 遍历每篇文章
3. 读取对应 Markdown 文件
4. 使用 `marked` 库转为 HTML
5. 读取模板，替换所有占位符
6. 输出到 `dist/article/{id}.html`

### Nginx 重写规则

为保持向后兼容，`article.html?id=xxx` 的请求改写为读取 `article/xxx.html`：

```nginx
location /article.html {
    if ($arg_id ~ "^[a-z0-9-]+$") {
        rewrite ^ /article/$arg_id.html? last;
    }
}
```

同时 `article.html` 页面本身的 canonical 和 OG url 仍指向 `article.html?id=xxx` 格式，不影响现有的搜索引擎索引。

## 构建流程

### 完整构建命令

```bash
npm run build
```

等价于依次执行：

```bash
# 1. 一致性校验（检查 manifest 与 ARTICLES_MAP 的对应关系）
node scripts/validate.mjs

# 2. 生成预渲染文章页
node scripts/generate-articles.mjs

# 3. Vite 构建（HTML 复制、CSS/JS 打包压缩）
vite build

# 4. 生成 RSS 和 Sitemap
python generate_feeds.py
```

### Vite 配置关键点

```mjs
// vite.config.mjs
import { defineConfig } from 'vite'
import { resolve } from 'path'
import { readFileSync } from 'fs'

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        article: resolve(__dirname, 'src/article.html'),
        board: resolve(__dirname, 'src/board.html'),
        ai: resolve(__dirname, 'src/ai.html'),
        resource: resolve(__dirname, 'src/resource.html'),
        game: resolve(__dirname, 'src/game.html'),
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
      }
    }
  }
})
```

### package.json

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
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^6.0.0",
    "marked": "^15.0.0"
  }
}
```

## 验证脚本

`scripts/validate.mjs` 在每次构建前运行，检查三项内容：

```mjs
// 校验逻辑
const errors = []

// 1. manifest.json 中所有文件路径是否存在
for (const [path, meta] of Object.entries(manifest)) {
  if (!fs.existsSync(path)) {
    errors.push(`文件不存在: ${path}`)
  }
}

// 2. ARTICLES_MAP 中所有 ID 在 manifest 中有对应记录
for (const id of Object.keys(ARTICLES_MAP)) {
  const found = Object.entries(manifest).find(([path, meta]) => {
    return `/${path.replace('.md', '')}` === ARTICLES_MAP[id].file
  })
  if (!found) {
    errors.push(`ARTICLES_MAP 中的 "${id}" 在 manifest 中无对应文件`)
  }
}

// 3. manifest 中所有记录在 ARTICLES_MAP 中有对应 ID（反向检查，防止遗漏）
for (const [path, meta] of Object.entries(manifest)) {
  const expectedId = getArticleId(path, meta.dir) // 用 DIR_ID_PREFIX 算
  if (!ARTICLES_MAP[expectedId]) {
    errors.push(`manifest 中的 "${path}" (ID: ${expectedId}) 未注册到 ARTICLES_MAP`)
  }
}

if (errors.length > 0) {
  console.error('验证失败:\n' + errors.join('\n'))
  process.exit(1)
}
```

## 开发工作流

### 日常修改 CSS/JS
```bash
npm run dev     # Vite dev server，修改自动热更新
```

### 添加新文章
```bash
# 1. 把 Markdown 文件放到 data/xxx/
# 2. 更新 manifest
npm run build:manifest

# 3. 在 article-page.js（拆分后为 article.js）中添加 ARTICLES_MAP 映射
# 4. 全量构建
npm run build
```

### 部署
```bash
npm run build
rsync -avz dist/ user@server:/path/to/www/
```

## 不修改的部分

- **data/ 目录**：Markdown 文件和 manifest.json 格式不变
- **build_manifest.py**：继续用作 manifest 生成器
- **generate_feeds.py**：继续用作 RSS/Sitemap 生成器
- **service-worker.js**：缓存策略不变，只需更新缓存版本号
- **manifest.json（PWA）**：不变
- **文章内容**：不修改任何 Markdown 文件

## 实施步骤

1. 初始化项目（`npm init`, 安装 Vite + marked）
2. 创建 `src/` 目录结构，迁移现有页面文件
3. 拆分 CSS（主样式 → main.css + 页面专属 CSS）
4. 拆分 JS（render-content.js → home.js + topic.js, article-page.js → article.js, script.js → main.js）
5. 配置 vite.config.mjs
6. 实现模板和生成脚本（scripts/generate-articles.mjs）
7. 实现验证脚本（scripts/validate.mjs）
8. 在 `article.js` 中导出 `ARTICLES_MAP`，`validate.mjs` 通过模块导入引用
9. 编写 Nginx 重写规则（`article.html?id=xxx` → `article/xxx.html`）
10. 全量构建测试
11. 本地预览验证所有页面
12. 部署到生产
