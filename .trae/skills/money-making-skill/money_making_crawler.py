#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
搞钱创业项目抓取工具
从多个创业信息来源抓取最新项目并生成中文总结文章
支持API接口和HTML解析双模式
"""

import os
import sys
import io
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

import time
import random
import re
import json
import requests
from datetime import datetime
from bs4 import BeautifulSoup

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
SAVE_DIR = os.path.join(PROJECT_ROOT, 'data', '搞钱项目')

if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
}

API_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Content-Type': 'application/json',
    'Connection': 'keep-alive',
}

SOURCES = [
    {'name': 'TrustMRR', 'priority': 1},
    {'name': '36氪', 'priority': 2},
    {'name': '创业邦', 'priority': 3},
    {'name': '虎嗅', 'priority': 4},
    {'name': '人人都是产品经理', 'priority': 5},
    {'name': '钛媒体', 'priority': 6},
    {'name': '掘金', 'priority': 7},
    {'name': 'i黑马', 'priority': 8},
    {'name': '鲸准', 'priority': 9},
    {'name': '投融界', 'priority': 10},
]


def fetch_page(url, headers=None):
    try:
        resp = requests.get(url, headers=headers or HEADERS, timeout=15, allow_redirects=True)
        resp.raise_for_status()
        return resp.text
    except Exception as e:
        print(f"  获取 {url} 失败: {e}")
        return None


def fetch_json(url, method='GET', json_data=None, headers=None):
    try:
        if method == 'POST':
            resp = requests.post(url, headers=headers or API_HEADERS, json=json_data, timeout=15)
        else:
            resp = requests.get(url, headers=headers or API_HEADERS, timeout=15)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        print(f"  获取API {url} 失败: {e}")
        return None


def verify_url(url):
    try:
        resp = requests.head(url, headers=HEADERS, timeout=10, allow_redirects=True)
        return resp.status_code < 400
    except:
        try:
            resp = requests.get(url, headers=HEADERS, timeout=10, allow_redirects=True)
            return resp.status_code < 400
        except:
            return False


def fetch_article_content(url):
    try:
        html = fetch_page(url)
        if not html:
            return None
        soup = BeautifulSoup(html, 'html.parser')

        for tag in soup.find_all(['script', 'style', 'nav', 'header', 'footer', 'aside']):
            tag.decompose()

        content_parts = []
        for p in soup.find_all(['p', 'h2', 'h3', 'h4', 'blockquote']):
            text = p.get_text(strip=True)
            if text and len(text) > 15:
                content_parts.append(text)

        if content_parts:
            content = '\n\n'.join(content_parts[:15])
            return content[:2000]

        article = soup.find('article') or soup.find('div', class_=re.compile(r'content|article|body|text', re.I))
        if article:
            text = article.get_text(strip=True)
            sentences = re.split(r'[。！？\n]', text)
            sentences = [s.strip() for s in sentences if len(s.strip()) > 10]
            return '\n\n'.join(sentences[:15])[:2000]

        return None
    except:
        return None


def build_url(href, base_domain):
    if not href:
        return base_domain
    if href.startswith('http'):
        return href
    if href.startswith('//'):
        return 'https:' + href
    if href.startswith('/'):
        return base_domain.rstrip('/') + href
    return base_domain.rstrip('/') + '/' + href


def deduplicate_items(items):
    seen = set()
    result = []
    for item in items:
        key = item.get('title', '')[:30]
        if key not in seen:
            seen.add(key)
            result.append(item)
    return result


# ==================== TrustMRR ====================

def fetch_trustmrr():
    items = []
    html = fetch_page('https://trustmrr.com')
    if not html:
        return items

    lines = html.split('\n')
    current_entry = {}
    entries = []

    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue

        rank_match = re.match(r'^(\d{1,2})$', line)
        if rank_match:
            if current_entry and current_entry.get('name'):
                entries.append(current_entry)
            current_entry = {'rank': int(rank_match.group(1))}
            i += 1
            continue

        if current_entry.get('rank') and not current_entry.get('name'):
            if re.match(r'^[A-Z]', line) and len(line) < 60 and 'FOR SALE' not in line and not line.startswith('$') and not re.match(r'^\d+%$', line):
                current_entry['name'] = line
                i += 1
                continue

        if current_entry.get('name') and not current_entry.get('description'):
            if len(line) > 30 and not line.startswith('$') and not re.match(r'^\d+%$', line) and 'FOR SALE' not in line:
                current_entry['description'] = line
                i += 1
                continue

        if current_entry.get('name') and not current_entry.get('revenue'):
            revenue_match = re.match(r'^\$([0-9,]+)$', line)
            if revenue_match:
                current_entry['revenue'] = revenue_match.group(1).replace(',', '')
                i += 1
                continue

        if current_entry.get('revenue') and not current_entry.get('growth'):
            growth_match = re.match(r'^(\d+)%$', line)
            if growth_match:
                current_entry['growth'] = int(growth_match.group(1))
                i += 1
                continue

        i += 1

    if current_entry and current_entry.get('name'):
        entries.append(current_entry)

    for entry in entries:
        revenue_raw = entry.get('revenue', '0')
        try:
            revenue_num = int(revenue_raw)
        except ValueError:
            revenue_num = 0

        if revenue_num >= 1000000:
            revenue_display = f"${revenue_num / 1000000:.2f}M/月"
        elif revenue_num >= 1000:
            revenue_display = f"${revenue_num / 1000:.0f}k/月"
        else:
            revenue_display = f"${revenue_num}/月"

        desc = entry.get('description', '')
        name = entry.get('name', '')

        items.append({
            'title': name,
            'summary': desc[:100] if desc else f"月收入{revenue_display}的创业项目",
            'content': desc if desc else f"{name} 是一个月收入 {revenue_display} 的创业项目。",
            'revenue': revenue_display,
            'url': 'https://trustmrr.com',
            'source': 'TrustMRR',
        })

    return items


# ==================== 36氪 ====================

def fetch_36kr():
    items = []

    html = fetch_page('https://36kr.com/information/technology/')
    if html:
        try:
            match = re.search(r'window\.initialState=(\{.*?\})\s*;?\s*</script>', html, re.DOTALL)
            if match:
                data = json.loads(match.group(1))
                item_list = data.get('information', {}).get('informationList', {}).get('itemList', [])
                for item in item_list[:10]:
                    mat = item.get('templateMaterial', {})
                    title = mat.get('widgetTitle', '')
                    summary = mat.get('summary', '')
                    route = item.get('route', '')
                    item_id = item.get('itemId', '')

                    if not title:
                        continue

                    url = 'https://36kr.com/p/' + str(item_id) if item_id else 'https://36kr.com'
                    if route and 'itemId=' in route:
                        rid = route.split('itemId=')[-1].split('&')[0]
                        url = f'https://36kr.com/p/{rid}'

                    items.append({
                        'title': title.strip(),
                        'summary': summary[:100].strip() if summary else title.strip()[:80],
                        'content': summary.strip() if summary else f"36氪报道的最新创业资讯：{title.strip()}",
                        'revenue': None,
                        'url': url,
                        'source': '36氪',
                    })
        except Exception as e:
            print(f"  解析36氪initialState失败: {e}")

    if not items:
        html = fetch_page('https://36kr.com')
        if html:
            soup = BeautifulSoup(html, 'html.parser')
            for a in soup.find_all('a', href=True):
                href = a.get('href', '')
                if '/p/' not in href:
                    continue
                title = a.get_text(strip=True)
                if not title or len(title) < 6:
                    continue
                url = build_url(href, 'https://36kr.com')
                items.append({
                    'title': title,
                    'summary': title[:80],
                    'content': f"36氪报道的最新创业资讯：{title}",
                    'revenue': None,
                    'url': url,
                    'source': '36氪',
                })
                if len(items) >= 10:
                    break

    return items


# ==================== 创业邦 ====================

def fetch_cyzone():
    items = []

    html = fetch_page('https://www.cyzone.cn')
    if not html:
        return items

    soup = BeautifulSoup(html, 'html.parser')
    seen_urls = set()

    for a in soup.find_all('a', href=True):
        href = a.get('href', '')
        if 'article' not in href:
            continue
        title = a.get_text(strip=True)
        if not title or len(title) < 6:
            continue

        url = build_url(href, 'https://www.cyzone.cn')
        url = url.replace('www.cyzone.cn/www.cyzone.cn', 'www.cyzone.cn')
        url = url.replace('www.cyzone.cn//www.cyzone.cn', 'www.cyzone.cn')

        if url in seen_urls:
            continue
        seen_urls.add(url)

        parent = a.find_parent(['div', 'article', 'li'])
        desc = ''
        if parent:
            for cls in ['desc', 'summary', 'intro', 'abstract', 'content']:
                desc_elem = parent.find(['p', 'span', 'div'], class_=re.compile(cls, re.I))
                if desc_elem:
                    desc = desc_elem.get_text(strip=True)
                    break

        items.append({
            'title': title,
            'summary': desc[:100] if desc else title[:80],
            'content': desc if desc else f"创业邦报道的最新创业项目：{title}",
            'revenue': None,
            'url': url,
            'source': '创业邦',
        })
        if len(items) >= 10:
            break

    return items


# ==================== 虎嗅 ====================

def fetch_huxiu():
    items = []

    data = fetch_json(
        'https://www.huxiu.com/article/articleList',
        method='POST',
        json_data={'platform': 'www', 'recommend': 1, 'pagesize': 15, 'page': 1},
        headers={**API_HEADERS, 'Referer': 'https://www.huxiu.com/', 'Origin': 'https://www.huxiu.com'}
    )
    if data and isinstance(data, dict):
        data_list = data.get('data', {})
        if isinstance(data_list, dict):
            data_list = data_list.get('list', data_list.get('data', []))
        if isinstance(data_list, list):
            for item in data_list[:10]:
                if isinstance(item, dict):
                    title = item.get('title', item.get('name', ''))
                    aid = item.get('aid', item.get('id', ''))
                    summary = item.get('summary', item.get('abstract', item.get('description', '')))
                    if not title:
                        continue
                    url = f'https://www.huxiu.com/article/{aid}.html' if aid else 'https://www.huxiu.com'

                    items.append({
                        'title': title.strip(),
                        'summary': summary[:100].strip() if summary else title.strip()[:80],
                        'content': summary.strip() if summary else f"虎嗅报道的最新商业资讯：{title.strip()}",
                        'revenue': None,
                        'url': url,
                        'source': '虎嗅',
                    })

    if not items:
        html = fetch_page('https://www.huxiu.com')
        if html:
            soup = BeautifulSoup(html, 'html.parser')
            for a in soup.find_all('a', href=True):
                href = a.get('href', '')
                if not re.search(r'/article/\d+', href):
                    continue
                title = a.get_text(strip=True)
                if not title or len(title) < 6:
                    continue
                url = build_url(href, 'https://www.huxiu.com')
                items.append({
                    'title': title,
                    'summary': title[:80],
                    'content': f"虎嗅报道的最新商业资讯：{title}",
                    'revenue': None,
                    'url': url,
                    'source': '虎嗅',
                })
                if len(items) >= 10:
                    break

    return items


# ==================== 人人都是产品经理 ====================

def fetch_woshipm():
    items = []

    html = fetch_page('https://www.woshipm.com')
    if not html:
        return items

    soup = BeautifulSoup(html, 'html.parser')
    seen_urls = set()

    for a in soup.find_all('a', href=True):
        href = a.get('href', '')
        if not re.search(r'/\d+\.html', href) and '/article/' not in href:
            continue
        title = a.get_text(strip=True)
        if not title or len(title) < 6:
            continue

        url = build_url(href, 'https://www.woshipm.com')
        if url in seen_urls:
            continue
        seen_urls.add(url)

        parent = a.find_parent(['div', 'article'])
        desc = ''
        if parent:
            for cls in ['desc', 'summary', 'excerpt', 'abstract']:
                desc_elem = parent.find(['p', 'span', 'div'], class_=re.compile(cls, re.I))
                if desc_elem:
                    desc = desc_elem.get_text(strip=True)
                    break

        items.append({
            'title': title,
            'summary': desc[:100] if desc else title[:80],
            'content': desc if desc else f"人人都是产品经理分享的最新经验：{title}",
            'revenue': None,
            'url': url,
            'source': '人人都是产品经理',
        })
        if len(items) >= 10:
            break

    return items


# ==================== 钛媒体 ====================

def fetch_tmtpost():
    items = []

    data = fetch_json(
        'https://www.tmtpost.com/ajax/article_list',
        headers={**API_HEADERS, 'Referer': 'https://www.tmtpost.com/'}
    )
    if data and isinstance(data, dict):
        data_list = data.get('data', [])
        if isinstance(data_list, list):
            for item in data_list[:10]:
                if isinstance(item, dict):
                    title = item.get('title', '')
                    url = item.get('url', item.get('guid', ''))
                    summary = item.get('summary', item.get('abstract', item.get('description', '')))
                    if not title:
                        continue
                    if not url or not url.startswith('http'):
                        aid = item.get('id', item.get('post_id', ''))
                        url = f'https://www.tmtpost.com/{aid}.html' if aid else 'https://www.tmtpost.com'

                    items.append({
                        'title': title.strip(),
                        'summary': summary[:100].strip() if summary else title.strip()[:80],
                        'content': summary.strip() if summary else f"钛媒体报道的最新科技商业资讯：{title.strip()}",
                        'revenue': None,
                        'url': url,
                        'source': '钛媒体',
                    })

    if not items:
        html = fetch_page('https://www.tmtpost.com')
        if html:
            soup = BeautifulSoup(html, 'html.parser')
            for a in soup.find_all('a', href=True):
                href = a.get('href', '')
                if not re.search(r'/\d+\.html', href) and '/detail/' not in href:
                    continue
                title = a.get_text(strip=True)
                if not title or len(title) < 6:
                    continue
                url = build_url(href, 'https://www.tmtpost.com')
                items.append({
                    'title': title,
                    'summary': title[:80],
                    'content': f"钛媒体报道的最新科技商业资讯：{title}",
                    'revenue': None,
                    'url': url,
                    'source': '钛媒体',
                })
                if len(items) >= 10:
                    break

    return items


# ==================== 掘金 ====================

def fetch_juejin():
    items = []

    data = fetch_json(
        'https://api.juejin.cn/recommend_api/v1/article/recommend_all_feed',
        method='POST',
        json_data={"id_type": 2, "sort_type": 200, "cursor": "0"},
        headers={**API_HEADERS, 'Referer': 'https://juejin.cn/'}
    )
    if data and isinstance(data, dict):
        articles = data.get('data', [])
        if isinstance(articles, list):
            for article in articles[:10]:
                if isinstance(article, dict):
                    item_info = article.get('item_info', article)
                    info = item_info.get('article_info', item_info)
                    title = info.get('title', '')
                    aid = info.get('article_id', '')
                    summary = info.get('brief_content', info.get('summary', ''))
                    if not title:
                        continue
                    url = f'https://juejin.cn/post/{aid}' if aid else 'https://juejin.cn'

                    items.append({
                        'title': title.strip(),
                        'summary': summary[:100].strip() if summary else title.strip()[:80],
                        'content': summary.strip() if summary else f"掘金分享的最新技术创业内容：{title.strip()}",
                        'revenue': None,
                        'url': url,
                        'source': '掘金',
                    })

    if not items:
        html = fetch_page('https://juejin.cn')
        if html:
            soup = BeautifulSoup(html, 'html.parser')
            for a in soup.find_all('a', href=True):
                href = a.get('href', '')
                if '/post/' not in href:
                    continue
                title = a.get_text(strip=True)
                if not title or len(title) < 6:
                    continue
                url = build_url(href, 'https://juejin.cn')
                items.append({
                    'title': title,
                    'summary': title[:80],
                    'content': f"掘金分享的最新技术创业内容：{title}",
                    'revenue': None,
                    'url': url,
                    'source': '掘金',
                })
                if len(items) >= 10:
                    break

    return items


# ==================== i黑马 ====================

def fetch_iheima():
    items = []

    html = fetch_page('https://www.iheima.com')
    if not html:
        return items

    soup = BeautifulSoup(html, 'html.parser')
    seen_urls = set()

    for a in soup.find_all('a', href=True):
        href = a.get('href', '')
        if not re.search(r'/\d+\.html', href) and '/article/' not in href:
            continue
        title = a.get_text(strip=True)
        if not title or len(title) < 6:
            continue

        url = build_url(href, 'https://www.iheima.com')
        if url in seen_urls:
            continue
        seen_urls.add(url)

        parent = a.find_parent(['div', 'article', 'li'])
        desc = ''
        if parent:
            for cls in ['desc', 'summary', 'abstract', 'intro']:
                desc_elem = parent.find(['p', 'span', 'div'], class_=re.compile(cls, re.I))
                if desc_elem:
                    desc = desc_elem.get_text(strip=True)
                    break

        items.append({
            'title': title,
            'summary': desc[:100] if desc else title[:80],
            'content': desc if desc else f"i黑马报道的最新创业资讯：{title}",
            'revenue': None,
            'url': url,
            'source': 'i黑马',
        })
        if len(items) >= 10:
            break

    return items


# ==================== 鲸准 ====================

def fetch_jingdata():
    items = []

    html = fetch_page('https://www.jingdata.com')
    if not html:
        return items

    soup = BeautifulSoup(html, 'html.parser')
    seen_urls = set()

    for a in soup.find_all('a', href=True):
        href = a.get('href', '')
        if not any(kw in href for kw in ['detail', 'article', 'news', 'company', 'project']):
            continue
        title = a.get_text(strip=True)
        if not title or len(title) < 6:
            continue

        url = build_url(href, 'https://www.jingdata.com')
        if url in seen_urls:
            continue
        seen_urls.add(url)

        items.append({
            'title': title,
            'summary': title[:80],
            'content': f"鲸准发布的最新投融资信息：{title}",
            'revenue': None,
            'url': url,
            'source': '鲸准',
        })
        if len(items) >= 10:
            break

    return items


# ==================== 投融界 ====================

def fetch_touzij():
    items = []

    html = fetch_page('https://www.trjcn.com')
    if not html:
        html = fetch_page('https://www.touzij.com')
    if not html:
        return items

    soup = BeautifulSoup(html, 'html.parser')
    seen_urls = set()

    for a in soup.find_all('a', href=True):
        href = a.get('href', '')
        if not any(kw in href for kw in ['detail', 'article', 'news', 'project', 'investor']):
            continue
        title = a.get_text(strip=True)
        if not title or len(title) < 6:
            continue

        base = 'https://www.trjcn.com' if 'trjcn' in href else 'https://www.touzij.com'
        url = build_url(href, base)
        if url in seen_urls:
            continue
        seen_urls.add(url)

        items.append({
            'title': title,
            'summary': title[:80],
            'content': f"投融界发布的最新项目投融资信息：{title}",
            'revenue': None,
            'url': url,
            'source': '投融界',
        })
        if len(items) >= 10:
            break

    return items


# ==================== 源调度 ====================

SOURCE_FETCHERS = {
    'TrustMRR': fetch_trustmrr,
    '36氪': fetch_36kr,
    '创业邦': fetch_cyzone,
    '虎嗅': fetch_huxiu,
    '人人都是产品经理': fetch_woshipm,
    '钛媒体': fetch_tmtpost,
    '掘金': fetch_juejin,
    'i黑马': fetch_iheima,
    '鲸准': fetch_jingdata,
    '投融界': fetch_touzij,
}


def get_fallback_data():
    return [
        {
            'title': 'Stan - 创作者经济平台',
            'summary': '帮助创作者和自由职业者建立个人品牌、销售数字产品和服务的平台',
            'content': 'Stan是一个帮助创作者实现自我雇佣的平台，提供个人品牌建立、数字产品销售、课程创建等一站式工具。该平台已有超过10万创作者使用，月收入超过350万美元，展示了创作者经济的巨大潜力。',
            'revenue': '$3.57M/月',
            'url': 'https://trustmrr.com',
            'source': 'TrustMRR',
        },
        {
            'title': 'TrimRx - 在线减肥医疗平台',
            'summary': '专注于GLP-1药物的个性化减肥方案在线问诊平台',
            'content': 'TrimRx是一家在线远程医疗公司，专注于使用GLP-1类药物（如Semaglutide）的个性化减肥方案。通过连接用户与持证医疗提供者和FDA注册药房，TrimRx已帮助全美数千客户实现减肥目标，月收入超过31万美元，月增长率19%。',
            'revenue': '$314k/月',
            'url': 'https://trustmrr.com',
            'source': 'TrustMRR',
        },
        {
            'title': 'Rezi - AI简历优化平台',
            'summary': '全球最佳简历构建器，年新增100万用户',
            'content': 'Rezi是全球最受欢迎的简历构建平台，每年新增约100万用户。其企业版服务已支持超过300家组织，包括1家财富500企业和多所大学。平台正在开发连接企业和求职者的双向匹配功能，月收入超过28万美元。',
            'revenue': '$287k/月',
            'url': 'https://trustmrr.com',
            'source': 'TrustMRR',
        },
        {
            'title': 'Postiz - AI社媒管理工具',
            'summary': '开源AI社交媒体排期发布和数据分析工具',
            'content': 'Postiz是一款AI驱动的社交媒体管理工具，支持自动排期发布、AI内容生成和数据分析。作为开源项目，它快速积累了开发者社区，付费版面向需要稳定服务的企业用户。月收入约9.7万美元，月增长率15%。',
            'revenue': '$97k/月',
            'url': 'https://trustmrr.com',
            'source': 'TrustMRR',
        },
        {
            'title': 'Cometly - 营销归因分析平台',
            'summary': '用AI分析广告投放效果的多渠道归因工具',
            'content': 'Cometly帮助SaaS公司追踪广告投放效果，用AI分析归因数据，让营销团队清楚知道每一分广告费花在哪里、带来了多少转化。平台已实现月收入21.5万美元，月增长率4%。',
            'revenue': '$215k/月',
            'url': 'https://trustmrr.com',
            'source': 'TrustMRR',
        },
        {
            'title': 'Kibu - 特殊护理管理软件',
            'summary': '专为智力与发展障碍服务机构设计的合规管理平台',
            'content': 'Kibu是一个专门为服务智力与发展障碍（I/DD）人群的机构设计的内容、合规和电子健康记录软件平台。帮助机构管理监管合规、文档记录和护理交付，覆盖数百个机构和48个州，月收入23.4万美元。',
            'revenue': '$234k/月',
            'url': 'https://trustmrr.com',
            'source': 'TrustMRR',
        },
    ]


def fetch_from_sources():
    all_items = []

    for source in SOURCES:
        source_name = source['name']
        fetcher = SOURCE_FETCHERS.get(source_name)

        if not fetcher:
            print(f"\n  未找到 {source_name} 的抓取器，跳过")
            continue

        print(f"\n尝试从 {source_name} 抓取...")
        try:
            items = fetcher()
            if items:
                print(f"  从 {source_name} 获取到 {len(items)} 条内容")
                all_items.extend(items)
            else:
                print(f"  {source_name} 未获取到有效内容")
        except Exception as e:
            print(f"  {source_name} 抓取异常: {e}")

        if len(all_items) >= 30:
            break

        time.sleep(0.5)

    return deduplicate_items(all_items)


def select_random_items(all_items, count=6):
    if len(all_items) <= count:
        return all_items
    return random.sample(all_items, count)


def extract_summary_from_content(content):
    if not content:
        return ''
    skip_prefixes = ['编者按', '本文来自', '来源：', '作者：', '编辑：', '免责声明', '原标题', '注：']
    skip_contains = ['经授权转载', '微信公众号', '本文来自', '创业邦经授权', '36氪经授权', '虎嗅经授权',
                     '栏目聚焦', '栏目关注', '本栏目', '本文为', '本文系']
    lines = content.split('\n')
    cleaned = []
    for line in lines:
        line = line.strip()
        if not line or len(line) < 8:
            continue
        if any(line.startswith(prefix) for prefix in skip_prefixes):
            continue
        if any(kw in line for kw in skip_contains):
            continue
        cleaned.append(line)
    if not cleaned:
        return content[:80]
    for line in cleaned[:5]:
        sentences = re.split(r'[。！？]', line)
        for s in sentences:
            s = s.strip()
            if len(s) >= 10 and not any(kw in s for kw in skip_contains):
                return s[:100]
    return cleaned[0][:100]


def enrich_content(item):
    url = item.get('url', '')
    source = item.get('source', '')

    need_detail = not item.get('content') or len(item.get('content', '')) < 100
    need_summary = not item.get('summary') or item['summary'] == item.get('title', '')[:80] or len(item.get('summary', '')) < 8

    if url and url not in ['https://trustmrr.com', 'https://36kr.com', 'https://www.huxiu.com']:
        if need_detail or need_summary:
            print(f"    抓取详情: {url[:60]}...")
            detail = fetch_article_content(url)
            if detail:
                if len(detail) > len(item.get('content', '')):
                    item['content'] = detail
                if need_summary:
                    item['summary'] = extract_summary_from_content(detail)

    if need_summary and not need_detail:
        item['summary'] = extract_summary_from_content(item.get('content', ''))

    return item


def verify_urls(items):
    print("\n验证链接可访问性...")
    for item in items:
        url = item.get('url', '')
        if url:
            is_accessible = verify_url(url)
            item['url_verified'] = is_accessible
            status = "✅ 可访问" if is_accessible else "❌ 无法访问"
            print(f"  {status}: {url[:70]}")
        else:
            item['url_verified'] = False
        time.sleep(0.3)


def generate_document(item):
    title = item.get('title', '未知项目')
    summary = item.get('summary', '暂无总结')
    content = item.get('content', '暂无详细内容')
    revenue = item.get('revenue', None)
    url = item.get('url', '')
    source = item.get('source', '未知来源')
    url_verified = item.get('url_verified', False)

    revenue_text = revenue if revenue else "未公开"
    verified_text = "✅ 已验证可访问" if url_verified else "⚠️ 链接可能无法访问"

    doc = f"# {title}\n\n"
    doc += f"> 数据来源：{source}\n\n"
    doc += "---\n\n"
    doc += f"## 📋 一句话总结\n\n{summary}\n\n"
    doc += "---\n\n"
    doc += f"## 💰 真实收入\n\n{revenue_text}\n\n"
    doc += "---\n\n"
    doc += f"## 📝 详细内容\n\n{content}\n\n"
    doc += "---\n\n"
    doc += f"## 🔗 原文链接\n\n[{url}]({url}) - {verified_text}\n\n"
    doc += "---\n\n"
    doc += f"*生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | © 2026 AI 萌新小窝*\n"

    return doc


def save_document(title, content):
    safe_filename = re.sub(r'[<>:"/\\|?*]', '_', title)
    safe_filename = safe_filename[:50].strip()
    filename = f"{safe_filename}.md"
    save_path = os.path.join(SAVE_DIR, filename)

    try:
        with open(save_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True, save_path
    except Exception as e:
        return False, str(e)


def clean_old_files():
    if os.path.exists(SAVE_DIR):
        old_files = [f for f in os.listdir(SAVE_DIR) if f.endswith('.md')]
        for file in old_files:
            os.remove(os.path.join(SAVE_DIR, file))
        print(f"  已清理 {len(old_files)} 个旧文件")


def main():
    print("=" * 60)
    print("开始抓取搞钱创业项目...")
    print("=" * 60)

    print("\n第一步：从各数据源抓取内容...")
    all_items = fetch_from_sources()

    if not all_items:
        print("\n所有数据源抓取失败，使用备用数据...")
        all_items = get_fallback_data()

    print(f"\n共获取到 {len(all_items)} 条内容（去重后）")

    print("\n第二步：随机选取6个项目...")
    selected = select_random_items(all_items, 6)
    print(f"  已随机选取 {len(selected)} 个项目：")
    for i, item in enumerate(selected, 1):
        print(f"  {i}. [{item.get('source', '')}] {item.get('title', '')}")

    print("\n第三步：丰富文章内容（抓取详情页）...")
    for item in selected:
        try:
            enrich_content(item)
        except Exception as e:
            print(f"    丰富内容失败: {e}")

    print("\n第四步：验证链接可访问性...")
    verify_urls(selected)

    print("\n第五步：清理旧文件...")
    clean_old_files()

    print("\n第六步：生成项目文档...")
    generated = 0
    for item in selected:
        title = item.get('title', '未知项目')
        doc_content = generate_document(item)
        success, result = save_document(title, doc_content)

        if success:
            print(f"  ✅ 生成: {title}")
            generated += 1
        else:
            print(f"  ❌ 生成失败: {title} - {result}")

    print("\n" + "=" * 60)
    print(f"完成！成功生成 {generated} 个项目文档")
    print(f"保存位置: {SAVE_DIR}")
    print("=" * 60)


if __name__ == '__main__':
    main()
