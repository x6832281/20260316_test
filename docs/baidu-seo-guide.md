# 百度搜索引擎收录操作指南

## 已完成的工作

以下SEO优化已自动完成并部署：

### 1. robots.txt 优化
- ✅ 添加了百度爬虫（Baiduspider）专门配置
- ✅ 添加了中国主流搜索引擎爬虫支持（360Spider、Sogou、Googlebot）
- ✅ 屏蔽了测试文件和非公开目录，避免影响收录质量

### 2. 百度自动推送
- ✅ 创建了 `baidu-push.js` 文件，集成百度自动推送功能
- ✅ 所有主要页面已添加自动推送脚本：
  - index.html（首页）
  - ai.html（AI学习）
  - ai-writing.html（AI写作）
  - book-analysis.html（AI拆书）
  - resource.html（资源导航）
  - webnovel.html（网文在线）
  - game.html（游戏开发）
  - board.html（留言版）
  - debate.html（经典对话）
  - article.html（文章页）
  - faq.html（常见问题）
  - glossary.html（术语词典）
  - disclaimer.html（免责声明）
  - 404.html（404页面）

### 3. 站点地图
- ✅ `sitemap.xml` 已存在并配置完整，包含所有主要页面
- ✅ `robots.txt` 已指向 sitemap 地址

### 4. 结构化数据
- ✅ 已实现 Schema.org 结构化数据（Article、FAQPage、BreadcrumbList、WebSite）
- ✅ 已配置 Open Graph 和 Twitter Card 社交分享标签

---

## 你必须手动完成的步骤

### 第一步：在百度站长平台添加网站

1. 访问 [百度站长平台](https://ziyuan.baidu.com/)
2. 使用百度账号登录（没有的话先注册）
3. 点击"添加网站"
4. 输入你的网站地址：`https://corely.top`

### 第二步：验证网站所有权

百度会提供几种验证方式，选择**其中一种**即可：

#### 方式A：文件验证（推荐，最简单）
1. 百度会生成一个验证文件，文件名类似 `baidu_verify_code-XXXXXXXXXX.html`
2. 下载该文件
3. 将文件上传到网站根目录（即与 index.html 同一目录）
4. 确保能通过 `https://corely.top/baidu_verify_code-XXXXXXXXXX.html` 访问
5. 在百度站长平台点击"完成验证"

#### 方式B：DNS验证
1. 百度会提供一个TXT记录值
2. 登录你的域名管理后台（如阿里云、腾讯云、Cloudflare等）
3. 添加一条TXT记录：
   - 主机记录：`@` 或留空
   - 记录类型：`TXT`
   - 记录值：百度提供的验证字符串
4. 等待DNS生效（通常几分钟到几小时）
5. 在百度站长平台点击"完成验证"

#### 方式C：HTML标签验证
1. 百度会提供一个 `<meta>` 标签代码
2. 将该标签添加到 `index.html` 的 `<head>` 部分
3. 保存并上传到服务器
4. 在百度站长平台点击"完成验证"

### 第三步：提交网站内容

验证成功后，在百度站长平台：

1. **提交sitemap**
   - 进入"资源提交" > "普通收录"
   - 选择"Sitemap"提交方式
   - 输入：`https://corely.top/sitemap.xml`
   - 点击提交

2. **手动提交URL（可选）**
   - 进入"资源提交" > "普通收录"
   - 选择"手动提交"
   - 批量粘贴你网站的所有URL（每行一个）
   - 提交

3. **API提交（高级，可选）**
   - 如果后续需要自动化提交新页面
   - 可以使用百度提供的API接口
   - 参考：[百度站长API文档](https://ziyuan.baidu.com/college/courseinfo?id=267&page=2#h2_article_title14)

### 第四步：等待收录

- **首次收录**：通常 1-7 个工作日
- **完全收录**：可能需要 1-2 周
- **加速收录技巧**：
  - 保持网站内容更新频率
  - 在其他平台分享网站链接（知乎、微博、微信公众号等）
  - 确保网站访问速度快
  - 保持网站稳定运行

### 第五步：检查收录状态

1. **百度搜索**：在百度搜索 `site:corely.top`
   - 如果看到你的页面，说明已被收录
   - 收录数量会随时间增加

2. **百度站长平台**：
   - 查看"收录量"统计
   - 查看"抓取频次"
   - 查看"robots.txt更新"状态

---

## 日常维护建议

### 内容更新
- 每次发布新文章后，在百度站长平台提交新URL
- 更新 `sitemap.xml` 中的 `lastmod` 日期
- 自动推送会在用户访问时自动通知百度

### 监控与优化
- 每周检查一次百度站长平台的"抓取异常"
- 查看"流量与关键词"了解搜索来源
- 关注"移动专区"确保移动端友好

### 其他中国搜索引擎
除了百度，建议同时提交到：
- **360搜索**：https://so.com（提交到 [360站长平台](https://zhanzhang.so.com/)）
- **搜狗搜索**：https://www.sogou.com（提交到 [搜狗站长平台](https://zhanzhang.sogou.com/)）
- **神马搜索**：https://www.sm.cn（提交到 [神马站长平台](https://zhanzhang.sm.cn/)）

---

## 常见问题

**Q：为什么提交后还是搜索不到？**
A：百度需要时间爬取和索引，耐心等待1-2周。确保网站可以正常访问且内容有价值。

**Q：如何提高收录速度？**
A：保持内容更新频率，在其他平台分享链接，确保网站加载速度快，内容质量高。

**Q：自动推送有用吗？**
A：有用。每次用户访问页面时，会自动向百度推送该页面URL，帮助百度及时发现新内容。

**Q：需要付费才能被收录吗？**
A：不需要。普通收录是免费的。百度有付费推广服务（SEM），但那是广告，与自然收录无关。

---

## 技术支持

如有问题，可参考：
- [百度站长学院](https://ziyuan.baidu.com/college/)
- [百度搜索资源平台帮助中心](https://ziyuan.baidu.com/college/courseinfo)
