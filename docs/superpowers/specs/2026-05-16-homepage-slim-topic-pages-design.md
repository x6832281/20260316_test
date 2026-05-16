# 首页瘦身 + 独立专题页 设计方案

**日期**: 2026-05-16
**状态**: approved

## 问题

首页 61 张硬编码卡片，82+ 文章持续增长。首页过长，新旧内容混杂，读者难以快速找到最新/最关心的内容。

## 方案

首页做"橱窗" —— 每板块只展示最新 6 条 + "查看更多 →"跳转独立专题页。新建 5 个专题页，统一模板结构。数据从 manifest.json 动态渲染，不再硬编码卡片。

## 板块精简映射

| 板块 | 当前 | 精简后 | 跳转目标 |
|---|---|---|---|
| 热门拆书 | 22张 | 最新6张 | book-analysis.html（改造） |
| 文学理论 | 6张 | 保留6张 | littheory.html（新建） |
| 书摘文案 | 6张 | 保留6张 | book-excerpts.html（新建） |
| 萌新学习 | 13张 | 最新6张 | newbie.html（新建） |
| 去AI味 | 10张 | 最新6张 | deai.html（新建） |
| 知识创作 | JS渲染 | 最新6张 | knowledge.html（新建） |

## 专题页统一模板

每个专题页结构相同：
- 导航栏（复用现有）
- 标题 + 可选分类筛选标签
- CSS Grid 3列卡片流，日期倒序
- 页脚（复用现有）
- 数据来源：JS 从 manifest.json 取该 dir 全部条目
- 兜底：manifest 加载失败时使用 `render-content.js` 中现有硬编码数组

## 数据流

```
manifest.json → JS 过滤(按 dir) → 日期排序 → 渲染 Grid
```

`render-content.js` 新增通用函数 `renderTopicPage(dirName, containerId)` 供所有专题页调用。

首页已有 `renderContentFromManifest()` 函数，可直接复用。

## 文件清单

**新建（5个）:**
- `deai.html` — 去AI味（10篇）
- `newbie.html` — 萌新学习（13篇）
- `littheory.html` — 文学理论（6篇）
- `book-excerpts.html` — 书摘文案（6篇）
- `knowledge.html` — 知识创作（15篇）

**改造（4个）:**
- `render-content.js` — 新增通用专题页渲染函数
- `book-analysis.html` — 硬编码 → manifest 动态渲染
- `index.html` — 板块卡片精简为最新6条 + "查看更多"链接
- `styles.css` — 专题页共享样式（按需）

## 实施顺序

1. `render-content.js` — 新增通用专题页渲染函数
2. 5 个新专题页（统一模板）
3. `book-analysis.html` 改造
4. `index.html` 瘦身
