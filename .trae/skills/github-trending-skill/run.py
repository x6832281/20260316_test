#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GitHub热门项目抓取工具执行脚本
"""

import os
import sys

# 添加当前目录到Python路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from github_trending_crawler import main

if __name__ == "__main__":
    print("=== GitHub热门项目抓取工具 ===")
    print("正在执行项目抓取...")
    main()
    print("=== 抓取完成 ===")
