#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GitHub热门项目抓取工具
用于抓取GitHub上最近最火的项目并生成中文总结文章
"""

import os
import time
import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta

# 获取项目根目录
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
# 保存目录
SAVE_DIR = os.path.join(PROJECT_ROOT, 'data', '精选项目')

# 确保保存目录存在
if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

# GitHub Trending URL
GITHUB_TRENDING_URL = 'https://github.com/trending'

# 项目分类
CATEGORIES = [
    'all',  # 所有语言
    'python',
    'javascript',
    'typescript',
    'rust',
    'go',
    'java',
    'c++',
    'c#',
    'php'
]

# 项目总结模板
PROJECT_TEMPLATES = {
    'awesome-chatgpt-prompts': {
        'name': 'awesome-chatgpt-prompts',
        'description': 'A collection of prompt examples to be used with the ChatGPT model',
        'summary': '这是一个收集了大量ChatGPT提示词的项目，包含各种场景下的实用提示词，帮助用户更好地与ChatGPT交互。',
        'details': '该项目包含了数百个精心设计的提示词，涵盖了写作、编程、教育、创意等多个领域。每个提示词都经过精心设计，能够引导ChatGPT生成高质量的内容。项目还提供了分类标签，方便用户快速找到适合自己需求的提示词。',
        'tech_stack': ['Markdown', 'GitHub'],
        'recommendation': '⭐⭐⭐⭐⭐',
        'links': [
            ('GitHub 仓库', 'https://github.com/f/awesome-chatgpt-prompts'),
            ('项目官网', 'https://prompts.chat/')
        ]
    },
    'stable-diffusion-webui': {
        'name': 'stable-diffusion-webui',
        'description': 'A browser interface based on Gradio library for Stable Diffusion',
        'summary': '这是一个基于Gradio库的Stable Diffusion浏览器界面，允许用户通过Web界面生成AI图像。',
        'details': '该项目提供了一个用户友好的Web界面，使得用户可以轻松使用Stable Diffusion模型生成高质量的AI图像。它支持多种功能，包括文本到图像生成、图像到图像转换、模型切换等。项目还支持扩展插件系统，允许用户添加更多功能。',
        'tech_stack': ['Python', 'Gradio', 'PyTorch', 'Stable Diffusion'],
        'recommendation': '⭐⭐⭐⭐⭐',
        'links': [
            ('GitHub 仓库', 'https://github.com/AUTOMATIC1111/stable-diffusion-webui'),
            ('项目文档', 'https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki')
        ]
    },
    'LangChain': {
        'name': 'LangChain',
        'description': 'Building applications with LLMs through composability',
        'summary': 'LangChain是一个用于构建基于大型语言模型(LLM)应用的框架，通过组合各种组件来创建复杂的AI应用。',
        'details': 'LangChain提供了一套工具和接口，使得开发者可以更轻松地构建基于LLM的应用。它支持多种LLM后端，包括OpenAI、Hugging Face等。项目还提供了各种组件，如文档加载器、向量存储、链式处理等，使得开发者可以快速构建复杂的AI应用。',
        'tech_stack': ['Python', 'JavaScript', 'LLM', 'NLP'],
        'recommendation': '⭐⭐⭐⭐⭐',
        'links': [
            ('GitHub 仓库', 'https://github.com/langchain-ai/langchain'),
            ('项目官网', 'https://www.langchain.com/'),
            ('文档地址', 'https://python.langchain.com/docs/get_started/introduction')
        ]
    },
    'tiktoken': {
        'name': 'tiktoken',
        'description': 'OpenAI\'s tiktoken tokenizer',
        'summary': 'tiktoken是OpenAI开发的令牌化工具，用于将文本转换为令牌，这对于使用OpenAI API时的令牌计数非常重要。',
        'details': 'tiktoken是OpenAI官方开发的令牌化库，支持GPT-2、GPT-3、GPT-4等模型的令牌化。它提供了高效的令牌计数功能，帮助开发者准确计算API调用的令牌使用量，从而更好地控制成本。项目还提供了Python和JavaScript两种实现。',
        'tech_stack': ['Python', 'JavaScript', 'NLP'],
        'recommendation': '⭐⭐⭐⭐',
        'links': [
            ('GitHub 仓库', 'https://github.com/openai/tiktoken'),
            ('文档地址', 'https://github.com/openai/tiktoken#readme')
        ]
    },
    'llama.cpp': {
        'name': 'llama.cpp',
        'description': 'Port of Facebook\'s LLaMA model in C/C++',
        'summary': 'llama.cpp是Facebook LLaMA模型的C/C++移植版本，允许在CPU上高效运行大型语言模型。',
        'details': 'llama.cpp通过优化实现，使得LLaMA模型可以在普通CPU上运行，无需昂贵的GPU。它支持多种量化技术，进一步减少模型大小和内存使用。项目还提供了多种接口，包括命令行工具和API，方便开发者集成到自己的应用中。',
        'tech_stack': ['C/C++', 'LLM', 'Machine Learning'],
        'recommendation': '⭐⭐⭐⭐⭐',
        'links': [
            ('GitHub 仓库', 'https://github.com/ggerganov/llama.cpp'),
            ('项目文档', 'https://github.com/ggerganov/llama.cpp#readme')
        ]
    },
    'whisper.cpp': {
        'name': 'whisper.cpp',
        'description': 'Port of OpenAI\'s Whisper model in C/C++',
        'summary': 'whisper.cpp是OpenAI Whisper语音识别模型的C/C++移植版本，允许在CPU上高效运行语音识别。',
        'details': 'whisper.cpp通过优化实现，使得Whisper模型可以在普通CPU上运行，无需GPU。它支持多种语言的语音识别，包括中文、英文等。项目还提供了命令行工具和API，方便开发者集成到自己的应用中。',
        'tech_stack': ['C/C++', 'Speech Recognition', 'Machine Learning'],
        'recommendation': '⭐⭐⭐⭐',
        'links': [
            ('GitHub 仓库', 'https://github.com/ggerganov/whisper.cpp'),
            ('项目文档', 'https://github.com/ggerganov/whisper.cpp#readme')
        ]
    }
}

def fetch_page(url):
    """获取网页内容"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        return response.text
    except Exception as e:
        print(f"获取 {url} 失败: {e}")
        return None

def parse_github_trending(html):
    """解析GitHub Trending页面"""
    items = []
    try:
        soup = BeautifulSoup(html, 'html.parser')
        repo_cards = soup.select('article.Box-row')
        
        for card in repo_cards:
            try:
                # 提取项目名称
                title_elem = card.select_one('h2 a')
                if not title_elem:
                    continue
                
                full_name = title_elem.text.strip().replace('\n', '').replace(' ', '')
                name = full_name.split('/')[-1]
                url = 'https://github.com' + title_elem.get('href', '')
                
                # 提取描述
                desc_elem = card.select_one('p')
                description = desc_elem.text.strip() if desc_elem else ''
                
                # 提取统计信息
                stats = card.select('div.f6 a')
                stars = 0
                forks = 0
                
                for stat in stats:
                    text = stat.text.strip()
                    if 'Star' in text:
                        stars = int(text.replace(',', ''))
                    elif 'Fork' in text:
                        forks = int(text.replace(',', ''))
                
                # 提取主要语言
                lang_elem = card.select_one('[itemprop="programmingLanguage"]')
                language = lang_elem.text.strip() if lang_elem else 'Unknown'
                
                # 提取最近更新时间
                updated_elem = card.select_one('relative-time')
                updated_at = updated_elem.get('datetime') if updated_elem else datetime.now().isoformat()
                
                items.append({
                    'name': name,
                    'full_name': full_name,
                    'url': url,
                    'description': description,
                    'stars': stars,
                    'forks': forks,
                    'language': language,
                    'updated_at': updated_at
                })
            except Exception as e:
                print(f"解析项目失败: {e}")
                continue
    except Exception as e:
        print(f"解析GitHub Trending页面失败: {e}")
    
    return items

def filter_recent_projects(projects, days=60):
    """筛选最近指定天数内更新的项目"""
    recent_projects = []
    cutoff_date = datetime.now() - timedelta(days=days)
    
    for project in projects:
        try:
            updated_at = datetime.fromisoformat(project['updated_at'].replace('Z', '+00:00'))
            if updated_at > cutoff_date:
                recent_projects.append(project)
        except Exception:
            # 如果日期解析失败，默认包含该项目
            recent_projects.append(project)
    
    return recent_projects

def generate_project_article(project):
    """生成项目的Markdown文章"""
    today = datetime.now()
    date_str = today.strftime('%Y-%m-%d')
    time_str = today.strftime('%Y-%m-%d %H:%M:%S')
    
    # 获取项目模板数据
    template = PROJECT_TEMPLATES.get(project['name'], {
        'summary': project['description'] or '暂无总结',
        'details': project['description'] or '暂无详细介绍',
        'tech_stack': [project['language']],
        'recommendation': '⭐⭐⭐⭐',
        'links': [(project['full_name'], project['url'])]
    })
    
    content = f"# 📁 {project['name']}\n\n"
    content += f"**项目地址**：[{project['full_name']}]({project['url']})\n"
    content += f"**Star 数**：{project['stars']}\n"
    content += f"**Fork 数**：{project['forks']}\n"
    content += f"**主要语言**：{project['language']}\n"
    content += f"**最近更新**：{project['updated_at'][:10]}\n"
    content += f"**抓取时间**：{time_str}\n\n"
    content += "---\n\n"
    
    content += "## 📝 项目总结\n\n"
    content += f"{template['summary']}\n\n"
    
    content += "## 📋 详细介绍\n\n"
    content += f"{template['details']}\n\n"
    
    content += "## 🎯 技术栈\n\n"
    for tech in template['tech_stack']:
        content += f"- {tech}\n"
    content += "\n"
    
    content += "## 🌟 推荐指数\n\n"
    content += f"{template['recommendation']}\n\n"
    
    content += "## 🔗 相关链接\n\n"
    for link_text, link_url in template['links']:
        content += f"- [{link_text}]({link_url})\n"
    content += "\n"
    
    content += "---\n\n"
    content += "**© 2026 AI Tools Magazine | AI 萌新小窝 出品**\n\n"
    content += "[返回首页](/)=\n"
    
    return content

def get_mock_data():
    """获取模拟数据"""
    return [
        {
            'name': 'awesome-chatgpt-prompts',
            'full_name': 'f/awesome-chatgpt-prompts',
            'url': 'https://github.com/f/awesome-chatgpt-prompts',
            'description': 'A collection of prompt examples to be used with the ChatGPT model',
            'stars': 150000,
            'forks': 30000,
            'language': 'Markdown',
            'updated_at': (datetime.now() - timedelta(days=10)).isoformat()
        },
        {
            'name': 'stable-diffusion-webui',
            'full_name': 'AUTOMATIC1111/stable-diffusion-webui',
            'url': 'https://github.com/AUTOMATIC1111/stable-diffusion-webui',
            'description': 'A browser interface based on Gradio library for Stable Diffusion',
            'stars': 100000,
            'forks': 20000,
            'language': 'Python',
            'updated_at': (datetime.now() - timedelta(days=5)).isoformat()
        },
        {
            'name': 'LangChain',
            'full_name': 'langchain-ai/langchain',
            'url': 'https://github.com/langchain-ai/langchain',
            'description': 'Building applications with LLMs through composability',
            'stars': 80000,
            'forks': 10000,
            'language': 'Python',
            'updated_at': (datetime.now() - timedelta(days=3)).isoformat()
        },
        {
            'name': 'tiktoken',
            'full_name': 'openai/tiktoken',
            'url': 'https://github.com/openai/tiktoken',
            'description': 'OpenAI\'s tiktoken tokenizer',
            'stars': 50000,
            'forks': 5000,
            'language': 'Python',
            'updated_at': (datetime.now() - timedelta(days=15)).isoformat()
        },
        {
            'name': 'llama.cpp',
            'full_name': 'ggerganov/llama.cpp',
            'url': 'https://github.com/ggerganov/llama.cpp',
            'description': 'Port of Facebook\'s LLaMA model in C/C++',
            'stars': 45000,
            'forks': 8000,
            'language': 'C++',
            'updated_at': (datetime.now() - timedelta(days=7)).isoformat()
        },
        {
            'name': 'whisper.cpp',
            'full_name': 'ggerganov/whisper.cpp',
            'url': 'https://github.com/ggerganov/whisper.cpp',
            'description': 'Port of OpenAI\'s Whisper model in C/C++',
            'stars': 40000,
            'forks': 6000,
            'language': 'C++',
            'updated_at': (datetime.now() - timedelta(days=12)).isoformat()
        }
    ]

def main():
    """主函数"""
    print("开始抓取GitHub热门项目...")
    
    all_projects = []
    
    # 尝试从GitHub Trending抓取数据
    for category in CATEGORIES[:3]:  # 只抓取前3个分类，避免过多请求
        url = f"{GITHUB_TRENDING_URL}/{category}" if category != 'all' else GITHUB_TRENDING_URL
        print(f"正在抓取 {category} 分类的热门项目...")
        html = fetch_page(url)
        if html:
            projects = parse_github_trending(html)
            all_projects.extend(projects)
        time.sleep(2)  # 添加延迟，避免被限流
    
    # 去重
    unique_projects = []
    seen_names = set()
    for project in all_projects:
        if project['full_name'] not in seen_names:
            seen_names.add(project['full_name'])
            unique_projects.append(project)
    
    # 筛选最近60天的项目
    recent_projects = filter_recent_projects(unique_projects, days=60)
    
    # 按Star数排序，取前6个
    if recent_projects:
        sorted_projects = sorted(recent_projects, key=lambda x: x['stars'], reverse=True)[:6]
    else:
        # 如果没有抓取到数据，使用模拟数据
        print("未抓取到真实数据，使用模拟数据...")
        sorted_projects = get_mock_data()
    
    # 生成文章
    for i, project in enumerate(sorted_projects, 1):
        article_content = generate_project_article(project)
        filename = f"{i:03d}-{project['name']}.md"
        save_path = os.path.join(SAVE_DIR, filename)
        
        try:
            with open(save_path, 'w', encoding='utf-8') as f:
                f.write(article_content)
            print(f"项目文章已生成：{save_path}")
        except Exception as e:
            print(f"保存文件失败: {e}")
    
    print(f"共生成 {len(sorted_projects)} 篇项目总结文章")

if __name__ == "__main__":
    main()
