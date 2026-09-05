# 热门评论区观察站

每日自动采集**小红书**热门笔记的高赞评论、**B站**热门视频的高赞评论与热门弹幕、**GitHub** Trending 热门项目（含简介/星数），按点赞数/频次排序筛选，输出 TXT 日报，并通过 `index.html` 呈现当日数据高亮。

## 每日产出（daily/日期/）

| 日报 | 内容 | 筛选标准 |
|---|---|---|
| 小红书_经典高赞.txt | 热度排序爆款笔记的评论 | ≥100 赞 |
| 小红书_今日最新.txt | 时间排序新笔记的评论 | ≥20 赞 + 近 24 小时发布 |
| B站_热门弹幕.txt | 热门视频弹幕频次聚合 | ≥5 次 + 三层噪声过滤 |
| B站_高赞评论.txt | 热门视频评论 | ≥50 赞 |
| GitHub_热门项目.txt | Trending 全站热门项目 | 按今日新增 Star 排序 |

## 快速开始

```bash
# 1. 安装依赖
pip install -r requirements.txt

# 2. 获取采集底座（小红书部分依赖 MediaCrawler）
git clone https://github.com/NanmiCoder/MediaCrawler.git
pip install -r MediaCrawler/requirements.txt
# 按 MediaCrawler 文档安装 playwright 浏览器

# 3. 首次运行（会弹出浏览器，扫码登录小红书，之后免扫码）
py daily_run.py --keywords "手机"

# 4. 打开数据呈现页
start index.html
```

## 仓库结构

```
daily_run.py           # 每日编排入口（五轮采集）
mc_comment_filter.py   # 小红书评论筛选 → TXT
bili_danmaku.py        # B站弹幕采集 + 频次聚合 + 去噪
bili_comments.py       # B站高赞评论采集
github_trending.py     # GitHub Trending 热门项目采集
index.html             # 数据呈现页（图表 + 当日高亮）
assets/ _shared/       # 呈现页静态资源
data/                  # 每日 TXT 日报样例
MediaCrawler/          # 采集底座（需另行 clone，不入库）
```

## 工作原理

- **小红书**：基于 [MediaCrawler](https://github.com/NanmiCoder/MediaCrawler)（Playwright + 官方 Web 接口），登录态持久化在本地浏览器目录，首次扫码后长期免登录。编排脚本自动切换排序策略跑两轮：热度排序（经典高赞）与时间排序（今日最新，仅保留近 24 小时发布的评论）。
- **B站**：免登录直连接口。热门/排行榜 API 取视频列表（自带 cid），XML 弹幕接口采全量弹幕做频次聚合，评论接口（`sort=2` 热度序）取游客可见热评。
- **GitHub**：免登录解析 github.com/trending 页面，取项目名/简介/语言/总星数/今日新增 Star（star 数已经 gh API 交叉验证）。
- **定时**：每天 09:00 自动执行，产物按日期落盘，登录态失效时提示人工扫码而非卡死。

## 采集参数

`daily_run.py` 顶部常量可调：关键词（或 `--keywords` 参数）、笔记数（`XHS_NOTE_COUNT`）、单笔记评论上限、B站视频数（`BILI_VIDEO_COUNT`）、筛选阈值等。

## 声明

数据经由公开接口采集，仅供学习研究，请遵守各平台服务条款，勿用于商业用途。
