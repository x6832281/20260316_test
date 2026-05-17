# SEO 优化设计方案

## 目标
通过技术 SEO + 内容 SEO 优化，提升 corely.top 在百度/Google 等搜索引擎的收录和排名。

## 第一部分：技术 SEO

### 1. Canonical 标签修复
- article.html 的 canonical 用 document.write 写入，百度爬虫可能抓不到
- 改为 HTML 中预设静态 canonical，JS 动态覆盖

### 2. OG 标签预填充
- 文章页 OG 标签依赖 JS 执行，预设基础值确保爬虫能读到

### 3. Sitemap 增强
- 顶级页面缺少 lastmod，generate_feeds.py 中补充

### 4. 性能优化
- Google Fonts 改为异步加载（media="print" 模式）
- Supabase CDN 延迟加载
- styles.css 关键 CSS 内联

### 5. 内链增强
- 文章底部相关文章推荐逻辑增强（关键词相似度）
- 正文自动内链（高频关键词链接到站内相关文章）

## 第二部分：内容 SEO

### 1. 关键词矩阵
- 去AI味：核心词 + 长尾词覆盖
- 萌新学习、拆书心得、知识创作、文学理论、书摘文案

### 2. 页面标题标准化
- 文章页：`{标题} | AI 萌新小窝`
- 专题页：`{专题名} — {描述} | AI 萌新小窝`

### 3. 内容扩展
- 去AI味专题继续扩展（热度高）
- 拆书心得扩展更多名著（长尾词丰富）

### 4. 内容新鲜度
- 旧文章定期更新日期
- 重新生成 manifest + feeds
