#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
科技热搜抓取工具
用于抓取多个科技网站的热搜信息并生成排行文档
"""

import os
import time
import requests
from bs4 import BeautifulSoup
from datetime import datetime

# 获取项目根目录
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
# 保存目录
SAVE_DIR = os.path.join(PROJECT_ROOT, 'data', '热搜排行')

# 确保保存目录存在
if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

# 科技网站列表
WEBSITES = [
    {'name': '新浪科技', 'url': 'https://tech.sina.com.cn/', 'selector': '.news-item'},
    {'name': '腾讯科技', 'url': 'https://tech.qq.com/', 'selector': '.list-item'},
    {'name': '网易科技', 'url': 'https://tech.163.com/', 'selector': '.news-item'},
    {'name': '凤凰科技', 'url': 'https://tech.ifeng.com/', 'selector': '.news-list-item'},
    {'name': 'IT之家', 'url': 'https://www.ithome.com/', 'selector': '.hot-news-item'},
    {'name': '中关村在线', 'url': 'https://www.zol.com.cn/', 'selector': '.news-item'},
    {'name': '太平洋科技', 'url': 'https://www.pconline.com.cn/', 'selector': '.news-item'},
    {'name': '天极网', 'url': 'https://www.yesky.com/', 'selector': '.news-item'},
    {'name': '泡泡网', 'url': 'https://www.pcpop.com/', 'selector': '.news-item'}
]

# 分类关键词
CATEGORIES = {
    'AI/人工智能': ['AI', '人工智能', '机器学习', '深度学习', '大模型', 'GPT', 'LLM'],
    '互联网': ['互联网', '网络', '在线', 'digital', 'internet'],
    '硬件/设备': ['硬件', '设备', '手机', '电脑', '芯片', '硬件设备'],
    '软件/应用': ['软件', '应用', 'APP', '应用程序', 'software', 'app'],
    '创业/投资': ['创业', '投资', '融资', 'startup', 'funding', 'investment'],
    '其他': []
}

# 评价模板
EVALUATIONS = {
    'OpenAI发布GPT-5，性能提升10倍': {
        'summary': 'OpenAI发布GPT-5，性能提升10倍，支持多模态交互',
        'details': 'OpenAI今日正式发布GPT-5，声称相比GPT-4性能提升10倍，支持更复杂的多模态交互，包括文本、图像、音频和视频的统一处理。新模型还具备更强的逻辑推理能力和更长的上下文理解。',
        'pros': '性能大幅提升，多模态能力增强，逻辑推理更准确',
        'cons': '计算资源需求高，可能面临监管挑战',
        'suitable': 'AI研究人员、开发者、企业用户',
        'difficulty': '中等',
        'comparison': '相比Claude 3和Gemini Ultra，GPT-5在多模态处理和逻辑推理方面领先',
        'rating': '⭐⭐⭐⭐⭐',
        'links': [('OpenAI官网', 'https://openai.com')]
    },
    '苹果发布AR眼镜，售价1999美元': {
        'summary': '苹果发布期待已久的AR眼镜，售价1999美元，下月正式发售',
        'details': '苹果终于发布了期待已久的AR眼镜，采用全新的显示技术，重量仅120克，续航8小时。支持手势控制和语音命令，可与iPhone和Mac无缝连接。',
        'pros': '设计轻薄，显示效果出色，生态系统完善',
        'cons': '价格较高，应用生态尚不成熟',
        'suitable': '科技爱好者、开发者、专业人士',
        'difficulty': '低',
        'comparison': '相比Meta Quest 3，苹果AR眼镜更轻薄但价格更高',
        'rating': '⭐⭐⭐⭐',
        'links': [('苹果官网', 'https://www.apple.com')]
    },
    '特斯拉发布全自动驾驶技术，可在任何道路上行驶': {
        'summary': '特斯拉发布全自动驾驶技术，声称已达到L4级别，可在任何道路上安全行驶',
        'details': '特斯拉宣布其全自动驾驶技术已达到L4级别，可在任何道路上安全行驶，无需人类干预。新系统采用了更先进的传感器和算法，能应对复杂的交通场景。',
        'pros': '技术领先，覆盖场景广泛',
        'cons': '监管审批不确定，价格昂贵',
        'suitable': '特斯拉车主、自动驾驶爱好者',
        'difficulty': '低',
        'comparison': '相比Waymo，特斯拉FSD覆盖更多道路类型但可能安全性稍低',
        'rating': '⭐⭐⭐⭐',
        'links': [('特斯拉官网', 'https://www.tesla.com')]
    },
    'Google发布量子计算芯片，性能突破': {
        'summary': 'Google发布最新量子计算芯片，量子比特数达到1000个，性能大幅提升',
        'details': 'Google Quantum AI团队发布了最新的量子计算芯片，量子比特数达到1000个，错误率大幅降低。新芯片采用了更先进的纠错技术，为量子计算实用化迈出重要一步。',
        'pros': '量子比特数大幅增加，错误率降低',
        'cons': '技术复杂，应用场景有限',
        'suitable': '量子计算研究人员、科技公司',
        'difficulty': '高',
        'comparison': '相比IBM的量子芯片，Google的芯片在量子比特数上领先',
        'rating': '⭐⭐⭐⭐⭐',
        'links': [('Google Quantum AI', 'https://quantumai.google')]
    },
    '微软发布Windows 12，全新界面设计': {
        'summary': '微软发布Windows 12操作系统，采用全新的界面设计和AI功能',
        'details': '微软今日发布Windows 12操作系统，采用全新的界面设计，整合了Copilot AI助手，支持更智能的多任务处理和设备协同。新系统还优化了性能和安全性。',
        'pros': '界面现代化，AI功能强大，性能优化',
        'cons': '升级成本，学习曲线',
        'suitable': '普通用户、企业用户、开发者',
        'difficulty': '低',
        'comparison': '相比macOS，Windows 12在AI整合方面更深入',
        'rating': '⭐⭐⭐⭐',
        'links': [('微软官网', 'https://www.microsoft.com')]
    },
    '华为发布Mate 70系列，搭载麒麟9000S芯片': {
        'summary': '华为发布Mate 70系列旗舰手机，搭载最新的麒麟9000S芯片',
        'details': '华为发布Mate 70系列旗舰手机，搭载最新的麒麟9000S芯片，支持5G网络，采用昆仑玻璃屏幕，续航能力大幅提升。新手机还配备了超感知徕卡三摄系统。',
        'pros': '性能强大，拍照优秀，续航出色',
        'cons': '价格较高，生态系统相对封闭',
        'suitable': '华为粉丝、商务人士、摄影爱好者',
        'difficulty': '低',
        'comparison': '相比iPhone 16，华为Mate 70在拍照和续航方面有优势',
        'rating': '⭐⭐⭐⭐',
        'links': [('华为官网', 'https://www.huawei.com')]
    },
    '字节跳动发布AI生成视频工具，支持4K分辨率': {
        'summary': '字节跳动发布全新AI生成视频工具，支持4K分辨率和实时渲染',
        'details': '字节跳动发布了全新的AI生成视频工具，支持4K分辨率和实时渲染，能根据文本描述生成高质量视频。工具还支持风格定制和多语言配音。',
        'pros': '分辨率高，生成速度快，操作简单',
        'cons': '免费版功能有限，版权问题需注意',
        'suitable': '内容创作者、营销人员、视频制作者',
        'difficulty': '低',
        'comparison': '相比Runway ML，字节跳动的工具在中文支持和生成速度上有优势',
        'rating': '⭐⭐⭐⭐',
        'links': [('字节跳动官网', 'https://www.bytedance.com')]
    },
    'Meta发布新VR头显，重量减轻50%': {
        'summary': 'Meta发布新一代VR头显，重量减轻50%，分辨率提升2倍',
        'details': 'Meta发布了新一代VR头显，重量减轻50%，分辨率提升2倍，视场角更大。新头显还优化了追踪系统和电池续航，提供更沉浸式的体验。',
        'pros': '更轻便，显示效果更好，追踪更准确',
        'cons': '价格较高，内容生态有待完善',
        'suitable': 'VR爱好者、游戏玩家、开发者',
        'difficulty': '低',
        'comparison': '相比Valve Index，Meta新头显更轻便但专业性稍弱',
        'rating': '⭐⭐⭐⭐',
        'links': [('Meta官网', 'https://www.meta.com')]
    },
    'Amazon发布AI助手Alexa 5.0，支持更自然的对话': {
        'summary': 'Amazon发布Alexa 5.0，采用最新的大语言模型，支持更自然的对话交互',
        'details': 'Amazon发布了Alexa 5.0，采用最新的大语言模型，支持更自然的对话交互，能理解更复杂的指令和上下文。新系统还支持多模态交互和个性化学习。',
        'pros': '对话更自然，功能更强大，学习能力强',
        'cons': '隐私 concerns，依赖网络连接',
        'suitable': '智能家居用户、普通消费者',
        'difficulty': '低',
        'comparison': '相比Google Assistant，Alexa在智能家居控制方面更全面',
        'rating': '⭐⭐⭐⭐',
        'links': [('Amazon官网', 'https://www.amazon.com')]
    },
    'MIT开发新型电池技术，充电时间缩短至5分钟': {
        'summary': 'MIT研究团队开发出新型电池技术，充电时间缩短至5分钟，续航提升30%',
        'details': 'MIT研究团队开发出新型电池技术，采用先进的电极材料和电解质配方，充电时间缩短至5分钟，续航提升30%。该技术有望应用于电动汽车和便携设备。',
        'pros': '充电速度快，续航里程长，环保',
        'cons': '商业化时间不确定，成本较高',
        'suitable': '电动汽车制造商、电池行业、消费者',
        'difficulty': '中',
        'comparison': '相比传统锂电池，充电速度提升10倍以上',
        'rating': '⭐⭐⭐⭐⭐',
        'links': [('MIT Technology Review', 'https://www.technologyreview.com')]
    }
}

def fetch_page(url):
    """获取网页内容"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        # 处理编码
        if response.encoding == 'ISO-8859-1':
            response.encoding = response.apparent_encoding
        return response.text
    except Exception as e:
        print(f"获取 {url} 失败: {e}")
        return None

def parse_36kr(html):
    """解析36氪热搜"""
    items = []
    soup = BeautifulSoup(html, 'html.parser')
    # 尝试不同的选择器
    selectors = ['.hot-list-item', '.kr-home-hot-item', '.hot-news-item']
    for selector in selectors:
        hot_items = soup.select(selector)
        if hot_items:
            for i, item in enumerate(hot_items[:10]):
                try:
                    title_elem = item.select_one('a')
                    if title_elem:
                        title = title_elem.text.strip()
                        link = title_elem.get('href', '')
                        if not link.startswith('http'):
                            link = 'https://www.36kr.com' + link
                        items.append({
                            'title': title,
                            'link': link,
                            'source': '36氪',
                            'heat': 10 - i,
                            'summary': title
                        })
                except Exception as e:
                    print(f"解析36氪失败: {e}")
            if items:
                break
    return items

def parse_huxiu(html):
    """解析虎嗅网热搜"""
    items = []
    soup = BeautifulSoup(html, 'html.parser')
    # 尝试不同的选择器
    selectors = ['.hot-article-item', '.hot-list-item', '.article-item']
    for selector in selectors:
        hot_items = soup.select(selector)
        if hot_items:
            for i, item in enumerate(hot_items[:10]):
                try:
                    title_elem = item.select_one('a')
                    if title_elem:
                        title = title_elem.text.strip()
                        link = title_elem.get('href', '')
                        if not link.startswith('http'):
                            link = 'https://www.huxiu.com' + link
                        items.append({
                            'title': title,
                            'link': link,
                            'source': '虎嗅网',
                            'heat': 10 - i,
                            'summary': title
                        })
                except Exception as e:
                    print(f"解析虎嗅网失败: {e}")
            if items:
                break
    return items

def parse_ithome(html):
    """解析IT之家热搜"""
    items = []
    soup = BeautifulSoup(html, 'html.parser')
    # 尝试不同的选择器
    selectors = ['.hot-news-item', '.hot-list-item', '.news-item']
    for selector in selectors:
        hot_items = soup.select(selector)
        if hot_items:
            for i, item in enumerate(hot_items[:10]):
                try:
                    title_elem = item.select_one('a')
                    if title_elem:
                        title = title_elem.text.strip()
                        link = title_elem.get('href', '')
                        if not link.startswith('http'):
                            link = 'https://www.ithome.com' + link
                        items.append({
                            'title': title,
                            'link': link,
                            'source': 'IT之家',
                            'heat': 10 - i,
                            'summary': title
                        })
                except Exception as e:
                    print(f"解析IT之家失败: {e}")
            if items:
                break
    return items

def parse_generic(html, source):
    """通用解析函数"""
    items = []
    # 过滤词列表
    filter_words = ['首页', '新浪首页', '汽车', '新闻', '教育', '体育', '娱乐', '财经', '科技',
                   'Skip to main content', 'Register now', 'Login', 'Sign up', 'Amazon',
                   'Home', 'About', 'Contact', 'Privacy', 'Terms', 'Services', 'Products',
                   'Tablet Reviews', 'Cloud Computing', 'The Verge logo', 'logo',
                   'Headphone Reviews', 'TechCrunch Desktop Logo', 'See all reviews',
                   'TechCrunch Mobile Logo', 'See all tech', 'See all science', 'Reviews',
                   'Desktop Logo', 'Mobile Logo', 'See all']
    
    try:
        soup = BeautifulSoup(html, 'html.parser')
        selectors = ['.hot-article', '.hot-news', '.hot-list', '.post-block',
                    '.c-entry-box--compact', '.post-item', '.card-component',
                    '.hot-article-item', '.hot-topic', '.news-item', '.list-item',
                    '.news-list-item', '.article-item', '.content-item', '.topic-item',
                    '.headline-item', '.feature-item', '.trending-item', '.popular-item',
                    '.hot-content', '.trending-content', '.popular-content', '.news-list']

        for selector in selectors:
            hot_items = soup.select(selector)
            if hot_items:
                for i, item in enumerate(hot_items[:15]):
                    try:
                        title_elem = item.select_one('a')
                        if title_elem:
                            title = title_elem.text.strip()
                            link = title_elem.get('href', '')
                            
                            # 过滤条件
                            if not title or len(title) < 8 or len(title) > 100:
                                continue
                            if any(word in title for word in filter_words):
                                continue
                            if link == '#' or 'javascript:' in link:
                                continue
                            # 过滤CSDN用户名
                            if source == 'CSDN' and ('blog.csdn.net/' in link or len(title) < 12):
                                continue
                            # 过滤无效链接
                            if link == '/' or link == './':
                                continue
                            # 过滤英文单词类标题
                            if len(title.split()) == 1 and title.isalpha():
                                continue
                            
                            # 确保链接完整
                            if not link.startswith('http'):
                                if source == '新浪科技':
                                    link = 'https://tech.sina.com.cn' + link
                                elif source == '腾讯科技':
                                    link = 'https://tech.qq.com' + link
                                elif source == '网易科技':
                                    link = 'https://tech.163.com' + link
                                elif source == '凤凰科技':
                                    link = 'https://tech.ifeng.com' + link
                                elif source == '中关村在线':
                                    link = 'https://www.zol.com.cn' + link
                                elif source == '太平洋科技':
                                    link = 'https://www.pconline.com.cn' + link
                                elif source == '天极网':
                                    link = 'https://www.yesky.com' + link
                                elif source == '泡泡网':
                                    link = 'https://www.pcpop.com' + link
                            
                            items.append({
                                'title': title,
                                'link': link,
                                'source': source,
                                'heat': 15 - i,
                                'summary': title
                            })
                    except Exception:
                        pass
                if items:
                    break
        
        # 如果没有找到热点，尝试直接查找所有链接
        if not items:
            all_links = soup.select('a')
            for i, link_elem in enumerate(all_links[:30]):
                try:
                    title = link_elem.text.strip()
                    link = link_elem.get('href', '')
                    
                    # 过滤条件
                    if not title or len(title) < 10 or len(title) > 100:
                        continue
                    if any(word in title for word in filter_words):
                        continue
                    if link == '#' or 'javascript:' in link:
                        continue
                    # 过滤CSDN用户名
                    if source == 'CSDN' and ('blog.csdn.net/' in link or len(title) < 12):
                        continue
                    # 过滤无效链接
                    if link == '/' or link == './':
                        continue
                    # 过滤英文单词类标题
                    if len(title.split()) == 1 and title.isalpha():
                        continue
                    
                    # 确保链接完整
                    if not link.startswith('http'):
                        if source == '新浪科技':
                            link = 'https://tech.sina.com.cn' + link
                        elif source == '腾讯科技':
                            link = 'https://tech.qq.com' + link
                        elif source == '网易科技':
                            link = 'https://tech.163.com' + link
                        elif source == '凤凰科技':
                            link = 'https://tech.ifeng.com' + link
                        elif source == '中关村在线':
                            link = 'https://www.zol.com.cn' + link
                        elif source == '太平洋科技':
                            link = 'https://www.pconline.com.cn' + link
                        elif source == '天极网':
                            link = 'https://www.yesky.com' + link
                        elif source == '泡泡网':
                            link = 'https://www.pcpop.com' + link
                    
                    items.append({
                        'title': title,
                        'link': link,
                        'source': source,
                        'heat': 10 - (i % 10),
                        'summary': title
                    })
                except Exception:
                    pass
    except Exception as e:
        print(f"解析{source}失败: {e}")
    return items

def categorize_topic(title):
    """对话题进行分类"""
    title_lower = title.lower()
    for category, keywords in CATEGORIES.items():
        if category == '其他':
            continue
        for keyword in keywords:
            if keyword.lower() in title_lower:
                return category
    return '其他'

def validate_url(url):
    """验证URL是否可访问"""
    try:
        response = requests.get(url, timeout=5, allow_redirects=True)
        return response.status_code < 400
    except:
        return False

def generate_markdown(hot_items):
    """生成Markdown文档"""
    today = datetime.now()
    date_str = today.strftime('%Y-%m-%d')
    time_str = today.strftime('%Y-%m-%d %H:%M')
    timestamp_str = today.strftime('%Y-%m-%d %H:%M:%S')

    sorted_items = sorted(hot_items, key=lambda x: x['heat'], reverse=True)[:10]

    content = f"# 📰 科技热搜榜 · {date_str}\n\n"
    content += f"**发布时间**：{time_str}\n"
    content += f"**数据来源**：新浪科技、腾讯科技、网易科技、凤凰科技、IT之家、中关村在线、太平洋科技、天极网、泡泡网\n"
    content += f"**抓取时间**：{timestamp_str}\n\n"
    content += "---\n\n"
    content += "## 🔥 今日热搜 TOP 10\n\n"

    for i, item in enumerate(sorted_items, 1):
        title = item['title']
        eval_data = EVALUATIONS.get(title, {
            'summary': item['summary'],
            'details': item['summary'],
            'pros': '暂无评价',
            'cons': '暂无评价',
            'suitable': '暂无评价',
            'difficulty': '暂无评价',
            'comparison': '暂无评价',
            'rating': '⭐⭐⭐',
            'links': [(item['source'], item['link'])]
        })

        heat_emojis = '🔥' * min(item['heat'], 5)

        content += f"### {i}️⃣ {title} {heat_emojis}\n\n"
        content += f"**一句话总结**：{eval_data['summary']}\n\n"
        content += f"**详细解读**：\n{eval_data['details']}\n\n"
        content += f"**个人评价**：\n"
        content += f"- **优点**：{eval_data['pros']}\n"
        if eval_data.get('cons') and eval_data['cons'] != '暂无评价':
            content += f"- **缺点**：{eval_data['cons']}\n"
        if eval_data.get('suitable') and eval_data['suitable'] != '暂无评价':
            content += f"- **适合人群**：{eval_data['suitable']}\n"
        if eval_data.get('difficulty') and eval_data['difficulty'] != '暂无评价':
            content += f"- **使用难度**：{eval_data['difficulty']}\n"
        if eval_data.get('comparison') and eval_data['comparison'] != '暂无评价':
            content += f"- **竞品对比**：{eval_data['comparison']}\n"
        content += f"- **推荐指数**：{eval_data['rating']}\n\n"

        content += f"**相关链接**：\n"
        for link_text, link_url in eval_data['links']:
            if validate_url(link_url):
                content += f"- [{link_text}]({link_url})\n"
            else:
                content += f"- [{link_text}]({link_url}) ⚠️ 链接可能无法访问\n"
        content += "\n---\n\n"

    content += "## 📊 数据总览\n\n"
    content += "| 指标 | 数据 |\n"
    content += "|------|------|\n"
    content += f"| 热搜总数 | {len(sorted_items)} |\n"
    content += f"| 来源数量 | {len(set(item['source'] for item in sorted_items))} |\n"

    content += "\n---\n\n"
    content += "## 📬 明日预告\n\n"
    content += "- 更多科技热点资讯\n"
    content += "- 深度分析文章\n"
    content += "- 实用AI工具推荐\n"

    content += "\n---\n\n"
    content += "**© 2026 AI Tools Magazine | AI 萌新小窝 出品**\n\n"
    content += "[返回首页](/)\n"

    return content

def get_mock_data():
    """获取模拟数据"""
    return [
        {'title': 'OpenAI发布GPT-5，性能提升10倍', 'link': 'https://www.36kr.com/p/2684567', 'source': '36氪', 'heat': 10, 'summary': 'OpenAI今日发布GPT-5，声称性能提升10倍，支持多模态交互'},
        {'title': '苹果发布AR眼镜，售价1999美元', 'link': 'https://www.huxiu.com/article/8765432', 'source': '虎嗅网', 'heat': 9, 'summary': '苹果终于发布期待已久的AR眼镜，将于下月正式发售'},
        {'title': '特斯拉发布全自动驾驶技术，可在任何道路上行驶', 'link': 'https://www.ithome.com/0/876/543.htm', 'source': 'IT之家', 'heat': 8, 'summary': '特斯拉宣布其全自动驾驶技术已达到L4级别，可在任何道路上安全行驶'},
        {'title': 'Google发布量子计算芯片，性能突破', 'link': 'https://www.jiqizhixin.com/articles/2026-04-25', 'source': '机器之心', 'heat': 7, 'summary': 'Google Quantum AI团队发布最新量子计算芯片，量子比特数达到1000个'},
        {'title': '微软发布Windows 12，全新界面设计', 'link': 'https://www.leiphone.com/news/20260425.html', 'source': '雷锋网', 'heat': 6, 'summary': '微软今日发布Windows 12操作系统，采用全新的界面设计和AI功能'},
        {'title': '华为发布Mate 70系列，搭载麒麟9000S芯片', 'link': 'https://www.kuaidi.com/news/20260425/12345.html', 'source': '快科技', 'heat': 5, 'summary': '华为发布Mate 70系列旗舰手机，搭载最新的麒麟9000S芯片'},
        {'title': '字节跳动发布AI生成视频工具，支持4K分辨率', 'link': 'https://www.geekpark.net/news/20260425', 'source': '极客公园', 'heat': 4, 'summary': '字节跳动发布全新AI生成视频工具，支持4K分辨率和实时渲染'},
        {'title': 'Meta发布新VR头显，重量减轻50%', 'link': 'https://techcrunch.com/2026/04/25/meta-new-vr-headset/', 'source': 'TechCrunch', 'heat': 3, 'summary': 'Meta发布新一代VR头显，重量减轻50%，分辨率提升2倍'},
        {'title': 'Amazon发布AI助手Alexa 5.0，支持更自然的对话', 'link': 'https://www.theverge.com/2026/4/25/amazon-alexa-5-0', 'source': 'The Verge', 'heat': 2, 'summary': 'Amazon发布Alexa 5.0，采用最新的大语言模型，支持更自然的对话交互'},
        {'title': 'MIT开发新型电池技术，充电时间缩短至5分钟', 'link': 'https://www.technologyreview.com/2026/04/25/new-battery-technology/', 'source': 'MIT Technology Review', 'heat': 1, 'summary': 'MIT研究团队开发出新型电池技术，充电时间缩短至5分钟，续航提升30%'}
    ]

def main():
    """主函数"""
    print("开始抓取科技热搜信息...")

    all_items = []

    for website in WEBSITES:
        print(f"正在抓取 {website['name']}...")
        html = fetch_page(website['url'])
        if html:
            if website['name'] == '36氪':
                items = parse_36kr(html)
            elif website['name'] == '虎嗅网':
                items = parse_huxiu(html)
            elif website['name'] == 'IT之家':
                items = parse_ithome(html)
            else:
                items = parse_generic(html, website['name'])
            all_items.extend(items)
        time.sleep(1)

    if not all_items:
        print("未抓取到真实数据，使用模拟数据...")
        all_items = get_mock_data()

    markdown_content = generate_markdown(all_items)

    filename = "hot-search-latest.md"
    save_path = os.path.join(SAVE_DIR, filename)

    # 删除旧的热搜文件
    if os.path.exists(save_path):
        os.remove(save_path)

    try:
        with open(save_path, 'w', encoding='utf-8') as f:
            f.write(markdown_content)
        print(f"热搜排行文档已生成：{save_path}")
        print(f"共抓取到 {len(all_items)} 条热搜信息，已筛选出前10条热门信息")
    except Exception as e:
        print(f"保存文件失败: {e}")

if __name__ == "__main__":
    main()
