"""Build data/manifest.json from all .md files in data/ directory.
Run this script whenever .md files are added, removed, or renamed.
Usage: python build_manifest.py
"""
import json, os, re

# Category mapping for 萌新学习 (by file prefix)
NEWBIE_CATEGORIES = {
    '001': '博主教程', '002': '博主教程', '003': '博主教程', '004': '博主教程',
    '005': '网文写作', '006': '写作变现', '007': '拆书入门', '008': '实战教程',
    '009': '去AI味', '010': '去AI味', '011': '去AI味', '012': '去AI味', '013': '去AI味'
}

# Category mapping for 文学理论
LITHEORY_CATEGORIES = {
    '001': '叙事学理论', '002': '结构主义', '003': '读者批评',
    '004': '女性主义', '005': '后现代主义', '006': '比较文学'
}

# Category mapping for 去AI味
DEAI_CATEGORIES = {
    '001': 'Prompt模板', '002': 'AI高频词', '003': '最新技巧',
    '004': '对比案例', '005': '方法论', '006': '最新技巧',
    '007': '场景实战', '008': '场景实战', '009': '最新技巧', '010': '避坑指南'
}

# Category mapping for 书摘文案
BOOK_EXCERPT_CATEGORIES = {
    '001': '经典书摘', '002': '名人名言', '003': '经典书评',
    '004': '高赞划线', '005': '网络热梗', '006': '高赞文案'
}


def infer_category(dir_name, file_name):
    """Infer category from directory name + filename pattern."""
    prefix_match = re.match(r'^(\d{3})', file_name)
    prefix = prefix_match.group(1) if prefix_match else '001'

    if dir_name == '萌新学习':
        return NEWBIE_CATEGORIES.get(prefix, '萌新学习')
    elif dir_name == '去AI味':
        return DEAI_CATEGORIES.get(prefix, '去AI味')
    elif dir_name == '文学理论':
        return LITHEORY_CATEGORIES.get(prefix, '文学理论')
    elif dir_name == '书摘文案':
        return BOOK_EXCERPT_CATEGORIES.get(prefix, '书摘文案')
    elif dir_name == '拆书心得':
        # Extract book name from pattern: "NNN-BOOKNAME-description.md"
        parts = file_name.replace('.md', '').split('-')
        if len(parts) >= 2:
            # If first part is numeric, book name is second part
            if parts[0].isdigit():
                return parts[1]
        return '拆书心得'
    elif dir_name == '知识创作':
        return '知识创作'
    elif dir_name == '精选项目':
        return '精选项目'
    elif dir_name == '历史备份':
        return '历史备份'
    return dir_name


def clean_date(date_str):
    """Clean date string: strip extra text after pipe character."""
    return re.sub(r'\s*\|.*$', '', date_str).strip()


def extract_metadata(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return None

    # Title from first H1
    title_match = re.search(r'^# (.+)$', content, re.MULTILINE)
    title = title_match.group(1).strip() if title_match else os.path.basename(filepath).replace('.md', '')

    # Summary
    summary = ''
    for pattern in [
        r'## .*?一句话总结\s*\n\s*\n\*\*(.+?)\*\*',
        r'## .*?.*?总结\s*\n\s*\n\*\*(.+?)\*\*',
    ]:
        m = re.search(pattern, content)
        if m:
            summary = m.group(1).strip()
            break
    if not summary:
        m = re.search(r'## .*?一句话总结\s*\n\s*(.+?)(?:\n|$)', content)
        if m:
            summary = m.group(1).strip()

    # Date (clean extra text after |)
    date = '2026-01-01'
    for dp in [r'\*\*发布时间\*\*[：:]\s*(.+?)$',
               r'\*\*📅 更新日期\*\*[：:]\s*(.+?)$',
               r'\*\*日期\*\*[：:]\s*(.+?)$']:
        m = re.search(dp, content, re.MULTILINE)
        if m:
            date = clean_date(m.group(1))
            break

    # Stars (知识创作 files)
    stars = 0
    stars_match = re.search(r'\*\*⭐ 星标\*\*[：:]\s*([\d.]+k?)', content)
    if stars_match:
        s = stars_match.group(1)
        stars = int(float(s.replace('k', '')) * 1000) if s.endswith('k') else int(s)

    # GitHub URL (知识创作 files)
    github_url = ''
    url_match = re.search(r'\[GitHub 仓库\]\(([^)]+)\)', content)
    if url_match:
        github_url = url_match.group(1)

    return {
        'title': title, 'summary': summary, 'date': date,
        'stars': stars, 'github_url': github_url
    }


def main():
    manifest = {}
    for dirpath, dirnames, filenames in os.walk('data'):
        for f in sorted(filenames):
            if f.endswith('.md') and not f.startswith('说明'):
                rel_path = os.path.join(dirpath, f).replace('\\', '/')
                dir_name = os.path.basename(dirpath)
                meta = extract_metadata(rel_path)
                if meta:
                    entry = {
                        'title': meta['title'],
                        'dir': dir_name,
                        'summary': meta['summary'],
                        'date': meta['date'],
                        'category': infer_category(dir_name, f)
                    }
                    if meta['stars']:
                        entry['stars'] = meta['stars']
                    if meta['github_url']:
                        entry['github_url'] = meta['github_url']
                    manifest[rel_path] = entry

    with open('data/manifest.json', 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    print(f'Manifest written: {len(manifest)} entries')
    for dir_name in sorted(set(m['dir'] for m in manifest.values())):
        count = sum(1 for m in manifest.values() if m['dir'] == dir_name)
        print(f'  {dir_name}: {count}')


if __name__ == '__main__':
    main()
