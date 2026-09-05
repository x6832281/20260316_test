# -*- coding: utf-8 -*-
"""B站热门视频弹幕采集：热门/排行榜视频 → 弹幕 → 频次聚合 → TXT 日报。"""

import argparse
import gzip
import re
import sys
import time
import xml.etree.ElementTree as ET
from collections import Counter
from datetime import datetime
from pathlib import Path

import httpx

TIME_NOISE = re.compile(r"^(刚刚|现在|刚来|才来)[!！。.]*$|^[\d一二两三四五六七八九十半几\.]+\s*个?\s*(秒|分钟|小时|钟头|天|日|周|月|年)\s*[前以]*[!！。.+＋]*$")
COUNT_NOISE = re.compile(r"^[\d.,]+\s*万?\s*人?\s*(出来|出来蹲|整|楼|层|位|报名|签到)?[+＋!！。.]*$")
LAUGH_NOISE = re.compile(r"^[哈啊嘿嘻吼嗨]{2,}[！!。.~～]*$")
EMOTE_NOISE = re.compile(r"^\[[^\]]*\]$")
INTERJECT_NOISE = re.compile(r"^(哦|噢|喔|耶|咦|呃|额|唉|嗯|呵|卧槽|我靠|牛逼|nb|卧去)[!！。.~～\s]*$", re.IGNORECASE)
PLACEHOLDER = {"空瓶", "空屏", "占领空瓶", "占领空屏", "请输入文本", "有人吗", "有人吗？", "有", "在吗", "来了", "1", "2", ".", "？", "？?", "。。。", "...", "!"}


def is_noise(text: str) -> bool:
    t = text.strip()
    if len(t) < 2 or t in PLACEHOLDER:
        return True
    if t.isdigit():
        return True
    if TIME_NOISE.match(t) or LAUGH_NOISE.match(t) or EMOTE_NOISE.match(t):
        return True
    if COUNT_NOISE.match(t) or INTERJECT_NOISE.match(t):
        return True
    if not re.search(r"[\u4e00-\u9fff a-zA-Z]", t):
        return True
    return False


def count_key(text: str) -> str:
    """纯拉丁文本统一小写聚合（NB/nb/Nb 算同一条）。"""
    if re.fullmatch(r"[a-zA-Z0-9\s!?.。,，]+", text):
        return text.lower()
    return text

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
                "bvid": bvid,
                "cid": v.get("cid"),
                "title": v.get("title", ""),
                "up": v.get("owner", {}).get("name", ""),
                "view": stat.get("view", 0),
                "danmaku": stat.get("danmaku", 0),
                "source": source,
            })
            if len(videos) >= limit:
                return videos
    return videos


def get_cid(client: httpx.Client, bvid: str) -> int | None:
    # 热门/排行榜响应已带 cid，此函数仅作兜底；view 接口和视频页均有 412 风控，不用
    try:
        d = client.get("https://api.bilibili.com/x/player/pagelist", params={"bvid": bvid}).json()
        if d.get("code") == 0 and d.get("data"):
            return int(d["data"][0]["cid"])
    except Exception:
        pass
    return None


def fetch_danmaku(client: httpx.Client, cid: int) -> list[dict]:
    for url in (f"https://comment.bilibili.com/{cid}.xml",
                f"https://api.bilibili.com/x/v1/dm/list.so?oid={cid}"):
        try:
            r = client.get(url)
            if r.status_code != 200:
                continue
            body = r.content
            try:
                body = gzip.decompress(body)
            except Exception:
                pass
            root = ET.fromstring(body)
            items = []
            for d in root.iter("d"):
                p = (d.get("p") or "").split(",")
                if len(p) < 5:
                    continue
                text = (d.text or "").strip()
                if not text:
                    continue
                items.append({"text": text, "ctime": int(float(p[4]))})
            if items:
                return items
        except Exception:
            continue
    return []


def main() -> int:
    ap = argparse.ArgumentParser(description="B站热门视频弹幕采集")
    ap.add_argument("--video-count", type=int, default=10, help="采集热门视频数，默认 10")
    ap.add_argument("--min-count", type=int, default=5, help="弹幕最少出现次数，默认 5")
    ap.add_argument("--per-video-top", type=int, default=10, help="每个视频最多展示弹幕条数")
    ap.add_argument("--global-top", type=int, default=50, help="全局热榜最多条数")
    ap.add_argument("--recent-hours", type=int, default=0, help="仅统计近 N 小时发送的弹幕，0 为不限")
    ap.add_argument("-o", "--output", default=None, help="输出 TXT 路径")
    args = ap.parse_args()

    client = make_client()
    videos = fetch_hot_videos(client, args.video_count)
    if not videos:
        print("未获取到热门视频列表")
        return 1
    print(f"热门视频 {len(videos)} 个，开始采集弹幕...")

    cutoff = time.time() - args.recent_hours * 3600 if args.recent_hours > 0 else None
    global_counter: Counter[str] = Counter()
    video_results = []
    for i, v in enumerate(videos, 1):
        cid = v.get("cid") or get_cid(client, v["bvid"])
        if not cid:
            print(f"[{i}/{len(videos)}] {v['title'][:30]} - 取cid失败，跳过")
            continue
        danmakus = fetch_danmaku(client, cid)
        if cutoff is not None:
            danmakus = [d for d in danmakus if d["ctime"] >= cutoff]
        counter = Counter(count_key(d["text"]) for d in danmakus if not is_noise(d["text"]))
        global_counter.update(counter)
        top = [(t, n) for t, n in counter.most_common() if n >= args.min_count][: args.per_video_top]
        video_results.append({**v, "cid": cid, "fetched": len(danmakus), "top": top})
        print(f"[{i}/{len(videos)}] {v['title'][:36]} | 弹幕{len(danmakus)}条 | 热门弹幕{len(top)}条")
        time.sleep(1)

    # 全局热榜已由 global_counter.update 汇总完成

    out_path = Path(args.output) if args.output else Path.cwd() / f"B站热门弹幕_{datetime.now().strftime('%Y-%m-%d')}.txt"
    lines = []
    lines.append("=" * 60)
    lines.append("B站热门视频弹幕日报")
    lines.append(f"视频数: {len(video_results)} | 生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    if args.recent_hours > 0:
        lines.append(f"时间过滤: 仅统计近 {args.recent_hours} 小时内发送的弹幕")
    lines.append("=" * 60)
    lines.append("")

    lines.append("【全局热门弹幕 TOP】")
    for i, (text, n) in enumerate(global_counter.most_common(args.global_top), 1):
        lines.append(f"#{i}  [{n} 次]  {text}")
    lines.append("")

    for vr in video_results:
        lines.append("-" * 60)
        lines.append(f"《{vr['title']}》")
        lines.append(f"UP: {vr['up']} | 播放 {vr['view']} | 弹幕总量 {vr['danmaku']} | 采集到 {vr['fetched']} 条")
        lines.append(f"链接: https://www.bilibili.com/video/{vr['bvid']}  (来源: {vr['source']})")
        for text, n in vr["top"]:
            lines.append(f"    [{n} 次]  {text}")
        lines.append("")

    out_path.write_text("\n".join(lines), encoding="utf-8-sig")
    print(f"\n输出: {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())