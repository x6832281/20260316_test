# -*- coding: utf-8 -*-
"""B站热门视频高赞评论采集：热门/排行榜视频 → 评论区(带点赞数) → 按赞数筛选 → TXT 日报。"""

import argparse
import sys
import time
from datetime import datetime
from pathlib import Path

import httpx

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Referer": "https://www.bilibili.com/",
}


def make_client() -> httpx.Client:
    client = httpx.Client(headers=HEADERS, timeout=20, follow_redirects=True)
    try:
        r = client.get("https://api.bilibili.com/x/frontend/finger/spi")
        d = r.json()
        client.cookies.set("buvid3", d["data"]["b_3"], domain=".bilibili.com")
        client.cookies.set("buvid4", d["data"]["b_4"], domain=".bilibili.com")
    except Exception:
        pass
    return client


def fetch_hot_videos(client: httpx.Client, limit: int) -> list[dict]:
    videos: list[dict] = []
    seen: set[str] = set()
    for url, params, source in (
        ("https://api.bilibili.com/x/web-interface/popular", {"ps": 20, "pn": 1}, "热门"),
        ("https://api.bilibili.com/x/web-interface/popular", {"ps": 20, "pn": 2}, "热门"),
        ("https://api.bilibili.com/x/web-interface/ranking/v2", {"rid": 0, "type": "all"}, "排行榜"),
    ):
        try:
            d = client.get(url, params=params).json()
        except Exception:
            continue
        if d.get("code") != 0:
            continue
        for v in d.get("data", {}).get("list", []):
            bvid = v.get("bvid", "")
            if not bvid or bvid in seen:
                continue
            seen.add(bvid)
            stat = v.get("stat", {})
            videos.append({
                "aid": v.get("aid"),
                "bvid": bvid,
                "title": v.get("title", ""),
                "up": v.get("owner", {}).get("name", ""),
                "view": stat.get("view", 0),
                "reply": stat.get("reply", 0),
                "source": source,
            })
            if len(videos) >= limit:
                return videos
    return videos


def fetch_comments(client: httpx.Client, aid: int, pages: int) -> list[dict]:
    """按热度取评论区前 pages 页（每页20条，热评优先）。"""
    items = []
    for pn in range(1, pages + 1):
        try:
            d = client.get("https://api.bilibili.com/x/v2/reply",
                           params={"pn": pn, "type": 1, "oid": aid, "sort": 2}).json()
        except Exception:
            break
        if d.get("code") != 0:
            break
        replies = (d.get("data") or {}).get("replies") or []
        if not replies:
            break
        for rep in replies:
            items.append({
                "rpid": rep.get("rpid"),
                "content": (rep.get("content") or {}).get("message", "").strip(),
                "likes": rep.get("like", 0),
                "uname": (rep.get("member") or {}).get("uname", ""),
                "ctime": rep.get("ctime", 0),
                "rcount": rep.get("rcount", 0),
            })
        time.sleep(0.5)
    return items


def format_time(ts: int) -> str:
    try:
        return datetime.fromtimestamp(ts).strftime("%Y-%m-%d %H:%M")
    except (OSError, ValueError):
        return ""


def main() -> int:
    ap = argparse.ArgumentParser(description="B站热门视频高赞评论采集")
    ap.add_argument("--video-count", type=int, default=10, help="采集热门视频数，默认 10")
    ap.add_argument("--pages", type=int, default=2, help="每个视频取评论页数(每页20条热评)，默认 2")
    ap.add_argument("--min-likes", type=int, default=100, help="最低点赞数，默认 100")
    ap.add_argument("--top-n", type=int, default=50, help="全局榜最多条数")
    ap.add_argument("--recent-hours", type=int, default=0, help="仅保留近 N 小时发布的评论，0 为不限")
    ap.add_argument("-o", "--output", default=None, help="输出 TXT 路径")
    args = ap.parse_args()

    client = make_client()
    videos = fetch_hot_videos(client, args.video_count)
    if not videos:
        print("未获取到热门视频列表")
        return 1
    print(f"热门视频 {len(videos)} 个，开始采集评论...")

    cutoff = time.time() - args.recent_hours * 3600 if args.recent_hours > 0 else None
    all_comments: list[dict] = []
    video_results = []
    for i, v in enumerate(videos, 1):
        if not v.get("aid"):
            continue
        comments = fetch_comments(client, v["aid"], args.pages)
        if cutoff is not None:
            comments = [c for c in comments if c["ctime"] >= cutoff]
        hot = [c for c in comments if c["likes"] >= args.min_likes]
        hot.sort(key=lambda c: c["likes"], reverse=True)
        for c in hot:
            c["video"] = v
        all_comments.extend(hot)
        video_results.append({**v, "fetched": len(comments), "hot": len(hot), "top": hot[:5]})
        print(f"[{i}/{len(videos)}] {v['title'][:36]} | 评论{len(comments)}条 | 高赞{len(hot)}条")
        time.sleep(1)

    all_comments.sort(key=lambda c: c["likes"], reverse=True)
    seen: set[int] = set()
    unique: list[dict] = []
    for c in all_comments:
        if c["rpid"] in seen:
            continue
        seen.add(c["rpid"])
        unique.append(c)
    top_global = unique[: args.top_n]

    out_path = Path(args.output) if args.output else Path.cwd() / f"B站高赞评论_{datetime.now().strftime('%Y-%m-%d')}.txt"
    lines = []
    lines.append("=" * 60)
    lines.append("B站热门视频高赞评论日报")
    lines.append(f"视频数: {len(video_results)} | 生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    lines.append(f"高赞标准: >= {args.min_likes} 赞 | 全局榜 {len(top_global)} 条")
    if args.recent_hours > 0:
        lines.append(f"时间过滤: 仅保留近 {args.recent_hours} 小时内发布的评论")
    lines.append("=" * 60)
    lines.append("")

    lines.append("【全局高赞评论 TOP】")
    for i, c in enumerate(top_global, 1):
        lines.append(f"#{i}  [{c['likes']} 赞]  {c['uname']}  {format_time(c['ctime'])}")
        lines.append(f"    {c['content']}")
        lines.append(f"    ↳ 视频: 《{c['video']['title']}》 播放{c['video']['view']}")
        if c["rcount"]:
            lines.append(f"    ↳ 回复数: {c['rcount']}")
        lines.append(f"    ↳ 链接: https://www.bilibili.com/video/{c['video']['bvid']}")
        lines.append("")

    for vr in video_results:
        if not vr["top"]:
            continue
        lines.append("-" * 60)
        lines.append(f"《{vr['title']}》")
        lines.append(f"UP: {vr['up']} | 播放 {vr['view']} | 评论总量 {vr['reply']} | 采集 {vr['fetched']} 条其中高赞 {vr['hot']} 条")
        lines.append(f"链接: https://www.bilibili.com/video/{vr['bvid']}  (来源: {vr['source']})")
        for c in vr["top"]:
            lines.append(f"    [{c['likes']} 赞]  {c['uname']}: {c['content'][:80]}")
        lines.append("")

    out_path.write_text("\n".join(lines), encoding="utf-8-sig")
    print(f"\n输出: {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())