# -*- coding: utf-8 -*-
"""采集结果自动同步 GitHub：解析当日日报 → 更新 Pages 页面（锚点替换）→ commit/push → 触发构建。

由 daily_run.py 在五轮采集完成后调用，也可单独运行：
    py -3.12 sync_to_github.py                # 同步今天
    py -3.12 sync_to_github.py --date 2026-09-05
    py -3.12 sync_to_github.py --dry-run      # 只打印将要做的改动，不写文件不推送
"""

import argparse
import html
import json
import re
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPO = ROOT / "20260316_test"
SITE_MIRROR = ROOT / "hot-comments-site"
GH = shutil.which("gh") or r"C:\Program Files\GitHub CLI\gh.exe"
REPO_SLUG = "x6832281/20260316_test"

REPORTS = {
    "xhs_classic": "小红书_经典高赞.txt",
    "xhs_today": "小红书_今日最新.txt",
    "bili_comments": "B站_高赞评论.txt",
    "danmaku": "B站_热门弹幕.txt",
    "github": "GitHub_热门项目.txt",
}

SCRIPTS = ["daily_run.py", "mc_comment_filter.py", "bili_danmaku.py", "bili_comments.py",
           "github_trending.py", "sync_to_github.py", "gh_desc_zh.json", "requirements.txt"]


def esc(s) -> str:
    return html.escape(str(s), quote=False)


def to_int(s: str) -> int:
    return int(str(s).replace(",", ""))


def fmt_wan(v: int) -> str:
    return f"{v / 10000:.1f}万" if v >= 10000 else str(v)


# ---------- 日报解析 ----------

def parse_xhs(path: Path) -> dict | None:
    if not path.exists():
        return None
    text = path.read_text(encoding="utf-8-sig")
    head = re.search(r"评论总数: ([\d,]+) \(去重后入选 (\d+) 条, 最低 (\d+) 赞\)", text)
    if not head:
        return None
    entries = []
    pat = re.compile(
        r"^#(\d+)\s+\[([\d,]+) 赞\]\s+(\S+)\s+(\d{4}-\d{2}-\d{2} \d{2}:\d{2})\s*$\n"
        r"^\s+(.+)$\n"
        r"^\s+↳ 笔记: (.+?) \(笔记点赞 (.+?)\)$",
        re.M)
    for m in pat.finditer(text):
        entries.append({
            "rank": int(m.group(1)), "likes": to_int(m.group(2)), "user": m.group(3),
            "time": m.group(4), "content": m.group(5).strip(),
            "note": m.group(6), "note_likes": m.group(7),
        })
    if not entries:
        return None
    return {
        "total": to_int(head.group(1)), "selected": int(head.group(2)),
        "min_likes": int(head.group(3)), "entries": entries,
    }


def parse_bili_comments(path: Path) -> dict | None:
    if not path.exists():
        return None
    text = path.read_text(encoding="utf-8-sig")
    videos = re.search(r"视频数: (\d+)", text)
    head = re.search(r"高赞标准: >= (\d+) 赞 \| 全局榜 (\d+) 条", text)
    if not (videos and head):
        return None
    entries = []
    pat = re.compile(
        r"^#(\d+)\s+\[([\d,]+) 赞\]\s+(\S+)\s+(\d{4}-\d{2}-\d{2} \d{2}:\d{2})\s*$\n"
        r"^\s+(.+)$\n"
        r"^\s+↳ 视频: 《(.+?)》 播放([\d,]+)$",
        re.M)
    for m in pat.finditer(text):
        entries.append({
            "rank": int(m.group(1)), "likes": to_int(m.group(2)), "user": m.group(3),
            "time": m.group(4), "content": m.group(5).strip(),
            "video": m.group(6), "view": to_int(m.group(7)),
        })
    if not entries:
        return None
    return {
        "videos": int(videos.group(1)), "min_likes": int(head.group(1)),
        "selected": int(head.group(2)), "entries": entries,
    }


def parse_danmaku(path: Path) -> dict | None:
    if not path.exists():
        return None
    text = path.read_text(encoding="utf-8-sig")
    head = re.search(r"视频数: (\d+) \| 弹幕总数: ([\d,]+)", text)
    if not head:
        return None
    entries = []
    for m in re.finditer(r"^#(\d+)\s+\[(\d+) 次\]\s+(.+)$", text, re.M):
        entries.append({"rank": int(m.group(1)), "count": int(m.group(2)), "text": m.group(3).strip()})
    if not entries:
        return None
    return {"videos": int(head.group(1)), "total": to_int(head.group(2)), "entries": entries}


def parse_github(path: Path) -> dict | None:
    if not path.exists():
        return None
    text = path.read_text(encoding="utf-8-sig")
    head = re.search(r"项目数: (\d+)", text)
    if not head:
        return None
    entries = []
    pat = re.compile(
        r"^#(\d+)\s+(\S+)\s*$\n"
        r"^\s+今日 \+([\d,]+) 星 \| 总星 ([\d,]+) \| Fork ([\d,]+)(?:\s+\|\s+(\S+))?\s*$\n"
        r"(?:^\s+简介: (.*)$\n)?"
        r"^\s+链接: (\S+)$",
        re.M)
    for m in pat.finditer(text):
        entries.append({
            "rank": int(m.group(1)), "repo": m.group(2), "url": m.group(8),
            "stars_today": to_int(m.group(3)), "total_stars": to_int(m.group(4)),
            "forks": to_int(m.group(5)), "lang": m.group(6) or "—",
            "desc": m.group(7).strip() if m.group(7) else "",
        })
    if not entries:
        return None
    return {"count": int(head.group(1)), "entries": entries}


# ---------- 页面片段生成 ----------

def comment_item(likes: str, user: str, text: str, from_: str) -> str:
    return (
        "        <div class=\"comment-item\">\n"
        f"          <div class=\"head\"><span class=\"likes\">{likes}</span><span class=\"user\">{esc(user)}</span></div>\n"
        f"          <div class=\"text\">{esc(text)}</div>\n"
        f"          <div class=\"from\">{esc(from_)}</div>\n"
        "        </div>"
    )


def card(color: str, tag_cls: str, tag_text: str, meta: str, items: list[str]) -> str:
    cls = f"report-card {color}" if color else "report-card"
    lines = [
        f"      <div class=\"{cls}\">",
        f"        <span class=\"tag {tag_cls}\">{tag_text}</span>",
        f"        <div class=\"meta\">{esc(meta)}</div>",
        *items,
        "      </div>",
    ]
    return "\n".join(lines)


def cut(s: str, n: int) -> str:
    return s if len(s) <= n else s[:n] + "…"


def build_card1(x: dict) -> str:
    items = [
        comment_item(f"{e['likes']:,} 赞", e["user"], cut(e["content"], 60),
                     f"笔记《{cut(e['note'], 24)}》 · 笔记点赞 {e['note_likes']}")
        for e in x["entries"][:3]
    ]
    meta = f"{x['total']:,} 条评论 → {x['selected']} 条 ≥{x['min_likes']} 赞 · 热度排序爆款笔记"
    return card("", "red", "小红书 · 经典高赞", meta, items)


def build_card2(x: dict, today: str) -> str:
    def t(e):
        d, hm = e["time"].split(" ")
        return f"今日 {hm}" if d == today else f"{d[5:]} {hm}"
    items = [
        comment_item(f"{e['likes']:,} 赞", e["user"], cut(e["content"], 60),
                     f"笔记《{cut(e['note'], 24)}》 · {t(e)}")
        for e in x["entries"][:3]
    ]
    meta = f"时间排序新笔记 · 入选 {x['selected']} 条 · 仅保留近 24 小时发布的评论"
    return card("", "red", "小红书 · 今日最新", meta, items)


def build_card3(x: dict) -> str:
    items = [
        comment_item(f"{e['likes']:,} 赞", e["user"], cut(e["content"], 60),
                     f"《{cut(e['video'], 20)}》 · 播放 {fmt_wan(e['view'])}")
        for e in x["entries"][:3]
    ]
    meta = f"{x['videos']} 个热门/排行榜视频 → {x['selected']} 条 ≥{x['min_likes']} 赞 · 游客可见热评"
    return card("blue-card", "blue", "B站 · 高赞评论", meta, items)


def build_card4(x: dict) -> str:
    items = [
        comment_item(f"{e['count']} 次", "全场刷屏", cut(e["text"], 40),
                     f"跨 {x['videos']} 个视频聚合 · 去噪后频次第 {e['rank']} 名")
        for e in x["entries"][:3]
    ]
    meta = f"{x['total']:,} 条弹幕 · 频次聚合 · 三层噪声过滤（时间梗/灌水/纯语气）"
    return card("blue-card", "blue", "B站 · 热门弹幕", meta, items)


def build_ghtable(x: dict, zh: dict) -> str:
    rows = []
    for e in x["entries"]:
        desc = zh.get(e["repo"]) or e["desc"]
        if len(desc) > 80:
            desc = desc[:80] + "…"
        rows.append(
            f"          <tr><td>{e['rank']}</td>"
            f"<td class=\"gh-repo\"><a href=\"{e['url']}\">{e['repo']}</a></td>"
            f"<td>{esc(e['lang'])}</td>"
            f"<td class=\"gh-stars\"><span class=\"today\">+{e['stars_today']:,}</span></td>"
            f"<td class=\"gh-stars\"><span class=\"total\">{e['total_stars']:,}</span></td>"
            f"<td class=\"gh-desc\">{esc(desc)}</td></tr>"
        )
    body = "\n".join(rows)
    return (
        "    <div class=\"table-header\">\n"
        "      <span class=\"tag purple\">GitHub · 今日热门项目</span>\n"
        f"      <span class=\"count\">Trending 全站榜 · {x['count']} 个项目 · 按今日新增 Star 排序 · 星数经 gh API 交叉验证</span>\n"
        "    </div>\n"
        "    <div class=\"table-wrap\">\n"
        "      <table>\n"
        "        <thead>\n"
        "          <tr><th style=\"width:36px\">#</th><th>项目</th><th style=\"width:90px\">语言</th><th style=\"width:120px\">今日 Star</th><th style=\"width:90px\">总星数</th><th>简介</th></tr>\n"
        "        </thead>\n"
        "        <tbody>\n"
        f"{body}\n"
        "        </tbody>\n"
        "      </table>\n"
        "    </div>"
    )


def old_stat_lines(html_text: str) -> dict[str, str]:
    m = re.search(r"<!-- SYNC:STATS -->\n(.*?)\n    <!-- /SYNC:STATS -->", html_text, re.S)
    block = m.group(1) if m else ""
    out = {}
    for key, pat in (
        ("xhs", r'<div class="stat"><div class="num red">.*?</div></div>'),
        ("dm", r'<div class="stat"><div class="num blue">.*?</div></div>'),
        ("gh", r'<div class="stat"><div class="num purple">.*?</div></div>'),
        ("sel", r'<div class="stat"><div class="num">\d+</div><div class="label">.*?</div></div>'),
    ):
        mm = re.search(pat, block)
        if mm:
            out[key] = mm.group(0)
    return out


def build_stats(data: dict, html_text: str) -> str:
    old = old_stat_lines(html_text)
    lines = ["    <div class=\"stats\">"]

    x = data.get("xhs_today") or data.get("xhs_classic")
    if x:
        lines.append(f"      <div class=\"stat\"><div class=\"num red\">{x['total']:,}</div><div class=\"label\">小红书评论（两轮采集）</div></div>")
    elif "xhs" in old:
        lines.append("      " + old["xhs"])

    dm = data.get("danmaku")
    if dm:
        lines.append(f"      <div class=\"stat\"><div class=\"num blue\">{dm['total']:,}</div><div class=\"label\">B站弹幕（{dm['videos']} 个热门视频聚合）</div></div>")
    elif "dm" in old:
        lines.append("      " + old["dm"])

    gh = data.get("github")
    if gh:
        lines.append(f"      <div class=\"stat\"><div class=\"num purple\">{gh['count']}</div><div class=\"label\">GitHub 今日热门项目</div></div>")
    elif "gh" in old:
        lines.append("      " + old["gh"])

    xc, bc = data.get("xhs_classic"), data.get("bili_comments")
    if xc or bc:
        xs = xc["selected"] if xc else 0
        bs = bc["selected"] if bc else 0
        lines.append(f"      <div class=\"stat\"><div class=\"num\">{xs + bs}</div><div class=\"label\">今日高赞评论入选（小红书 {xs} + B站 {bs}）</div></div>")
    elif "sel" in old:
        lines.append("      " + old["sel"])

    lines.append("    </div>")
    return "\n".join(lines)


# ---------- 锚点与图表替换 ----------

def replace_anchor(text: str, name: str, content: str) -> str:
    pat = re.compile(r"(<!-- SYNC:%s -->\n)(.*?)(\n\s*<!-- /SYNC:%s -->)" % (name, name), re.S)
    m = pat.search(text)
    if not m:
        raise SystemExit(f"index.html 缺少锚点 SYNC:{name}，页面结构可能已变化，中止")
    return text[:m.start()] + m.group(1) + content + m.group(3) + text[m.end():]


def replace_array(js: str, var: str, items: list[dict]) -> str:
    body = ",\n".join("    " + json.dumps(x, ensure_ascii=False) for x in items)
    pat = re.compile(r"(var %s = \[)(.*?)(\]\.reverse\(\);)" % var, re.S)
    if not pat.search(js):
        raise SystemExit(f"charts.js 缺少数组 var {var}，中止")
    return pat.sub(lambda m: m.group(1) + "\n" + body + "\n  " + m.group(3), js, count=1)


# ---------- git / gh ----------

def run_git(*args) -> tuple[bool, str]:
    r = subprocess.run(["git", *args], cwd=REPO, capture_output=True, text=True)
    return r.returncode == 0, (r.stdout + r.stderr).strip()


def main() -> int:
    ap = argparse.ArgumentParser(description="日报自动同步 GitHub 并更新 Pages")
    ap.add_argument("--date", default=datetime.now().strftime("%Y-%m-%d"))
    ap.add_argument("--dry-run", action="store_true", help="只打印将要做的改动")
    args = ap.parse_args()

    daily_dir = ROOT / "daily" / args.date
    data = {}
    for key, fname in REPORTS.items():
        data[key] = {
            "xhs_classic": parse_xhs, "xhs_today": parse_xhs,
            "bili_comments": parse_bili_comments, "danmaku": parse_danmaku,
            "github": parse_github,
        }[key](daily_dir / fname)

    missing = [REPORTS[k] for k, v in data.items() if v is None]
    if missing:
        print(f"警告: 缺少/无法解析 {len(missing)} 份日报: {', '.join(missing)}（对应板块保持原样）")

    idx_path = REPO / "index.html"
    text = idx_path.read_text(encoding="utf-8")

    text = re.sub(r"数据日期 \d{4}-\d{2}-\d{2}", f"数据日期 {args.date}", text)
    text = re.sub(r"以下为 \d{4}-\d{2}-\d{2} 实际采集结果", f"以下为 {args.date} 实际采集结果", text)
    text = re.sub(r"\d{4}-\d{2}-\d{2} 全站榜", f"{args.date} 全站榜", text)
    if data["danmaku"]:
        text = re.sub(r"跨 \d+ 个热门视频聚合", f"跨 {data['danmaku']['videos']} 个热门视频聚合", text)

    text = replace_anchor(text, "STATS", build_stats(data, text))
    if data["xhs_classic"]:
        text = replace_anchor(text, "CARD1", build_card1(data["xhs_classic"]))
    if data["xhs_today"]:
        text = replace_anchor(text, "CARD2", build_card2(data["xhs_today"], args.date))
    if data["bili_comments"]:
        text = replace_anchor(text, "CARD3", build_card3(data["bili_comments"]))
    if data["danmaku"]:
        text = replace_anchor(text, "CARD4", build_card4(data["danmaku"]))
    if data["github"]:
        zh_path = ROOT / "gh_desc_zh.json"
        zh = json.loads(zh_path.read_text(encoding="utf-8")) if zh_path.exists() else {}
        text = replace_anchor(text, "GHTABLE", build_ghtable(data["github"], zh))

    charts_path = REPO / "assets" / "charts.js"
    js = charts_path.read_text(encoding="utf-8")

    merged = []
    if data["xhs_classic"]:
        merged += [{"name": cut(e["content"], 40), "value": e["likes"], "platform": "小红书"}
                   for e in data["xhs_classic"]["entries"]]
    if data["bili_comments"]:
        merged += [{"name": cut(e["content"], 40), "value": e["likes"], "platform": "B站"}
                   for e in data["bili_comments"]["entries"]]
    if merged:
        merged = sorted(merged, key=lambda d: -d["value"])[:10]
        js = replace_array(js, "topComments", merged)
    if data["danmaku"]:
        js = replace_array(js, "danmaku",
                           [{"name": cut(e["text"], 24), "value": e["count"]}
                            for e in data["danmaku"]["entries"][:12]])
    if data["github"]:
        gh_sorted = sorted(data["github"]["entries"], key=lambda e: -e["stars_today"])[:10]
        js = replace_array(js, "ghTrending",
                           [{"name": e["repo"], "value": e["stars_today"], "lang": e["lang"],
                             "total": f"{e['total_stars']:,}"} for e in gh_sorted])

    # ---- 汇总 ----
    parts = []
    if data["xhs_classic"]:
        parts.append(f"小红书经典 {data['xhs_classic']['selected']} 条")
    if data["xhs_today"]:
        parts.append(f"今日最新 {data['xhs_today']['selected']} 条")
    if data["bili_comments"]:
        parts.append(f"B站高赞 {data['bili_comments']['selected']} 条")
    if data["danmaku"]:
        parts.append(f"弹幕 {data['danmaku']['total']:,} 条")
    if data["github"]:
        parts.append(f"GitHub {data['github']['count']} 项目")
    summary = " / ".join(parts) if parts else "无新数据"
    print(f"[{args.date}] 同步内容: {summary}")

    if args.dry_run:
        print("dry-run 模式：不写文件、不提交、不推送")
        return 0

    idx_path.write_text(text, encoding="utf-8", newline="")
    charts_path.write_text(js, encoding="utf-8", newline="")

    # 数据文件与脚本镜像进仓库
    repo_data = REPO / "data" / args.date
    repo_data.mkdir(parents=True, exist_ok=True)
    copied = []
    for fname in REPORTS.values():
        src = daily_dir / fname
        if src.exists():
            shutil.copy2(src, repo_data / fname)
            copied.append(fname)
    for s in SCRIPTS:
        src = ROOT / s
        if src.exists():
            shutil.copy2(src, REPO / s)

    # 本地站点镜像
    if SITE_MIRROR.exists():
        (SITE_MIRROR / "hot-comments-site.html").write_text(text, encoding="utf-8", newline="")
        (SITE_MIRROR / "assets").mkdir(exist_ok=True)
        (SITE_MIRROR / "assets" / "charts.js").write_text(js, encoding="utf-8", newline="")

    ok, out = run_git("add", "-A")
    if not ok:
        print(f"git add 失败: {out}")
        return 1
    ok, status = run_git("status", "--porcelain")
    if not status.strip():
        print("仓库无变化，无需提交")
        return 0
    msg = f"数据: {args.date} 日报自动同步（{summary}）"
    ok, out = run_git("commit", "-m", msg)
    if not ok:
        print(f"git commit 失败: {out}")
        return 1
    ok, out = run_git("push", "origin", "main")
    if not ok:
        print(f"git push 失败: {out}")
        return 1
    print(f"已推送: {msg}")

    if Path(GH).exists():
        r = subprocess.run([GH, "api", f"repos/{REPO_SLUG}/pages/builds", "-X", "POST"],
                           capture_output=True, text=True)
        print("已触发 Pages 构建" if r.returncode == 0 else f"触发 Pages 构建失败（推送已成功，构建会自动排队）: {(r.stderr or '').strip()[:120]}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
