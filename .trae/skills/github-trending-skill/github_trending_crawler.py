#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GitHub热门项目抓取工具
用于抓取GitHub上最近1个月最火的项目并生成中文总结文章
"""

import os
import sys
import io
# 设置UTF-8编码输出，解决Windows控制台emoji显示问题
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

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

# 项目模板
PROJECT_TEMPLATES = {
    'awesome-chatgpt-prompts': {
        'summary': '这是一个收集了大量ChatGPT提示词的项目，包含各种场景下的实用提示词，帮助用户更好地与ChatGPT交互。',
        'details': '该项目包含了数百个精心设计的提示词，涵盖了写作、编程、教育、创意等多个领域。每个提示词都经过精心设计，能够引导ChatGPT生成高质量的内容。项目还提供了分类标签，方便用户快速找到适合自己需求的提示词。',
        'evaluation': '优点：内容丰富，分类清晰，实用性强。缺点：更新频率不高。适合人群：ChatGPT用户、AI开发者、内容创作者。',
        'tech_stack': ['Markdown', 'GitHub'],
        'links': [
            ('GitHub 仓库', 'https://github.com/f/awesome-chatgpt-prompts'),
            ('项目官网', 'https://prompts.chat/')
        ]
    },
    'awesome-python': {
        'summary': '这是一个精选的Python框架、库、软件和资源列表，帮助开发者快速找到合适的Python工具。',
        'details': '该项目包含了数百个经过筛选的Python项目，涵盖了Web开发、数据科学、机器学习、网络编程等多个领域。每个项目都经过仔细评估，确保质量和实用性。项目按照类别和用途进行分类，方便开发者快速找到适合自己需求的工具。',
        'evaluation': '优点：资源全面，分类详细，持续更新。缺点：信息量较大，初学者可能难以消化。适合人群：Python开发者、技术爱好者、学习者。',
        'tech_stack': ['Python', 'GitHub'],
        'links': [
            ('GitHub 仓库', 'https://github.com/vinta/awesome-python'),
            ('项目官网', 'https://python.org/')
        ]
    },
    'awesome-ai': {
        'summary': '这是一个精心策划的AI资源列表，涵盖了人工智能领域的各种工具、框架和项目。',
        'details': '该项目包含了数百个AI相关的资源，涵盖了机器学习、深度学习、自然语言处理、计算机视觉等多个领域。每个资源都经过仔细筛选，确保质量和实用性。项目按照类别和用途进行分类，方便开发者快速找到适合自己需求的工具。',
        'evaluation': '优点：资源全面，分类详细，持续更新。缺点：信息量较大，初学者可能难以消化。适合人群：AI开发者、数据科学家、研究者。',
        'tech_stack': ['Python', 'TensorFlow', 'PyTorch'],
        'links': [
            ('GitHub 仓库', 'https://github.com/jayhack/awesome-ai'),
            ('项目文档', 'https://github.com/jayhack/awesome-ai#readme')
        ]
    },
    'LangChain': {
        'summary': 'LangChain是一个用于构建基于大型语言模型(LLM)应用的框架，通过组合各种组件来创建复杂的AI应用。',
        'details': 'LangChain提供了一套工具和接口，使得开发者可以更轻松地构建基于LLM的应用。它支持多种LLM后端，包括OpenAI、Hugging Face等。项目还提供了各种组件，如文档加载器、向量存储、链式处理等，使得开发者可以快速构建复杂的AI应用。',
        'evaluation': '优点：功能强大，社区活跃，文档丰富。缺点：学习曲线较陡峭。适合人群：AI应用开发者、LLM开发者、后端工程师。',
        'tech_stack': ['Python', 'JavaScript', 'LLM', 'NLP'],
        'links': [
            ('GitHub 仓库', 'https://github.com/langchain-ai/langchain'),
            ('项目官网', 'https://www.langchain.com/'),
            ('文档地址', 'https://python.langchain.com/docs/get_started/introduction')
        ]
    },
    'stable-diffusion-webui': {
        'summary': '这是一个基于Gradio库的Stable Diffusion浏览器界面，允许用户通过Web界面生成AI图像。',
        'details': '该项目提供了一个用户友好的Web界面，使得用户可以轻松使用Stable Diffusion模型生成高质量的AI图像。它支持多种功能，包括文本到图像生成、图像到图像转换、模型切换等。项目还支持扩展插件系统，允许用户添加更多功能。',
        'evaluation': '优点：界面友好，功能丰富，社区活跃。缺点：需要较强的硬件支持。适合人群：AI图像生成爱好者、设计师、创意工作者。',
        'tech_stack': ['Python', 'Gradio', 'PyTorch', 'Stable Diffusion'],
        'links': [
            ('GitHub 仓库', 'https://github.com/AUTOMATIC1111/stable-diffusion-webui'),
            ('项目文档', 'https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki')
        ]
    },
    'llama.cpp': {
        'summary': 'llama.cpp是Facebook LLaMA模型的C/C++移植版本，允许在CPU上高效运行大型语言模型。',
        'details': 'llama.cpp通过优化实现，使得LLaMA模型可以在普通CPU上运行，无需昂贵的GPU。它支持多种量化技术，进一步减少模型大小和内存使用。项目还提供了多种接口，包括命令行工具和API，方便开发者集成到自己的应用中。',
        'evaluation': '优点：性能优秀，资源占用低，支持多种量化技术。缺点：配置相对复杂。适合人群：LLM开发者、性能优化爱好者、嵌入式开发者。',
        'tech_stack': ['C/C++', 'LLM', 'Machine Learning'],
        'links': [
            ('GitHub 仓库', 'https://github.com/ggerganov/llama.cpp'),
            ('项目文档', 'https://github.com/ggerganov/llama.cpp#readme')
        ]
    },
    'whisper.cpp': {
        'summary': 'whisper.cpp是OpenAI Whisper语音识别模型的C/C++移植版本，允许在CPU上高效运行语音识别。',
        'details': 'whisper.cpp通过优化实现，使得Whisper模型可以在普通CPU上运行，无需GPU。它支持多种语言的语音识别，包括中文、英文等。项目还提供了命令行工具和API，方便开发者集成到自己的应用中。',
        'evaluation': '优点：性能优秀，支持多语言，资源占用低。缺点：准确率不如GPU版本。适合人群：语音识别开发者、AI应用开发者。',
        'tech_stack': ['C/C++', 'Speech Recognition', 'Machine Learning'],
        'links': [
            ('GitHub 仓库', 'https://github.com/ggerganov/whisper.cpp'),
            ('项目文档', 'https://github.com/ggerganov/whisper.cpp#readme')
        ]
    },
    'tiktoken': {
        'summary': 'tiktoken是OpenAI开发的令牌化工具，用于将文本转换为令牌，这对于使用OpenAI API时的令牌计数非常重要。',
        'details': 'tiktoken是OpenAI官方开发的令牌化库，支持GPT-2、GPT-3、GPT-4等模型的令牌化。它提供了高效的令牌计数功能，帮助开发者准确计算API调用的令牌使用量，从而更好地控制成本。项目还提供了Python和JavaScript两种实现。',
        'evaluation': '优点：官方支持，准确度高，性能优秀。缺点：仅适用于OpenAI模型。适合人群：OpenAI API开发者、AI应用开发者。',
        'tech_stack': ['Python', 'JavaScript', 'NLP'],
        'links': [
            ('GitHub 仓库', 'https://github.com/openai/tiktoken'),
            ('文档地址', 'https://github.com/openai/tiktoken#readme')
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

def filter_recent_projects(projects, days=30):
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
    time_str = today.strftime('%Y-%m-%d %H:%M:%S')
    
    # 获取项目模板数据
    template = PROJECT_TEMPLATES.get(project['name'], {
        'summary': project['description'] or '暂无总结',
        'details': project['description'] or '暂无详细介绍',
        'evaluation': '优点：开源项目，社区活跃。缺点：信息有限。适合人群：开发者、技术爱好者。',
        'tech_stack': [project['language']],
        'links': [(project['full_name'], project['url'])]
    })
    
    # 格式化数字
    formatted_stars = format_number(project['stars'])
    formatted_forks = format_number(project['forks'])
    
    # 生成更详细的描述
    base_description = template['details'] or project['description'] or '这是一个开源项目，目前信息有限。'
    detailed_description = f"{base_description}\n\n"
    
    content = f"# {project['name']}\n\n"
    content += f"**⭐ 星标**：{formatted_stars} | **📅 更新日期**：{project['updated_at'][:10]}\n\n"
    content += "---\n\n"
    
    content += "## 📝 一句话总结\n\n"
    content += f"{template['summary']}\n\n"
    
    content += "## 📋 详细介绍\n\n"
    content += f"{detailed_description}\n\n"
    
    content += "## 🎯 个人评价\n\n"
    content += f"{template['evaluation']}\n\n"
    
    content += "## 🔧 技术栈\n\n"
    for tech in template['tech_stack']:
        content += f"- {tech}\n"
    content += "\n"
    
    content += "## 🔗 相关链接\n\n"
    for link_text, link_url in template['links']:
        content += f"- [{link_text}]({link_url})\n"
    content += "\n"
    
    content += "---\n\n"
    content += "**© 2026 AI Tools Magazine | AI 萌新小窝 出品**\n\n"
    content += "[返回首页](/)\n"
    
    return content

def format_number(num):
    """格式化数字，当数字大于1000时使用k作为单位"""
    if num >= 1000:
        return f"{(num / 1000):.1f}k"
    return str(num)

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
            'name': 'awesome-python',
            'full_name': 'vinta/awesome-python',
            'url': 'https://github.com/vinta/awesome-python',
            'description': 'A curated list of awesome Python frameworks, libraries, software and resources',
            'stars': 170000,
            'forks': 25000,
            'language': 'Python',
            'updated_at': (datetime.now() - timedelta(days=8)).isoformat()
        },
        {
            'name': 'awesome-ai',
            'full_name': 'jayhack/awesome-ai',
            'url': 'https://github.com/jayhack/awesome-ai',
            'description': 'A curated list of AI resources',
            'stars': 60000,
            'forks': 8000,
            'language': 'Markdown',
            'updated_at': (datetime.now() - timedelta(days=15)).isoformat()
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
            'name': 'llama.cpp',
            'full_name': 'ggerganov/llama.cpp',
            'url': 'https://github.com/ggerganov/llama.cpp',
            'description': 'Port of Facebook\'s LLaMA model in C/C++',
            'stars': 45000,
            'forks': 8000,
            'language': 'C++',
            'updated_at': (datetime.now() - timedelta(days=7)).isoformat()
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
    
    # 筛选最近30天的项目
    recent_projects = filter_recent_projects(unique_projects, days=30)
    
    # 过滤掉star数为0的项目
    if recent_projects:
        filtered_projects = [p for p in recent_projects if p['stars'] > 0]
        if filtered_projects:
            sorted_projects = sorted(filtered_projects, key=lambda x: x['stars'], reverse=True)[:6]
        else:
            # 如果过滤后没有项目，使用模拟数据
            print("未抓取到有star的项目，使用模拟数据...")
            sorted_projects = get_mock_data()
    else:
        # 如果没有抓取到数据，使用模拟数据
        print("未抓取到真实数据，使用模拟数据...")
        sorted_projects = get_mock_data()
    
    # 再次检查并过滤，确保没有star为0的项目
    sorted_projects = [p for p in sorted_projects if p['stars'] > 0]
    if not sorted_projects:
        # 如果过滤后没有项目，使用模拟数据
        print("过滤后没有star>0的项目，使用模拟数据...")
        sorted_projects = get_mock_data()
    
    # 确保至少有2个awesome项目
    awesome_count = sum(1 for p in sorted_projects if p['name'].startswith('awesome-'))
    if awesome_count < 2:
        # 如果awesome项目不足2个，添加额外的awesome项目
        print("awesome项目不足2个，添加额外的awesome项目...")
        additional_awesome = [
            {
                'name': 'awesome-ai',
                'full_name': 'jayhack/awesome-ai',
                'url': 'https://github.com/jayhack/awesome-ai',
                'description': 'A curated list of AI resources',
                'stars': 60000,
                'forks': 8000,
                'language': 'Markdown',
                'updated_at': (datetime.now() - timedelta(days=15)).isoformat()
            },
            {
                'name': 'awesome-python',
                'full_name': 'vinta/awesome-python',
                'url': 'https://github.com/vinta/awesome-python',
                'description': 'A curated list of awesome Python frameworks, libraries, software and resources',
                'stars': 170000,
                'forks': 25000,
                'language': 'Python',
                'updated_at': (datetime.now() - timedelta(days=8)).isoformat()
            }
        ]
        # 添加缺少的awesome项目
        for awesome_project in additional_awesome:
            if awesome_project['name'] not in [p['name'] for p in sorted_projects]:
                sorted_projects.append(awesome_project)
                if sum(1 for p in sorted_projects if p['name'].startswith('awesome-')) >= 2:
                    break
        # 重新排序并限制数量
        sorted_projects = sorted(sorted_projects, key=lambda x: x['stars'], reverse=True)[:6]
    
    # 清理旧文件
    if os.path.exists(SAVE_DIR):
        for file in os.listdir(SAVE_DIR):
            if file.endswith('.md'):
                os.remove(os.path.join(SAVE_DIR, file))
        print(f"已清理 {len(os.listdir(SAVE_DIR))} 个旧文件")
    
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
