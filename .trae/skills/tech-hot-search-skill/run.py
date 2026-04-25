#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
科技热搜抓取工具执行脚本
"""

import os
import sys

# 添加当前目录到Python路径
sys.path.insert(0, os.path.dirname(__file__))

from hot_search_crawler import main

if __name__ == "__main__":
    print("=== 科技热搜抓取工具 ===")
    print("正在执行热搜抓取...")
    main()
    print("=== 抓取完成 ===")
