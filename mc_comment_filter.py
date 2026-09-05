# -*- coding: utf-8 -*-
r"""从 MediaCrawler 的小红书 jsonl 数据中筛选高赞评论，输出 TXT 日报。

用法:
    py mc_comment_filter.py --min-likes 500 --top-n 100 -o 高赞评论.txt
    py mc_comment_filter.py --comments 路径\search_comments_2026-09-05.jsonl --min-likes 1000
"""

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path

MC_DIR = Path(__file__).resolve().parent / "MediaCrawler"
DATA_DIR = MC_DIR / "data" / "xhs" / "jsonl"


def parse_count(value) -> int:
    """把 '8313' / '1.2万' / 1380 / '6.8万' 统一转成整数。"""
    if value is None:
        return 0
    s = str(value).strip().replace(",", "")
    if not s:
        return 0
    try:
        if s.endswith("万"):
            return int(float(s[:-1]) * 10000)
        if s.endswith("亿"):
            return int(float(s[:-1]) * 100000000)
        return int(float(s))
    except ValueError:
        return 0


def latest_file(pattern: str) -> Path | None:
    files = sorted(DATA_DIR.glob(pattern))
    return files[-1] if files else None


def load_jsonl(path: Path) -> list[dict]:
    items = []
    for line in path.read_text(encoding="utf-8").strip().splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            items.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    return items


def format_time(value) -> str:
    ts = parse_count(value)
    if ts <= 0:
        return ""
    if ts > 10**12:  # 毫秒时间戳
        ts //= 1000
    try:
        return datetime.fromtimestamp(ts).strftime("%Y-%m-%d %H:%M")
    except (OSError, ValueError):
        return ""


def main() -> int:
    ap = argparse.ArgumentParser(description="筛选 MediaCrawler 小红书高赞评论")
    ap.add_argument("--comments", help="评论 jsonl 路径，默认取 MediaCrawler 最新一天")
    ap.add_argument("--contents", help="笔记 jsonl 路径，默认自动匹配同日期文件")
    ap.add_argument("--min-likes", type=int, default=100, help="最低点赞数，默认 100")
    ap.add_argument("--recent-hours", type=int, default=0, help="只保留近 N 小时内发布的评论，0 为不过滤")
    ap.add_argument("--top-n", type=int, default=100, help="最多输出条数，0 为不限")
    ap.add_argument("-o", "--output", default=None, help="输出 TXT 路径")
    args = ap.parse_args()

    comments_path = Path(args.comments) if args.comments else latest_file("search_comments_*.jsonl")
    if not comments_path or not comments_path.exists():
        print("未找到评论 jsonl 文件，请先运行 MediaCrawler 采集，或用 --comments 指定路径")
        return 1

    if args.contents:
        contents_path = Path(args.contents)
    else:
        stem_date = comments_path.stem.replace("search_comments_", "")
        candidate = DATA_DIR / f"search_contents_{stem_date}.jsonl"
        contents_path = candidate if candidate.exists() else None

    comments = load_jsonl(comments_path)
    notes = load_jsonl(contents_path) if contents_path else []
    note_map = {n.get("note_id"): n for n in notes}

    cutoff = datetime.now().timestamp() - args.recent_hours * 3600 if args.recent_hours > 0 else None

    seen: set[str] = set()
    records = []
    for c in comments:
        cid = str(c.get("comment_id", ""))
        if not cid or cid in seen:
            continue
        seen.add(cid)
        if cutoff is not None and parse_count(c.get("create_time")) > 10**12:
            ts = parse_count(c.get("create_time")) // 1000
        else:
            ts = parse_count(c.get("create_time"))
        if cutoff is not None and (ts <= 0 or ts < cutoff):
            continue
        likes = parse_count(c.get("like_count"))
        if likes < args.min_likes:
            continue
        note = note_map.get(c.get("note_id"), {})
        records.append({
            "likes": likes,
            "content": str(c.get("content", "")).strip(),
            "nickname": str(c.get("nickname", "")).strip(),
            "time": format_time(c.get("create_time")),
            "note_title": str(note.get("title", "")).strip(),
            "note_likes": note.get("liked_count", ""),
            "keyword": str(note.get("source_keyword", "")).strip(),
            "note_url": str(note.get("note_url", "")).strip(),
            "sub_count": c.get("sub_comment_count", 0),
        })

    records.sort(key=lambda r: r["likes"], reverse=True)
    if args.top_n > 0:
        records = records[: args.top_n]

    total = len(comments)
    out_path = Path(args.output) if args.output else comments_path.parent.parent.parent.parent / "高赞评论.txt"
    out_path = out_path.resolve()

    lines = []
    lines.append("=" * 60)
    lines.append("小红书高赞评论日报")
    lines.append(f"数据文件: {comments_path.name}")
    lines.append(f"笔记文件: {contents_path.name if contents_path else '未找到(无笔记标题信息)'}")
    lines.append(f"评论总数: {total} (去重后入选 {len(records)} 条, 最低 {args.min_likes} 赞)")
    if args.recent_hours > 0:
        lines.append(f"时间过滤: 仅保留近 {args.recent_hours} 小时内发布的评论")
    lines.append(f"生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    lines.append("=" * 60)
    lines.append("")

    keywords = {}
    for r in records:
        keywords[r["keyword"]] = keywords.get(r["keyword"], 0) + 1
    if any(keywords):
        lines.append("关键词分布: " + ", ".join(f"{k}({v}条)" for k, v in keywords.items() if k))
        lines.append("")

    for i, r in enumerate(records, 1):
        lines.append(f"#{i}  [{r['likes']} 赞]  {r['nickname']}  {r['time']}")
        lines.append(f"    {r['content']}")
        if r["note_title"]:
            lines.append(f"    ↳ 笔记: {r['note_title']} (笔记点赞 {r['note_likes']})")
        if r["sub_count"]:
            lines.append(f"    ↳ 回复数: {r['sub_count']}")
        if r["note_url"]:
            lines.append(f"    ↳ 链接: {r['note_url']}")
        lines.append("")

    out_path.write_text("\n".join(lines), encoding="utf-8-sig")
    print(f"输入: {comments_path}")
    print(f"评论总数 {total} | 入选 {len(records)} 条 (>= {args.min_likes} 赞)")
    print(f"输出: {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())