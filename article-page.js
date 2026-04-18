// 文章详情页处理脚本
const ARTICLES_MAP = {
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
        const response = await fetch(articleInfo.file);
        if (!response.ok) {
            throw new Error('文章加载失败');
        }
        const content = await response.text();

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