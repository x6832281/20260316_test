# -*- coding: utf-8 -*-
"""每日热门内容采集编排：小红书双模式评论 + B站热门弹幕，输出到 daily/YYYY-MM-DD/。

小红书跑两轮：
  1. 经典高赞：热度排序搜爆款笔记，抓高赞评论（含历史经典）
  2. 今日最新：时间排序搜当天新笔记，只保留近24小时评论
B站一轮：热门+排行榜视频的弹幕频次聚合。

用法:
    py -3.12 daily_run.py                    # 默认关键词"手机"
    py -3.12 daily_run.py --keywords "手机,数码"
    py -3.12 daily_run.py --skip-xhs         # 只跑B站
"""

import argparse
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path

import psutil

ROOT = Path(__file__).resolve().parent
MC_DIR = ROOT / "MediaCrawler"
XHS_CONFIG = MC_DIR / "config" / "xhs_config.py"
PY = sys.executable

# 可按需调整的采集参数
XHS_NOTE_COUNT = 20
XHS_COMMENTS_PER_NOTE = 20
CLASSIC_MIN_LIKES = 500
TODAY_MIN_LIKES = 20
TODAY_RECENT_HOURS = 24
BILI_VIDEO_COUNT = 10
BILI_MIN_COUNT = 5


def cleanup_zombie_edge() -> None:
    """清理爬虫启动的残留 Edge（只杀命令行带爬虫数据目录的，不动用户自己的浏览器）。"""
    killed = 0
    for p in psutil.process_iter(["name", "cmdline"]):
        try:
            name = (p.info["name"] or "").lower()
            if "msedge" not in name and "chrome" not in name:
                continue
            cl = " ".join(p.info["cmdline"] or [])
            if "cdp_xhs_user_data_dir" in cl:
                p.kill()
                killed += 1
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            continue
    if killed:
        print(f"已清理 {killed} 个残留浏览器进程", flush=True)


def run(cmd: list[str], cwd: Path, label: str, timeout: int = 1800) -> bool:
    print(f"\n{'=' * 50}\n[{label}] 开始: {' '.join(cmd)}\n{'=' * 50}", flush=True)
    try:
        r = subprocess.run(cmd, cwd=cwd, timeout=timeout)
        ok = r.returncode == 0
        print(f"[{label}] {'完成' if ok else '失败(退出码 %d)' % r.returncode}", flush=True)
        return ok
    except subprocess.TimeoutExpired:
        print(f"[{label}] 超时({timeout // 60}分钟)，跳过", flush=True)
        return False
    finally:
        cleanup_zombie_edge()


def set_xhs_sort(sort_type: str) -> None:
    text = XHS_CONFIG.read_text(encoding="utf-8")
    new = re.sub(r'SORT_TYPE\s*=\s*"[^"]*"', f'SORT_TYPE = "{sort_type}"', text)
    XHS_CONFIG.write_text(new, encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--keywords", default="手机", help="小红书搜索关键词，逗号分隔")
    ap.add_argument("--skip-xhs", action="store_true", help="跳过小红书采集")
    ap.add_argument("--skip-bili", action="store_true", help="跳过B站采集")
    args = ap.parse_args()

    today = datetime.now().strftime("%Y-%m-%d")
    out_dir = ROOT / "daily" / today
    out_dir.mkdir(parents=True, exist_ok=True)
    print(f"输出目录: {out_dir}")

    results = {}

    if not args.skip_xhs:
        cleanup_zombie_edge()
        for mode, sort_type, min_likes, extra in (
            ("经典高赞", "popularity_descending", CLASSIC_MIN_LIKES, []),
            ("今日最新", "time_descending", TODAY_MIN_LIKES, ["--recent-hours", str(TODAY_RECENT_HOURS)]),
        ):
            set_xhs_sort(sort_type)
            ok = run(
                [PY, "main.py", "--platform", "xhs", "--type", "search",
                 "--keywords", args.keywords,
                 "--crawler_max_notes_count", str(XHS_NOTE_COUNT),
                 "--max_comments_count_singlenotes", str(XHS_COMMENTS_PER_NOTE),
                 "--get_sub_comment", "true"],
                MC_DIR, f"小红书-{mode}",
            )
            if ok:
                run(
                    [PY, str(ROOT / "mc_comment_filter.py"),
                     "--min-likes", str(min_likes), *extra,
                     "-o", str(out_dir / f"小红书_{mode}.txt")],
                    ROOT, f"筛选-{mode}",
                )
            results[f"小红书-{mode}"] = ok

    if not args.skip_bili:
        ok = run(
            [PY, str(ROOT / "bili_danmaku.py"),
             "--video-count", str(BILI_VIDEO_COUNT),
             "--min-count", str(BILI_MIN_COUNT),
             "-o", str(out_dir / "B站_热门弹幕.txt")],
            ROOT, "B站弹幕",
        )
        results["B站弹幕"] = ok
        ok = run(
            [PY, str(ROOT / "bili_comments.py"),
             "--video-count", str(BILI_VIDEO_COUNT),
             "--min-likes", "100",
             "-o", str(out_dir / "B站_高赞评论.txt")],
            ROOT, "B站高赞评论",
        )
        results["B站高赞评论"] = ok

    print("\n" + "=" * 50)
    print("当日采集汇总")
    for k, v in results.items():
        print(f"  {k}: {'成功' if v else '失败'}")
    print(f"结果目录: {out_dir}")
    ok_all = all(results.values())
    print(f"整体状态: {'全部成功' if ok_all else '存在失败项'}")
    return 0 if ok_all else 1


if __name__ == "__main__":
    sys.exit(main())