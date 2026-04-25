// 文章详情页处理脚本
const ARTICLES_MAP = {
    // 热搜项映射
    'trending-1': {
        tag: '热搜',
        tagClass: 'tag-ai'
    },
    'trending-2': {
        tag: '热搜',
        tagClass: 'tag-ai'
    },
    'trending-3': {
        tag: '热搜',
        tagClass: 'tag-ai'
    },
    'trending-4': {
        tag: '热搜',
        tagClass: 'tag-ai'
    },
    'trending-5': {
        tag: '热搜',
        tagClass: 'tag-ai'
    },
    'trending-6': {
        tag: '热搜',
        tagClass: 'tag-ai'
    },
    'trending-7': {
        tag: '热搜',
        tagClass: 'tag-ai'
    },
    'trending-8': {
        tag: '热搜',
        tagClass: 'tag-ai'
    },
    'trending-9': {
        tag: '热搜',
        tagClass: 'tag-ai'
    },
    'trending-10': {
        tag: '热搜',
        tagClass: 'tag-ai'
    },
    'article-001': {
        file: 'weekly/weekly-package/articles/article-001-evolver-review.md',
        tag: 'AI Agent',
        tagClass: 'tag-ai'
    },
    'article-002': {
        file: 'weekly/weekly-package/articles/article-002-claude-code-game-studio.md',
        tag: '游戏开发',
        tagClass: 'tag-game'
    },
    'article-003': {
        file: 'weekly/weekly-package/articles/article-003-chinese-ai-resources.md',
        tag: 'AI 学习',
        tagClass: 'tag-ai'
    },
    'article-004': {
        file: 'weekly/weekly-package/articles/article-004-ai-privacy-concerns.md',
        tag: '隐私',
        tagClass: 'tag-resource'
    },
    'article-005': {
        file: 'weekly/weekly-package/articles/article-005-ai-tool-cost-comparison.md',
        tag: '成本分析',
        tagClass: 'tag-game'
    },
    'newbie-001': {
        file: 'data/萌新学习/001-AI名人演讲精选.md',
        tag: '名人演讲',
        tagClass: 'tag-ai'
    },
    'newbie-002': {
        file: 'data/萌新学习/002-零基础AI入门教程.md',
        tag: '热门教程',
        tagClass: 'tag-ai'
    },
    'newbie-003': {
        file: 'data/萌新学习/003-B站热门AI学习视频.md',
        tag: 'B站热门学习视频',
        tagClass: 'tag-game'
    },
    'newbie-004': {
        file: 'data/萌新学习/004-AI基本术语通俗解释.md',
        tag: '基本术语解释',
        tagClass: 'tag-resource'
    },
    'newbie-005': {
        file: 'data/萌新学习/005-AI工具使用入门指南.md',
        tag: '工具使用',
        tagClass: 'tag-ai'
    },
    'newbie-006': {
        file: 'data/萌新学习/006-AI效率提升文档处理数据整理.md',
        tag: 'AI效率提升',
        tagClass: 'tag-game'
    },
    'money-001': {
        file: 'data/搞钱排行/001-AI自媒体月入过万.md',
        tag: '自媒体',
        tagClass: 'tag-ai'
    },
    'money-002': {
        file: 'data/搞钱排行/002-AI自由职业接单.md',
        tag: '自由职业',
        tagClass: 'tag-game'
    },
    'money-003': {
        file: 'data/搞钱排行/003-AI知识付费.md',
        tag: '知识付费',
        tagClass: 'tag-resource'
    },
    'money-004': {
        file: 'data/搞钱排行/004-AI电商带货.md',
        tag: '电商',
        tagClass: 'tag-ai'
    },
    'money-005': {
        file: 'data/搞钱排行/005-AI短视频带货.md',
        tag: '短视频',
        tagClass: 'tag-game'
    },
    'money-006': {
        file: 'data/搞钱排行/006-AI工具开发.md',
        tag: '技术开发',
        tagClass: 'tag-resource'
    },
    'creative-001': {
        file: 'data/AI创意/001-AI绘画数字艺术.md',
        tag: 'AI绘画',
        tagClass: 'tag-ai'
    },
    'creative-002': {
        file: 'data/AI创意/002-AI音乐创作.md',
        tag: 'AI音乐',
        tagClass: 'tag-game'
    },
    'creative-003': {
        file: 'data/AI创意/003-AI短视频制作.md',
        tag: 'AI视频',
        tagClass: 'tag-resource'
    },
    'creative-004': {
        file: 'data/AI创意/004-AI辅助写作.md',
        tag: 'AI写作',
        tagClass: 'tag-ai'
    },
    'creative-005': {
        file: 'data/AI创意/005-AI设计UI界面.md',
        tag: 'AI设计',
        tagClass: 'tag-game'
    },
    'creative-006': {
        file: 'data/AI创意/006-AI游戏开发.md',
        tag: 'AI游戏',
        tagClass: 'tag-resource'
    },
    'case-001': {
        file: 'data/实战案例/001-AI客服降本增效.md',
        tag: '企业应用',
        tagClass: 'tag-ai'
    },
    'case-002': {
        file: 'data/实战案例/002-AI教育提分.md',
        tag: '教育领域',
        tagClass: 'tag-game'
    },
    'case-003': {
        file: 'data/实战案例/003-AI自媒体涨粉.md',
        tag: '内容创作',
        tagClass: 'tag-resource'
    },
    'case-004': {
        file: 'data/实战案例/004-AI医疗诊断.md',
        tag: '医疗健康',
        tagClass: 'tag-ai'
    },
    'case-005': {
        file: 'data/实战案例/005-AI跨境电商.md',
        tag: '电商零售',
        tagClass: 'tag-game'
    },
    'case-006': {
        file: 'data/实战案例/006-AI个人效率.md',
        tag: '个人效率',
        tagClass: 'tag-resource'
    },
    'literature-001': {
        file: 'data/AI写作/001-用AI写第一篇小说.md',
        tag: '小说创作',
        tagClass: 'tag-ai'
    },
    'literature-002': {
        file: 'data/AI写作/002-AI辅助文案创作.md',
        tag: '文案创作',
        tagClass: 'tag-game'
    },
    'literature-003': {
        file: 'data/AI写作/003-用AI写搞笑段子.md',
        tag: '幽默段子',
        tagClass: 'tag-resource'
    },
    'literature-004': {
        file: 'data/AI写作/004-AI诗词创作指南.md',
        tag: '诗词创作',
        tagClass: 'tag-ai'
    },
    'literature-005': {
        file: 'data/AI写作/005-AI辅助写杂文随笔.md',
        tag: '杂文随笔',
        tagClass: 'tag-game'
    },
    'literature-006': {
        file: 'data/AI写作/006-AI辅助剧本创作入门.md',
        tag: '剧本创作',
        tagClass: 'tag-resource'
    }
};

function getArticleIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || 'article-001';
}

function parseMarkdown(md) {
    let html = md;

    html = html.replace(/^# (.+)$/gm, '<h1 class="article-title">$1</h1>');

    html = html.replace(/^## (.+)$/gm, '<h2 class="article-section-title">$1</h2>');

    html = html.replace(/^### (.+)$/gm, '<h3 class="article-subsection-title">$1</h3>');

    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre class="code-block"><code class="code-content">${escapeHtml(code.trim())}</code></pre>`;
    });

    html = html.replace(/\|(.+)\|/gm, (match) => {
        const cells = match.split('|').filter(c => c.trim());
        if (cells.every(c => c.trim().match(/^-+$/))) {
            return '';
        }
        const isHeader = cells.some(c => c.trim().match(/^[\w\s]+$/));
        const cellTag = isHeader ? 'th' : 'td';
        const rowClass = isHeader ? 'table-header' : '';
        const row = cells.map(c => `<${cellTag}>${c.trim()}</${cellTag}>`).join('');
        return `<tr class="${rowClass}">${row}</tr>`;
    });

    html = html.replace(/(<tr[\s\S]*?<\/tr>)+/g, (match) => {
        return `<table class="article-table">${match}</table>`;
    });

    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="article-image">');

    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="article-link">$1</a>');

    html = html.replace(/^---$/gm, '<hr class="article-divider">');

    html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="article-list-item">$2</li>');

    html = html.replace(/^[-*] (.+)$/gm, '<li class="article-list-item">$1</li>');

    html = html.replace(/(<li[\s\S]*?<\/li>)+/g, (match) => {
        return `<ul class="article-list">${match}</ul>`;
    });

    html = html.replace(/^> (.+)$/gm, '<blockquote class="article-quote">$1</blockquote>');

    html = html.replace(/^#### (.+)$/gm, '<h4 class="article-h4">$1</h4>');

    html = html.replace(/^##### (.+)$/gm, '<h5 class="article-h5">$1</h5>');

    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre class="code-block"><code class="code-content">${escapeHtml(code.trim())}</code></pre>`;
    });

    return html;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function renderArticle(articleData, content) {
    const articleContent = document.getElementById('articleContent');
    const articleTag = document.getElementById('articleTag');
    const articleDate = document.getElementById('articleDate');

    articleTag.textContent = articleData.tag;
    articleTag.className = `article-tag ${articleData.tagClass}`;
    articleDate.textContent = articleData.date || '';

    const parsedHtml = parseMarkdown(content);
    articleContent.innerHTML = `<div class="article-body">${parsedHtml}</div>`;

    document.title = `${articleData.title || '文章详情'} - AI 萌新小窝`;

    const metaDesc = articleContent.querySelector('.article-body p');
    if (metaDesc) {
        document.querySelector('meta[name="description"]').content = metaDesc.textContent.substring(0, 160);
    }
}

function updateNextArticle(currentId) {
    const ids = Object.keys(ARTICLES_MAP);
    const currentIndex = ids.indexOf(currentId);
    const nextIndex = (currentIndex + 1) % ids.length;
    const nextId = ids[nextIndex];

    const nextArticleLink = document.getElementById('nextArticle');
    if (nextArticleLink) {
        nextArticleLink.href = `article.html?id=${nextId}`;
        nextArticleLink.querySelector('span:last-child').textContent = ARTICLES_MAP[nextId].tag;
    }
}

// 从热搜排行文档中提取指定项的内容
async function getTrendingItemContent(index) {
    try {
        // 直接尝试读取今天的文件
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const latestFileName = `hot-search-${dateStr}.md`;
        
        let fileResponse = await fetch(`data/热搜排行/${latestFileName}`);
        
        // 如果今天的文件不存在，尝试获取目录中的最新文件
        if (!fileResponse.ok) {
            const dirResponse = await fetch('data/热搜排行/');
            if (dirResponse.ok) {
                const html = await dirResponse.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                
                // 提取所有.md文件链接
                const links = doc.querySelectorAll('a[href$=".md"]');
                const mdFiles = [];
                
                links.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href) {
                        const fileName = href.split('/').pop();
                        if (fileName.endsWith('.md')) {
                            mdFiles.push(fileName);
                        }
                    }
                });
                
                // 按文件名排序，找出最新的文件
                mdFiles.sort((a, b) => {
                    const dateA = a.match(/\d{4}-\d{2}-\d{2}/);
                    const dateB = b.match(/\d{4}-\d{2}-\d{2}/);
                    
                    if (dateA && dateB) {
                        return new Date(dateB[0]) - new Date(dateA[0]);
                    }
                    return 0;
                });
                
                if (mdFiles.length > 0) {
                    const latestFile = mdFiles[0];
                    fileResponse = await fetch(`data/热搜排行/${latestFile}`);
                } else {
                    throw new Error('没有找到热搜排行文件');
                }
            } else {
                throw new Error('无法访问热搜排行目录');
            }
        }
        
        if (fileResponse.ok) {
            const content = await fileResponse.text();
            const lines = content.split('\n');
            let inTrendingSection = false;
            let currentItemIndex = 0;
            let itemContent = [];
            let captureContent = false;
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                
                if (line.trim() === '## 🔥 今日热搜 TOP 10') {
                    inTrendingSection = true;
                    continue;
                }
                
                if (inTrendingSection && line.trim().startsWith('### ')) {
                    const itemMatch = line.match(/### (\d+)️⃣/);
                    if (itemMatch) {
                        currentItemIndex = parseInt(itemMatch[1]);
                        
                        if (currentItemIndex === index) {
                            captureContent = true;
                            itemContent.push(line);
                        } else if (captureContent) {
                            // 已经捕获到目标项的内容，遇到下一个项时停止
                            break;
                        }
                    }
                } else if (captureContent) {
                    // 捕获目标项的内容
                    itemContent.push(line);
                    
                    // 如果遇到分隔线且不是第一项，停止捕获
                    if (line.trim() === '---' && currentItemIndex > 1) {
                        break;
                    }
                }
            }
            
            if (itemContent.length > 0) {
                // 提取文档的标题和元信息
                const titleMatch = content.match(/^# (.+)$/m);
                const dateMatch = content.match(/\*\*发布时间\*\*[：:]\s*(\d{4}-\d{2}-\d{2})/);
                
                let result = '';
                if (titleMatch) {
                    result += `# ${titleMatch[1]}\n\n`;
                }
                if (dateMatch) {
                    result += `**发布时间**：${dateMatch[1]}\n\n`;
                }
                result += itemContent.join('\n');
                
                return result;
            } else {
                throw new Error('未找到指定的热搜项');
            }
        } else {
            throw new Error('无法加载热搜排行文件');
        }
    } catch (error) {
        console.error('获取热搜项内容失败:', error);
        throw error;
    }
}

async function loadArticle() {
    const articleId = getArticleIdFromUrl();
    const articleInfo = ARTICLES_MAP[articleId];

    if (!articleInfo) {
        document.getElementById('articleContent').innerHTML = `
            <div class="article-error">
                <h2>文章未找到</h2>
                <p>抱歉，您访问的文章不存在或已被删除。</p>
                <a href="index.html" class="error-link">返回首页</a>
            </div>
        `;
        return;
    }

    try {
        let content;
        
        // 处理热搜项
        if (articleId.startsWith('trending-')) {
            const index = parseInt(articleId.split('-')[1]);
            content = await getTrendingItemContent(index);
        } else if (articleInfo.file) {
            // 处理普通文章
            const response = await fetch(articleInfo.file);
            if (!response.ok) {
                throw new Error('文章加载失败');
            }
            content = await response.text();
        } else {
            throw new Error('文章信息不完整');
        }

        const titleMatch = content.match(/^# (.+)$/m);
        if (titleMatch) {
            articleInfo.title = titleMatch[1];
        }

        const dateMatch = content.match(/\*\*发布时间\*\*[：:]\s*(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
            articleInfo.date = dateMatch[1];
        }

        renderArticle(articleInfo, content);
        updateNextArticle(articleId);
    } catch (error) {
        console.error('加载文章失败:', error);
        document.getElementById('articleContent').innerHTML = `
            <div class="article-error">
                <h2>加载失败</h2>
                <p>无法加载文章内容，请稍后重试。</p>
                <a href="index.html" class="error-link">返回首页</a>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', loadArticle);