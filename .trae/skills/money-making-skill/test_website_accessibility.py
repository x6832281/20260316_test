#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试网站在中国大陆的可访问性
"""

import requests
import time

# 要测试的网站
WEBSITES = {
    'trustmrr': 'https://trustmrr.com',
    'indiehackers': 'https://indiehackers.com',
    'itjuzi': 'https://www.itjuzi.com',
    '36kr': 'https://36kr.com'
}

def test_website_accessibility(url, timeout=10):
    """测试网站是否可访问"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        start_time = time.time()
        response = requests.get(url, headers=headers, timeout=timeout)
        end_time = time.time()
        response_time = end_time - start_time
        
        if response.status_code == 200:
            return True, f"可访问 (响应时间: {response_time:.2f}s)"
        else:
            return False, f"不可访问 (状态码: {response.status_code})"
    except requests.RequestException as e:
        return False, f"不可访问 (错误: {str(e)})"

def main():
    """主函数"""
    print("=== 测试网站在中国大陆的可访问性 ===")
    print()
    
    for name, url in WEBSITES.items():
        print(f"测试 {name}: {url}")
        is_accessible, message = test_website_accessibility(url)
        status = "[可访问]" if is_accessible else "[不可访问]"
        print(f"{status} {message}")
        print()
        time.sleep(2)  # 添加延迟，避免被限流
    
    print("=== 测试完成 ===")

if __name__ == "__main__":
    main()
