"""Generate rss.xml and sitemap.xml from data/manifest.json.
Run this script whenever .md files are added, removed, or have their dates changed.
Usage: python generate_feeds.py
"""
import json, os, re
from datetime import datetime
from xml.sax.saxutils import escape as xml_escape

BASE_URL = 'https://corely.top'
SITE_TITLE = 'AI 萌新小窝 - AI拆书读书与写作学习'
SITE_DESC = '面向新人的AI写作学习交流平台，用AI逐段拆解经典名著，从好书中学会写作'

# ID generation for article URLs
DIR_ID_PREFIX = {
    '萌新学习': 'newbie',
    '去AI味': 'deai',
    '拆书心得': 'book-analysis',
    '文学理论': 'littheory',
    '书摘文案': 'book-excerpt',
    '知识创作': 'knowledge',
    '精选项目': 'project'
}

PAGE_URLS = [
    ('/', 'daily', '0.9'),
    ('/ai.html', 'weekly', '0.7'),
    ('/resource.html', 'weekly', '0.7'),
    ('/board.html', 'weekly', '0.6'),
    ('/webnovel.html', 'weekly', '0.7'),
    ('/ai-writing.html', 'weekly', '0.7'),
    ('/book-analysis.html', 'weekly', '0.8'),
    ('/deai.html', 'weekly', '0.7'),
    ('/newbie.html', 'weekly', '0.7'),
    ('/littheory.html', 'weekly', '0.6'),
    ('/book-excerpts.html', 'weekly', '0.6'),
    ('/knowledge.html', 'weekly', '0.7'),
    ('/famous-books.html', 'weekly', '0.7'),
    ('/famous-people.html', 'weekly', '0.7'),
    ('/skill-evolution.html', 'weekly', '0.7'),
    ('/game.html', 'monthly', '0.5'),
    ('/debate.html', 'monthly', '0.5'),
    ('/faq.html', 'monthly', '0.5'),
    ('/glossary.html', 'monthly', '0.5'),
    ('/disclaimer.html', 'monthly', '0.3'),
]

def load_manifest():
    with open('data/manifest.json', 'r', encoding='utf-8') as f:
        return json.load(f)

def get_article_id(path, dir_name):
    """Generate article ID from file path."""
    file_name = os.path.basename(path)
    prefix_match = re.match(r'^(\d{3})', file_name)
    prefix = prefix_match.group(1) if prefix_match else '001'

    if dir_name == '知识创作':
        return 'knowledge-' + file_name.replace('.md', '')
    elif dir_name == '精选项目':
        slug = file_name.replace('.md', '').replace(prefix + '-', '')
        return 'project-' + prefix + '-' + slug
    else:
        id_prefix = DIR_ID_PREFIX.get(dir_name, dir_name)
        return id_prefix + '-' + prefix

def get_date_iso(date_str):
    """Parse date string to ISO format, handling extra text."""
    # Clean extra text like " | **阅读时长**：15 分钟"
    date_str = re.sub(r'\s*\|.*$', '', date_str).strip()
    # Try various formats
    for fmt in ['%Y-%m-%d', '%Y/%m/%d', '%Y.%m.%d']:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    return datetime(2026, 1, 1)

def build_article_list(manifest):
    """Build sorted list of articles with metadata."""
    articles = []
    for path, meta in manifest.items():
        dir_name = meta['dir']
        article_id = get_article_id(path, dir_name)

        # Clean date
        clean_date = re.sub(r'\s*\|.*$', '', meta['date']).strip()

        # Clean summary (remove markdown bold markers)
        summary = re.sub(r'\*\*', '', meta['summary'])

        articles.append({
            'id': article_id,
            'title': meta['title'],
            'summary': summary,
            'date': clean_date,
            'date_obj': get_date_iso(meta['date']),
            'category': meta['category'] or dir_name,
            'dir': dir_name
        })

    # Sort by date descending
    articles.sort(key=lambda x: x['date_obj'], reverse=True)
    return articles

def generate_rss(articles):
    """Generate rss.xml content."""
    latest_date = articles[0]['date_obj'].strftime('%a, %d %b %Y 00:00:00 +0800') if articles else datetime.now().strftime('%a, %d %b %Y 00:00:00 +0800')

    items_xml = []
    for a in articles:
        pub_date = a['date_obj'].strftime('%a, %d %b %Y 00:00:00 +0800')
        url = f"{BASE_URL}/article.html?id={a['id']}"
        items_xml.append(f"""    <item>
      <title>{xml_escape(a['title'])}</title>
      <description>{xml_escape(a['summary'] or a['title'])}</description>
      <link>{url}</link>
      <guid>{url}</guid>
      <pubDate>{pub_date}</pubDate>
      <category>{xml_escape(a['category'])}</category>
    </item>""")

    return f"""<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{SITE_TITLE}</title>
    <description>{SITE_DESC}</description>
    <link>{BASE_URL}</link>
    <atom:link href="{BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>zh-CN</language>
    <lastBuildDate>{latest_date}</lastBuildDate>
{chr(10).join(items_xml)}
  </channel>
</rss>"""

def get_file_lastmod(path):
    """Get file modification date for a static page."""
    if path == '/':
        filepath = 'index.html'
    else:
        filepath = path.lstrip('/')
    try:
        mtime = os.path.getmtime(filepath)
        return datetime.fromtimestamp(mtime).strftime('%Y-%m-%d')
    except:
        return datetime.now().strftime('%Y-%m-%d')

def generate_sitemap(articles):
    """Generate sitemap.xml content."""
    urls_xml = []

    # Static pages
    for path, changefreq, priority in PAGE_URLS:
        lastmod = get_file_lastmod(path)
        urls_xml.append(f"""  <url>
    <loc>{BASE_URL}{path}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>{changefreq}</changefreq>
    <priority>{priority}</priority>
  </url>""")

    # Article pages (all from manifest)
    for a in articles:
        lastmod = a['date_obj'].strftime('%Y-%m-%d')
        urls_xml.append(f"""  <url>
    <loc>{BASE_URL}/article.html?id={a['id']}</loc>
    <lastmod>{lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>""")

    return f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
{chr(10).join(urls_xml)}
</urlset>"""

def main():
    manifest = load_manifest()
    articles = build_article_list(manifest)

    # Generate RSS
    rss = generate_rss(articles)
    with open('rss.xml', 'w', encoding='utf-8') as f:
        f.write(rss)
    print(f'rss.xml: {len(articles)} items written')

    # Generate Sitemap
    sitemap = generate_sitemap(articles)
    with open('sitemap.xml', 'w', encoding='utf-8') as f:
        f.write(sitemap)
    print(f'sitemap.xml: 20 static pages + {len(articles)} articles written')

    # Summary
    cats = {}
    for a in articles:
        cats[a['dir']] = cats.get(a['dir'], 0) + 1
    print(f'Category breakdown: {cats}')

if __name__ == '__main__':
    main()
