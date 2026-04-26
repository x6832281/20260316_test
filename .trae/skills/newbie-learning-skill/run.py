#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
萌新学习内容生成工具执行脚本
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from newbie_learning_crawler import main

if __name__ == "__main__":
    print("=== 萌新学习内容生成工具 ===")
    print("正在生成学习文档...")
    main()
    print("=== 生成完成 ===")
