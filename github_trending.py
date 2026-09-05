# -*- coding: utf-8 -*-
"""GitHub Trending 热门项目采集：抓取 trending 页面 → 解析项目/简介/星数 → TXT 日报。

GitHub 没有官方 Trending API，直接解析页面 HTML（公开可访问，无需登录）。
"""

import argparse
import re
import sys
from datetime import datetime
from pathlib import Path

import httpx

try:
    import truststore
    truststore.inject_into_ssl()
except ImportError:
    pass

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    "Accept": "text/html",
}

TRENDING_URL = "https://github.com/trending"


def parse_int(s: str) -> int:
    s = s.strip().replace(",", "")
    return int(s) if s.isdigit() else 0


def strip_tags(html: str) -> str:
    return re.sub(r"<[^>]+>", "", html).strip()


def fetch_trending(client: httpx.Client, since: str, language: str) -> list[dict]:
    params = {"since": since}
    if language:
        url = f"{TRENDING_URL}/{language}"
    else:
        url = TRENDING_URL
    r = client.get(url, params=params)
    r.raise_for_status()
    html = r.text

    repos = []
    blocks = re.split(r'<article class="Box-row', html)[1:]
    for b in blocks:
        m = re.search(r'href="/([^"]+)"/?\s*[^>]*class="Link', b) or re.search(r'href="/([^"]+)"[^>]*>\s*<svg', b)
        if not m:
            # 兜底：取 h2 内的第一个 /owner/repo 链接
            m = re.search(r'<h2[^>]*>.*?href="/([^"]+)"', b, re.S)
        if not m:
            continue
        full_name = m.group(1).strip().strip("/")

        d = re.search(r'<p class="col-9[^"]*">\s*(.*?)\s*</p>', b, re.S)
        desc = strip_tags(d.group(1)) if d else ""

        lang = re.search(r'itemprop="programmingLanguage">([^<]+)<', b)
        lang_text = lang.group(1).strip() if lang else ""

        stars = re.search(r'/stargazers"[^>]*>.*?</svg>\s*([\d,]+)', b, re.S)
        total_stars = parse_int(stars.group(1)) if stars else 0

        today = re.search(r'([\d,]+)\s*stars today', b)
        stars_today = parse_int(today.group(1)) if today else 0

        forks = re.search(r'/forks"[^>]*>.*?</svg>\s*([\d,]+)', b, re.S)
        total_forks = parse_int(forks.group(1)) if forks else 0

        repos.append({
            "full_name": full_name,
            "url": f"https://github.com/{full_name}",
            "desc": desc,
            "language": lang_text,
            "total_stars": total_stars,
            "stars_today": stars_today,
            "forks": total_forks,
        })
    return repos


def main() -> int:
    ap = argparse.ArgumentParser(description="GitHub Trending 热门项目采集")
    ap.add_argument("--since", choices=["daily", "weekly", "monthly"], default="daily", help="时间范围，默认 daily")
    ap.add_argument("--language", default="", help="按语言过滤，如 python / javascript，默认全部")
    ap.add_argument("--count", type=int, default=25, help="最多展示条数，默认 25")
    ap.add_argument("-o", "--output", default=None, help="输出 TXT 路径")
    args = ap.parse_args()

    client = httpx.Client(headers=HEADERS, timeout=30, follow_redirects=True)
    try:
        repos = fetch_trending(client, args.since, args.language)
    except Exception as e:
        print(f"抓取失败: {e}")
        return 1

    if not repos:
        print("未解析到任何项目，页面结构可能已变化")
        return 1

    repos = repos[: args.count]
    label = {"daily": "今日", "weekly": "本周", "monthly": "本月"}[args.since]
    title_suffix = f"（语言: {args.language}）" if args.language else ""

    out_path = Path(args.output) if args.output else Path.cwd() / f"GitHub热门项目_{datetime.now().strftime('%Y-%m-%d')}.txt"
    lines = []
    lines.append("=" * 60)
    lines.append(f"GitHub Trending {label}热门项目")
    lines.append(f"项目数: {len(repos)}{title_suffix} | 生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    lines.append("=" * 60)
    lines.append("")

    for i, r in enumerate(repos, 1):
        lines.append(f"#{i}  {r['full_name']}")
        lines.append(f"    今日 +{r['stars_today']} 星 | 总星 {r['total_stars']:,} | Fork {r['forks']:,}" + (f" | {r['language']}" if r['language'] else ""))
        if r["desc"]:
            lines.append(f"    简介: {r['desc']}")
        lines.append(f"    链接: {r['url']}")
        lines.append("")

    out_path.write_text("\n".join(lines), encoding="utf-8-sig")
    print(f"{label}热门项目 {len(repos)} 个")
    print(f"输出: {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
