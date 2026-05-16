# 首页瘦身 + 独立专题页 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将首页从 61 张卡片瘦身到约 30 张，每板块只展示最新 6 条 + "查看更多"链接跳转独立专题页；新建 5 个专题页统一从 manifest.json 动态渲染。

**Architecture:** 在 `render-content.js` 中新增通用专题页渲染函数；5 个新专题页共享同一 HTML 模板结构，仅改数据源和标题；改造 `book-analysis.html` 从硬编码 → manifest 驱动；`index.html` 精简板块卡片并加跳转链接。

**Tech Stack:** Vanilla HTML/CSS/JS, manifest.json 数据源, 无外部依赖

---

### Task 1: render-content.js — 新增通用专题页渲染函数

**Files:**
- Modify: `render-content.js` (尾部追加新函数)
- Modify: `render-content.js:1624-1654` (修改 renderHomepage 加 topic page 检测)

- [ ] **Step 1: 在 render-content.js 尾部追加 `renderTopicPage()` 函数**

在文件末尾 `DOMContentLoaded` 监听之前插入以下新函数：

```javascript
// ============================================================
// Generic topic page renderer — used by all topic listing pages
// dirName: manifest dir field (e.g. '去AI味', '萌新学习')
// containerId: DOM container id
// options: { cardRenderer, maxCards, filterCategories }
// ============================================================
async function renderTopicPage(dirName, containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { cardRenderer = 'newbie', maxCards = 0, filterCategories = [] } = options;

    const data = await fetchContentFromManifest(dirName);
    if (!data) {
        container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px;">内容加载失败，请刷新页面重试</p>';
        return;
    }

    // Sort by date descending
    data.sort((a, b) => {
        const da = new Date(a.date); const db = new Date(b.date);
        return (db - da) || a.fileName.localeCompare(b.fileName);
    });

    const displayData = maxCards > 0 ? data.slice(0, maxCards) : data;

    // Render filter bar if categories provided
    let filterHtml = '';
    if (filterCategories.length > 0) {
        const buttons = [['all', '全部']].concat(filterCategories.map(c => [c, c]));
        filterHtml = `
            <div class="newbie-filter">
                <span class="newbie-filter-label">筛选</span>
                ${buttons.map(([val, label]) =>
                    `<button class="newbie-filter-btn${val === 'all' ? ' active' : ''}" data-category="${val}">${label}</button>`
                ).join('')}
            </div>`;
    }

    // Render cards
    const cardsHtml = displayData.map((item, i) => {
        if (cardRenderer === 'knowledge') {
            return renderKnowledgeCreationCard(item, i);
        }
        return renderNewbieCard(item, i);
    }).join('');

    container.innerHTML = filterHtml + `<div class="newbie-grid">${cardsHtml}</div>`;

    // Wire filter buttons if present
    if (filterCategories.length > 0) {
        const filterBtns = container.querySelectorAll('.newbie-filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const cat = btn.dataset.category;
                const cards = container.querySelectorAll('.newbie-card');
                cards.forEach(card => {
                    const cardCat = card.querySelector('.newbie-card-category').textContent;
                    if (cat === 'all' || cardCat === cat) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
}
```

- [ ] **Step 2: 修改 `renderHomepage()` 跳过专题页**

修改 `renderHomepage()` 函数首部，检测专题页标记并跳过全量渲染：

```javascript
async function renderHomepage() {
    // Skip full homepage rendering on topic pages
    if (document.querySelector('meta[name="page-type"]')) return;

    console.log('=== Starting renderHomepage (parallel) ===');
    // ... 其余保持不变 ...
}
```

- [ ] **Step 3: 提交**

```bash
git add render-content.js
git commit -m "feat: add generic renderTopicPage() for topic listing pages"
```

---

### Task 2: 新建 deai.html — 去AI味专题页

**Files:**
- Create: `deai.html`

- [ ] **Step 1: 创建 deai.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="去AI味写作技巧专题——Prompt模板、高频词词典、最新去AI味方法、案例对比，让你的AI文章读起来像人写的">
    <meta name="keywords" content="去AI味,AI写作,Prompt模板,AI检测,AI消痕,AI味识别,人味写作">
    <meta name="theme-color" content="#ffffff">
    <meta name="author" content="AI 萌新小窝">
    <meta name="page-type" content="topic">
    <link rel="canonical" href="https://corely.top/deai.html">
    <title>去AI味专区 — 让你的AI文章读起来像人写的 | AI 萌新小窝</title>
    <meta property="og:type" content="website">
    <meta property="og:title" content="去AI味专区 — 让你的AI文章读起来像人写的 | AI 萌新小窝">
    <meta property="og:description" content="去AI味写作技巧专题——Prompt模板、高频词词典、最新方法、案例对比">
    <meta property="og:url" content="https://corely.top/deai.html">
    <meta property="og:site_name" content="AI 萌新小窝">
    <meta property="og:locale" content="zh_CN">
    <meta property="og:image" content="https://corely.top/logo.svg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="去AI味专区 — AI 萌新小窝">
    <meta name="twitter:description" content="去AI味写作技巧专题——让你的AI文章读起来像人写的">
    <meta name="twitter:image" content="https://corely.top/logo.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700;900&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css?v=20260516">
    <link rel="manifest" href="manifest.json?v=20260516">
    <script>var _hmt=_hmt||[];(function(){var hm=document.createElement("script");hm.src="https://hm.baidu.com/hm.js?7da04a23e1fb1934e90419a677b100e2";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm,s)})();</script>
    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"CollectionPage","name":"去AI味专区","description":"去AI味写作技巧专题——Prompt模板、高频词词典、最新去AI味方法、案例对比","url":"https://corely.top/deai.html","isPartOf":{"@type":"WebSite","name":"AI 萌新小窝","url":"https://corely.top"}}
    </script>
    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"首页","item":"https://corely.top/"},{"@type":"ListItem","position":2,"name":"去AI味专区","item":"https://corely.top/deai.html"}]}
    </script>
    <script src="baidu-push.js?v=20260516" defer></script>
</head>
<body>
    <div class="page-wrapper">
        <header class="site-header">
            <nav class="top-nav">
                <a href="index.html" class="nav-logo">
                    <span class="logo-char">AI</span>
                    <span class="logo-text">萌新小窝</span>
                </a>
                <ul class="nav-menu">
                    <li><a href="resource.html" class="nav-item"><span class="nav-icon">🌐</span>资源导航</a></li>
                    <li><a href="ai.html" class="nav-item"><span class="nav-icon">🤖</span>AI学习</a></li>
                    <li><a href="webnovel.html" class="nav-item"><span class="nav-icon">📖</span>网文在线</a></li>
                    <li><a href="board.html" class="nav-item"><span class="nav-icon">💬</span>留言版</a></li>
                </ul>
                <button class="mobile-menu-btn" aria-label="菜单">
                    <span></span><span></span><span></span>
                </button>
            </nav>
        </header>

        <section class="hero" style="padding: 60px 0 40px;">
            <div class="hero-content">
                <div class="hero-badge">✧ 去AI味专区</div>
                <h1 class="hero-title">
                    <span class="title-line">去AI味不是改几个词</span>
                    <span class="title-line title-accent">是改变写作思维方式</span>
                </h1>
                <p class="hero-subtitle">从Prompt模板到案例对比，从高频词词典到最新技巧——系统化去除AI写作的机器痕迹</p>
            </div>
        </section>

        <main class="main-content">
            <section class="content-area">
                <div class="section-header">
                    <span class="section-label">全部文章</span>
                    <h2 class="section-title">去AI味 · 全部技巧</h2>
                    <div class="section-line"></div>
                </div>
                <div id="topic-container"></div>
            </section>
        </main>

        <footer class="site-footer">
            <div class="footer-content">
                <div class="footer-brand">AI 萌新小窝</div>
                <div class="footer-nav">
                    <a href="index.html" class="footer-link">首页</a>
                    <a href="resource.html" class="footer-link">资源导航</a>
                    <a href="ai.html" class="footer-link">AI学习</a>
                    <a href="ai-writing.html" class="footer-link">AI写作</a>
                    <a href="board.html" class="footer-link">留言版</a>
                    <a href="disclaimer.html" class="footer-link" target="_blank">免责声明</a>
                </div>
                <p class="footer-copy">&copy; 2026 AI 萌新小窝. All rights reserved.</p>
            </div>
        </footer>
    </div>
    <script src="render-content.js?v=20260516" defer></script>
    <script src="script.js?v=20260516" defer></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            renderTopicPage('去AI味', 'topic-container', {
                filterCategories: ['Prompt模板', 'AI高频词', '最新技巧', '对比案例', '方法论', '场景实战', '避坑指南']
            });
        });
    </script>
</body>
</html>
```

- [ ] **Step 2: 提交**

```bash
git add deai.html
git commit -m "feat: add deai.html topic page"
```

---

### Task 3: 新建 newbie.html — 萌新学习专题页

**Files:**
- Create: `newbie.html`

- [ ] **Step 1: 创建 newbie.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="AI写作萌新入门指南——从博主教程到实战变现，从网文写作到去AI味，零基础也能系统掌握AI辅助写作">
    <meta name="keywords" content="AI写作入门,AI写作教程,AI写作变现,AI网文写作,AI拆书,萌新学习,AI辅助写作">
    <meta name="theme-color" content="#ffffff">
    <meta name="author" content="AI 萌新小窝">
    <meta name="page-type" content="topic">
    <link rel="canonical" href="https://corely.top/newbie.html">
    <title>萌新学习 — AI写作入门指南 | AI 萌新小窝</title>
    <meta property="og:type" content="website">
    <meta property="og:title" content="萌新学习 — AI写作入门指南 | AI 萌新小窝">
    <meta property="og:description" content="AI写作萌新入门指南——从博主教程到实战变现，零基础系统掌握AI辅助写作">
    <meta property="og:url" content="https://corely.top/newbie.html">
    <meta property="og:site_name" content="AI 萌新小窝">
    <meta property="og:locale" content="zh_CN">
    <meta property="og:image" content="https://corely.top/logo.svg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="萌新学习 — AI 萌新小窝">
    <meta name="twitter:description" content="AI写作萌新入门指南——零基础系统掌握AI辅助写作">
    <meta name="twitter:image" content="https://corely.top/logo.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700;900&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css?v=20260516">
    <link rel="manifest" href="manifest.json?v=20260516">
    <script>var _hmt=_hmt||[];(function(){var hm=document.createElement("script");hm.src="https://hm.baidu.com/hm.js?7da04a23e1fb1934e90419a677b100e2";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm,s)})();</script>
    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"CollectionPage","name":"萌新学习","description":"AI写作萌新入门指南——从博主教程到实战变现，零基础系统掌握AI辅助写作","url":"https://corely.top/newbie.html","isPartOf":{"@type":"WebSite","name":"AI 萌新小窝","url":"https://corely.top"}}
    </script>
    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"首页","item":"https://corely.top/"},{"@type":"ListItem","position":2,"name":"萌新学习","item":"https://corely.top/newbie.html"}]}
    </script>
    <script src="baidu-push.js?v=20260516" defer></script>
</head>
<body>
    <div class="page-wrapper">
        <header class="site-header">
            <nav class="top-nav">
                <a href="index.html" class="nav-logo">
                    <span class="logo-char">AI</span>
                    <span class="logo-text">萌新小窝</span>
                </a>
                <ul class="nav-menu">
                    <li><a href="resource.html" class="nav-item"><span class="nav-icon">🌐</span>资源导航</a></li>
                    <li><a href="ai.html" class="nav-item"><span class="nav-icon">🤖</span>AI学习</a></li>
                    <li><a href="webnovel.html" class="nav-item"><span class="nav-icon">📖</span>网文在线</a></li>
                    <li><a href="board.html" class="nav-item"><span class="nav-icon">💬</span>留言版</a></li>
                </ul>
                <button class="mobile-menu-btn" aria-label="菜单">
                    <span></span><span></span><span></span>
                </button>
            </nav>
        </header>

        <section class="hero" style="padding: 60px 0 40px;">
            <div class="hero-content">
                <div class="hero-badge">✧ 萌新学习</div>
                <h1 class="hero-title">
                    <span class="title-line">从零开始</span>
                    <span class="title-line title-accent">用AI写出你的第一篇文章</span>
                </h1>
                <p class="hero-subtitle">从博主教程到实战变现，从网文写作到去AI味——系统化入门AI辅助写作</p>
            </div>
        </section>

        <main class="main-content">
            <section class="content-area">
                <div class="section-header">
                    <span class="section-label">全部课程</span>
                    <h2 class="section-title">萌新学习 · 全部教程</h2>
                    <div class="section-line"></div>
                </div>
                <div id="topic-container"></div>
            </section>
        </main>

        <footer class="site-footer">
            <div class="footer-content">
                <div class="footer-brand">AI 萌新小窝</div>
                <div class="footer-nav">
                    <a href="index.html" class="footer-link">首页</a>
                    <a href="resource.html" class="footer-link">资源导航</a>
                    <a href="ai.html" class="footer-link">AI学习</a>
                    <a href="ai-writing.html" class="footer-link">AI写作</a>
                    <a href="board.html" class="footer-link">留言版</a>
                    <a href="disclaimer.html" class="footer-link" target="_blank">免责声明</a>
                </div>
                <p class="footer-copy">&copy; 2026 AI 萌新小窝. All rights reserved.</p>
            </div>
        </footer>
    </div>
    <script src="render-content.js?v=20260516" defer></script>
    <script src="script.js?v=20260516" defer></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            renderTopicPage('萌新学习', 'topic-container', {
                filterCategories: ['博主教程', '网文写作', '写作变现', '拆书入门', '实战教程', '去AI味']
            });
        });
    </script>
</body>
</html>
```

- [ ] **Step 2: 提交**

```bash
git add newbie.html
git commit -m "feat: add newbie.html topic page"
```

---

### Task 4: 新建 littheory.html — 文学理论专题页

**Files:**
- Create: `littheory.html`

- [ ] **Step 1: 创建 littheory.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="文学理论专题——叙事学、结构主义、读者批评、女性主义、后现代主义、比较文学，杨宁老师课程全梳理">
    <meta name="keywords" content="文学理论,叙事学,结构主义,读者批评,女性主义,后现代主义,比较文学,杨宁">
    <meta name="theme-color" content="#ffffff">
    <meta name="author" content="AI 萌新小窝">
    <meta name="page-type" content="topic">
    <link rel="canonical" href="https://corely.top/littheory.html">
    <title>文学理论 — 叙事学与文学批评入门 | AI 萌新小窝</title>
    <meta property="og:type" content="website">
    <meta property="og:title" content="文学理论 — 叙事学与文学批评入门 | AI 萌新小窝">
    <meta property="og:description" content="文学理论专题——叙事学、结构主义、读者批评、女性主义、后现代主义、比较文学">
    <meta property="og:url" content="https://corely.top/littheory.html">
    <meta property="og:site_name" content="AI 萌新小窝">
    <meta property="og:locale" content="zh_CN">
    <meta property="og:image" content="https://corely.top/logo.svg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="文学理论 — AI 萌新小窝">
    <meta name="twitter:description" content="文学理论专题——叙事学与文学批评入门">
    <meta name="twitter:image" content="https://corely.top/logo.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700;900&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css?v=20260516">
    <link rel="manifest" href="manifest.json?v=20260516">
    <script>var _hmt=_hmt||[];(function(){var hm=document.createElement("script");hm.src="https://hm.baidu.com/hm.js?7da04a23e1fb1934e90419a677b100e2";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm,s)})();</script>
    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"CollectionPage","name":"文学理论","description":"文学理论专题——叙事学、结构主义、读者批评、女性主义、后现代主义、比较文学","url":"https://corely.top/littheory.html","isPartOf":{"@type":"WebSite","name":"AI 萌新小窝","url":"https://corely.top"}}
    </script>
    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"首页","item":"https://corely.top/"},{"@type":"ListItem","position":2,"name":"文学理论","item":"https://corely.top/littheory.html"}]}
    </script>
    <script src="baidu-push.js?v=20260516" defer></script>
</head>
<body>
    <div class="page-wrapper">
        <header class="site-header">
            <nav class="top-nav">
                <a href="index.html" class="nav-logo">
                    <span class="logo-char">AI</span>
                    <span class="logo-text">萌新小窝</span>
                </a>
                <ul class="nav-menu">
                    <li><a href="resource.html" class="nav-item"><span class="nav-icon">🌐</span>资源导航</a></li>
                    <li><a href="ai.html" class="nav-item"><span class="nav-icon">🤖</span>AI学习</a></li>
                    <li><a href="webnovel.html" class="nav-item"><span class="nav-icon">📖</span>网文在线</a></li>
                    <li><a href="board.html" class="nav-item"><span class="nav-icon">💬</span>留言版</a></li>
                </ul>
                <button class="mobile-menu-btn" aria-label="菜单">
                    <span></span><span></span><span></span>
                </button>
            </nav>
        </header>

        <section class="hero" style="padding: 60px 0 40px;">
            <div class="hero-content">
                <div class="hero-badge">✧ 文学理论</div>
                <h1 class="hero-title">
                    <span class="title-line">读懂文学之前</span>
                    <span class="title-line title-accent">先读懂"如何读"</span>
                </h1>
                <p class="hero-subtitle">从叙事学到后现代主义——杨宁老师B站千万播放课程梳理，构建你的文学理论坐标系</p>
            </div>
        </section>

        <main class="main-content">
            <section class="content-area">
                <div class="section-header">
                    <span class="section-label">理论研习</span>
                    <h2 class="section-title">文学理论 · 全部文章</h2>
                    <div class="section-line"></div>
                </div>
                <div id="topic-container"></div>
            </section>
        </main>

        <footer class="site-footer">
            <div class="footer-content">
                <div class="footer-brand">AI 萌新小窝</div>
                <div class="footer-nav">
                    <a href="index.html" class="footer-link">首页</a>
                    <a href="resource.html" class="footer-link">资源导航</a>
                    <a href="ai.html" class="footer-link">AI学习</a>
                    <a href="ai-writing.html" class="footer-link">AI写作</a>
                    <a href="board.html" class="footer-link">留言版</a>
                    <a href="disclaimer.html" class="footer-link" target="_blank">免责声明</a>
                </div>
                <p class="footer-copy">&copy; 2026 AI 萌新小窝. All rights reserved.</p>
            </div>
        </footer>
    </div>
    <script src="render-content.js?v=20260516" defer></script>
    <script src="script.js?v=20260516" defer></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            renderTopicPage('文学理论', 'topic-container');
        });
    </script>
</body>
</html>
```

- [ ] **Step 2: 提交**

```bash
git add littheory.html
git commit -m "feat: add littheory.html topic page"
```

---

### Task 5: 新建 book-excerpts.html — 书摘文案专题页

**Files:**
- Create: `book-excerpts.html`

- [ ] **Step 1: 创建 book-excerpts.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="书摘文案专题——经典书摘、名人名言、经典书评、高赞划线、网络热梗、高赞文案，读书人的灵感素材库">
    <meta name="keywords" content="书摘,名人名言,经典书评,微信读书,高赞文案,网络热梗,读书素材">
    <meta name="theme-color" content="#ffffff">
    <meta name="author" content="AI 萌新小窝">
    <meta name="page-type" content="topic">
    <link rel="canonical" href="https://corely.top/book-excerpts.html">
    <title>书摘文案 — 经典书摘与高赞文案合集 | AI 萌新小窝</title>
    <meta property="og:type" content="website">
    <meta property="og:title" content="书摘文案 — 经典书摘与高赞文案合集# | AI 萌新小窝">
    <meta property="og:description" content="书摘文案专题——经典书摘、名人名言、经典书评、高赞划线、网络热梗、高赞文案">
    <meta property="og:url" content="https://corely.top/book-excerpts.html">
    <meta property="og:site_name" content="AI 萌新小窝">
    <meta property="og:locale" content="zh_CN">
    <meta property="og:image" content="https://corely.top/logo.svg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="书摘文案 — AI 萌新小窝">
    <meta name="twitter:description" content="书摘文案专题——经典书摘与高赞文案合集">
    <meta name="twitter:image" content="https://corely.top/logo.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700;900&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css?v=20260516">
    <link rel="manifest" href="manifest.json?v=20260516">
    <script>var _hmt=_hmt||[];(function(){var hm=document.createElement("script");hm.src="https://hm.baidu.com/hm.js?7da04a23e1fb1934e90419a677b100e2";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm,s)})();</script>
    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"CollectionPage","name":"书摘文案","description":"书摘文案专题——经典书摘、名人名言、经典书评、高赞文案","url":"https://corely.top/book-excerpts.html","isPartOf":{"@type":"WebSite","name":"AI 萌新小窝","url":"https://corely.top"}}
    </script>
    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"首页","item":"https://corely.top/"},{"@type":"ListItem","position":2,"name":"书摘文案","item":"https://corely.top/book-excerpts.html"}]}
    </script>
    <script src="baidu-push.js?v=20260516" defer></script>
</head>
<body>
    <div class="page-wrapper">
        <header class="site-header">
            <nav class="top-nav">
                <a href="index.html" class="nav-logo">
                    <span class="logo-char">AI</span>
                    <span class="logo-text">萌新小窝</span>
                </a>
                <ul class="nav-menu">
                    <li><a href="resource.html" class="nav-item"><span class="nav-icon">🌐</span>资源导航</a></li>
                    <li><a href="ai.html" class="nav-item"><span class="nav-icon">🤖</span>AI学习</a></li>
                    <li><a href="webnovel.html" class="nav-item"><span class="nav-icon">📖</span>网文在线</a></li>
                    <li><a href="board.html" class="nav-item"><span class="nav-icon">💬</span>留言版</a></li>
                </ul>
                <button class="mobile-menu-btn" aria-label="菜单">
                    <span></span><span></span><span></span>
                </button>
            </nav>
        </header>

        <section class="hero" style="padding: 60px 0 40px;">
            <div class="hero-content">
                <div class="hero-badge">✧ 书摘文案</div>
                <h1 class="hero-title">
                    <span class="title-line">好的句子</span>
                    <span class="title-line title-accent">是灵魂的闪电</span>
                </h1>
                <p class="hero-subtitle">经典书摘、名人名言、高赞文案——那些被无数人划线、摘抄、反复品味的句子</p>
            </div>
        </section>

        <main class="main-content">
            <section class="content-area">
                <div class="section-header">
                    <span class="section-label">每日书摘</span>
                    <h2 class="section-title">书摘文案 · 全部内容</h2>
                    <div class="section-line"></div>
                </div>
                <div id="topic-container"></div>
            </section>
        </main>

        <footer class="site-footer">
            <div class="footer-content">
                <div class="footer-brand">AI 萌新小窝</div>
                <div class="footer-nav">
                    <a href="index.html" class="footer-link">首页</a>
                    <a href="resource.html" class="footer-link">资源导航</a>
                    <a href="ai.html" class="footer-link">AI学习</a>
                    <a href="ai-writing.html" class="footer-link">AI写作</a>
                    <a href="board.html" class="footer-link">留言版</a>
                    <a href="disclaimer.html" class="footer-link" target="_blank">免责声明</a>
                </div>
                <p class="footer-copy">&copy; 2026 AI 萌新小窝. All rights reserved.</p>
            </div>
        </footer>
    </div>
    <script src="render-content.js?v=20260516" defer></script>
    <script src="script.js?v=20260516" defer></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            renderTopicPage('书摘文案', 'topic-container');
        });
    </script>
</body>
</html>
```

- [ ] **Step 2: 提交**

```bash
git add book-excerpts.html
git commit -m "feat: add book-excerpts.html topic page"
```

---

### Task 6: 新建 knowledge.html — 知识创作专题页

**Files:**
- Create: `knowledge.html`

- [ ] **Step 1: 创建 knowledge.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="AI知识创作工具专题——GPT Academic、Ollama、LangChain、Dify、prompt-engineering等AI写作与知识创作工具全解析">
    <meta name="keywords" content="AI知识创作,AI写作工具,GPT Academic,Ollama,LangChain,Dify,Prompt工程,开源AI工具">
    <meta name="theme-color" content="#ffffff">
    <meta name="author" content="AI 萌新小窝">
    <meta name="page-type" content="topic">
    <link rel="canonical" href="https://corely.top/knowledge.html">
    <title>知识创作 — AI写作与知识创作工具大全 | AI 萌新小窝</title>
    <meta property="og:type" content="website">
    <meta property="og:title" content="知识创作 — AI写作与知识创作工具大全 | AI 萌新小窝">
    <meta property="og:description" content="AI知识创作工具专题——GPT Academic、Ollama、LangChain、Dify等开源AI写作工具全解析">
    <meta property="og:url" content="https://corely.top/knowledge.html">
    <meta property="og:site_name" content="AI 萌新小窝">
    <meta property="og:locale" content="zh_CN">
    <meta property="og:image" content="https://corely.top/logo.svg">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="知识创作 — AI 萌新小窝">
    <meta name="twitter:description" content="AI知识创作工具专题——AI写作与知识创作开源工具全解析">
    <meta name="twitter:image" content="https://corely.top/logo.svg">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700;900&family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css?v=20260516">
    <link rel="manifest" href="manifest.json?v=20260516">
    <script>var _hmt=_hmt||[];(function(){var hm=document.createElement("script");hm.src="https://hm.baidu.com/hm.js?7da04a23e1fb1934e90419a677b100e2";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm,s)})();</script>
    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"CollectionPage","name":"知识创作","description":"AI知识创作工具专题——GPT Academic、Ollama、LangChain、Dify等开源AI写作工具全解析","url":"https://corely.top/knowledge.html","isPartOf":{"@type":"WebSite","name":"AI 萌新小窝","url":"https://corely.top"}}
    </script>
    <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"首页","item":"https://corely.top/"},{"@type":"ListItem","position":2,"name":"知识创作","item":"https://corely.top/knowledge.html"}]}
    </script>
    <script src="baidu-push.js?v=20260516" defer></script>
</head>
<body>
    <div class="page-wrapper">
        <header class="site-header">
            <nav class="top-nav">
                <a href="index.html" class="nav-logo">
                    <span class="logo-char">AI</span>
                    <span class="logo-text">萌新小窝</span>
                </a>
                <ul class="nav-menu">
                    <li><a href="resource.html" class="nav-item"><span class="nav-icon">🌐</span>资源导航</a></li>
                    <li><a href="ai.html" class="nav-item"><span class="nav-icon">🤖</span>AI学习</a></li>
                    <li><a href="webnovel.html" class="nav-item"><span class="nav-icon">📖</span>网文在线</a></li>
                    <li><a href="board.html" class="nav-item"><span class="nav-icon">💬</span>留言版</a></li>
                </ul>
                <button class="mobile-menu-btn" aria-label="菜单">
                    <span></span><span></span><span></span>
                </button>
            </nav>
        </header>

        <section class="hero" style="padding: 60px 0 40px;">
            <div class="hero-content">
                <div class="hero-badge">✧ 知识创作</div>
                <h1 class="hero-title">
                    <span class="title-line">用AI工具</span>
                    <span class="title-line title-accent">放大你的创作力</span>
                </h1>
                <p class="hero-subtitle">从GPT Academic到Ollama本地部署——15款AI写作与知识创作工具深度解析</p>
            </div>
        </section>

        <main class="main-content">
            <section class="content-area">
                <div class="section-header">
                    <span class="section-label">工具推荐</span>
                    <h2 class="section-title">知识创作 · 全部工具</h2>
                    <div class="section-line"></div>
                </div>
                <div id="topic-container"></div>
            </section>
        </main>

        <footer class="site-footer">
            <div class="footer-content">
                <div class="footer-brand">AI 萌新小窝</div>
                <div class="footer-nav">
                    <a href="index.html" class="footer-link">首页</a>
                    <a href="resource.html" class="footer-link">资源导航</a>
                    <a href="ai.html" class="footer-link">AI学习</a>
                    <a href="ai-writing.html" class="footer-link">AI写作</a>
                    <a href="board.html" class="footer-link">留言版</a>
                    <a href="disclaimer.html" class="footer-link" target="_blank">免责声明</a>
                </div>
                <p class="footer-copy">&copy; 2026 AI 萌新小窝. All rights reserved.</p>
            </div>
        </footer>
    </div>
    <script src="render-content.js?v=20260516" defer></script>
    <script src="script.js?v=20260516" defer></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            renderTopicPage('知识创作', 'topic-container', { cardRenderer: 'knowledge' });
        });
    </script>
</body>
</html>
```

- [ ] **Step 2: 提交**

```bash
git add knowledge.html
git commit -m "feat: add knowledge.html topic page"
```

---

### Task 7: 改造 book-analysis.html — 硬编码 → manifest 动态渲染

**Files:**
- Modify: `book-analysis.html` (add `<meta name="page-type" content="topic">` in `<head>`, replace hardcoded card sections with `#topic-container`, add render-content.js + inline script)

- [ ] **Step 1: 将 hardcoded 卡片区域替换为 JS 渲染容器**

将 lines 100-140 的硬编码内容区域替换为动态容器：

删除 lines 100-140 的 3 个 `<section>` (文学理论 hardcoded cards, 书摘 hardcoded cards, 读写联动 hardcoded cards) 及其全部硬编码卡片，替换为：

```html
            <section class="content-area" style="margin-top: 40px;">
                <div class="section-header">
                    <span class="section-label">全部拆书</span>
                    <h2 class="section-title">经典名著 · 逐段拆解</h2>
                    <div class="section-line"></div>
                </div>
                <div id="topic-container"></div>
            </section>
```

- [ ] **Step 2: 在 `</body>` 前添加 render-content.js 引用和内联脚本**

在 `</body>` 前（`<script src="script.js...">` 之后）添加：

```html
    <script src="render-content.js?v=20260516" defer></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            renderTopicPage('拆书心得', 'topic-container', {
                filterCategories: ['红楼梦', '活着', '百年孤独', '呼兰河传', '围城', '三体', '平凡的世界', 'AI拆书方法论']
            });
        });
    </script>
```

- [ ] **Step 3: 提交**

```bash
git add book-analysis.html
git commit -m "refactor: convert book-analysis.html to manifest-driven rendering"
```

---

### Task 8: 瘦身 index.html — 首页板块精简 + 查看更多链接

**Files:**
- Modify: `index.html`

需要对 6 个板块做不同处理。当前状态：
- `#case-container` (拆书心得) — 22 张硬编码卡片 → 保留最新 6 张 + "查看更多"链接
- `#littheory-container` (文学理论) — 6 张硬编码 → 保留 + "查看更多"
- `#literature-container` (书摘文案) — 6 张硬编码 → 保留 + "查看更多"
- `#newbie-container` (萌新学习) — 13 张硬编码 → 保留最新 6 张 + "查看更多"
- `#deai-container` (去AI味) — 10 张硬编码 → 保留最新 6 张 + "查看更多"
- `#knowledge-creation-container` (知识创作) — JS 动态渲染 → 通过 maxCards 限制

- [ ] **Step 1: 拆书心得板块 — 保留最新 6 张 + "查看更多"**

删除 `#case-container` 中 book-analysis-001 到 book-analysis-006 (呼兰河传) 的 6 张旧卡（lines 242-247），保留 book-analysis-022 到 026 (5 张 05-13 新卡) + book-analysis-007 (红楼梦) 到 book-analysis-021 中最新的 1 张，共保留 6 张。

最简单的做法：删掉 `#case-container` 内的所有硬编码卡片，改为动态渲染（maxCards=6），与知识创作板块处理方式一致。

在 `#case-container` 的 `<div class="case-grid" id="case-container">` 后清空所有硬编码 `<a>` 卡片，在 `</div>` 后加"查看更多"链接：

```html
                    <div class="case-grid" id="case-container"></div>
                    <div style="text-align:center;margin-top:20px;">
                        <a href="book-analysis.html" class="btn-view-more">查看更多拆书心得 →</a>
                    </div>
```

- [ ] **Step 2: 修改 renderHomepage() 中 renderBookAnalysisWithFilter 调用，加 maxCards 参数**

在 `render-content.js` 的 `renderBookAnalysisWithFilter()` 函数签名和逻辑中加上 maxCards 支持。修改该函数（lines 1573-1621）：

```javascript
async function renderBookAnalysisWithFilter(maxCards = 0) {
    const container = document.getElementById('case-container');
    if (!container) return;

    const bookData = await getBookAnalysisData();

    // Sort by date descending (newest first)
    bookData.sort((a, b) => {
        const da = new Date(a.date); const db = new Date(b.date);
        return (db - da) || a.fileName.localeCompare(b.fileName);
    });

    const displayData = maxCards > 0 ? bookData.slice(0, maxCards) : bookData;

    // Filter bar — only show on full listing pages
    const filterHtml = maxCards > 0 ? '' : `
        <div class="newbie-filter">
            <span class="newbie-filter-label">筛选</span>
            <button class="newbie-filter-btn active" data-category="all">全部文章</button>
            ... (existing filter buttons)
        </div>`;

    const cardsHtml = displayData.map((item, i) => renderBookAnalysisCard(item, i)).join('');
    container.innerHTML = filterHtml + `<div class="newbie-grid">${cardsHtml}</div>`;

    // Wire filter buttons only when present
    if (maxCards === 0) {
        const filterBtns = container.querySelectorAll('.newbie-filter-btn');
        // ... existing filter logic ...
    }
}
```

然后在 `renderHomepage()` 中调用时传入 maxCards:
```javascript
renderBookAnalysisWithFilter(6).catch(e => console.error('Book analysis failed:', e)),
```

- [ ] **Step 3: 萌新学习板块 — 保留最新 6 张 + "查看更多"**

删除 `#newbie-container` 内的所有硬编码卡片（当前 lines 302-316），改为空容器：

```html
                    <div id="newbie-container"></div>
                    <div style="text-align:center;margin-top:20px;">
                        <a href="newbie.html" class="btn-view-more">查看更多萌新教程 →</a>
                    </div>
```

修改 `renderNewbieWithFilter()` 函数支持 maxCards，在 `renderHomepage()` 传 `renderNewbieWithFilter(6)`。

- [ ] **Step 4: 去AI味板块 — 保留最新 6 张 + "查看更多"**

同上，`#deai-container` 清空硬编码卡片：

```html
                    <div id="deai-container"></div>
                    <div style="text-align:center;margin-top:20px;">
                        <a href="deai.html" class="btn-view-more">查看更多去AI味技巧 →</a>
                    </div>
```

修改 `renderDeaiWithFilter()` 支持 maxCards。

- [ ] **Step 5: 文学理论、书摘文案 — 加"查看更多"链接**

这两个板块只有 6 张卡片且已硬编码，暂时保留硬编码，仅加链接：

在 `#littheory-container` 的 `</div>` 后：
```html
                    <div style="text-align:center;margin-top:20px;">
                        <a href="littheory.html" class="btn-view-more">查看更多文学理论 →</a>
                    </div>
```

在 `#literature-container` 的 `</div>` 后：
```html
                    <div style="text-align:center;margin-top:20px;">
                        <a href="book-excerpts.html" class="btn-view-more">查看更多书摘文案 →</a>
                    </div>
```

- [ ] **Step 6: 知识创作板块 — 加"查看更多"链接 + maxCards**

在 `#knowledge-creation-container` 的 `</div>` 后：
```html
                    <div style="text-align:center;margin-top:20px;">
                        <a href="knowledge.html" class="btn-view-more">查看更多知识创作工具 →</a>
                    </div>
```

修改 `renderKnowledgeCreationWithFilter()` 调用为 `renderKnowledgeCreationWithFilter(6)`。

- [ ] **Step 7: 添加 .btn-view-more 样式到 styles.css**

在 `styles.css` 中追加：

```css
.btn-view-more {
    display: inline-block;
    padding: 10px 28px;
    border: 1px solid var(--accent-primary);
    border-radius: 24px;
    color: var(--accent-primary);
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.25s;
}
.btn-view-more:hover {
    background: var(--accent-primary);
    color: var(--bg-primary);
}
```

- [ ] **Step 8: 提交**

```bash
git add index.html render-content.js styles.css
git commit -m "feat: slim homepage to 6 cards per section with view-more links"
```

---

### Task 9: 更新 RSS/Sitemap 加入新专题页

**Files:**
- Modify: `rss.xml` (由 generate_feeds.py 生成)
- Modify: `sitemap.xml` (由 generate_feeds.py 生成)

- [ ] **Step 1: 重新生成 feeds**

```bash
python generate_feeds.py
```

- [ ] **Step 2: 提交**

```bash
git add rss.xml sitemap.xml
git commit -m "chore: regenerate feeds with new topic pages"
```
