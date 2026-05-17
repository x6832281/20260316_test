// 文章详情页处理脚本
const ARTICLES_MAP = {
    'project-001-awesome-chatgpt-prompts': {
        tag: '精选项目',
        tagClass: 'tag-ai'
    },
    'project-002-awesome-python': {
        tag: '精选项目',
        tagClass: 'tag-ai'
    },
    'project-003-awesome-ai': {
        tag: '精选项目',
        tagClass: 'tag-ai'
    },
    'project-004-stable-diffusion-webui': {
        tag: '精选项目',
        tagClass: 'tag-ai'
    },
    'project-005-LangChain': {
        tag: '精选项目',
        tagClass: 'tag-ai'
    },
    'project-006-llama.cpp': {
        tag: '精选项目',
        tagClass: 'tag-ai'
    },
    'newbie-001': {
        file: 'data/萌新学习/001-数字生命卡兹克-AI写作心法与去AI味技巧.md',
        tag: '博主教程',
        tagClass: 'tag-ai'
    },
    'newbie-002': {
        file: 'data/萌新学习/002-秋芝与宝玉-AI工具避坑与提示词调教指南.md',
        tag: '博主教程',
        tagClass: 'tag-ai'
    },
    'newbie-003': {
        file: 'data/萌新学习/003-林亦LYi与武彬-AI创作灵感与商业写作思维.md',
        tag: '博主教程',
        tagClass: 'tag-ai'
    },
    'newbie-004': {
        file: 'data/萌新学习/004-AI写作达人合集-世界观构建与故事内核.md',
        tag: '博主教程',
        tagClass: 'tag-ai'
    },
    'newbie-005': {
        file: 'data/萌新学习/005-AI辅助网文写作-从大纲到连载的完整指南.md',
        tag: '网文写作',
        tagClass: 'tag-ai'
    },
    'newbie-006': {
        file: 'data/萌新学习/006-AI写作变现指南-从爱好到副业的进阶之路.md',
        tag: '写作变现',
        tagClass: 'tag-ai'
    },
    'newbie-007': {
        file: 'data/萌新学习/007-AI拆书入门-从读过到读懂的第一步.md',
        tag: '拆书入门',
        tagClass: 'tag-ai'
    },
    'newbie-008': {
        file: 'data/萌新学习/008-写作新手的第一篇AI辅助文章-从零到发布的完整流程.md',
        tag: '实战教程',
        tagClass: 'tag-ai'
    },
    'newbie-009': {
        file: 'data/萌新学习/009-去AI味核心方法论-识别与消除AI写作的六大特征.md',
        tag: '去AI味',
        tagClass: 'tag-ai'
    },
    'newbie-010': {
        file: 'data/萌新学习/010-去AI味实战-Prompt调教技巧大全.md',
        tag: '去AI味',
        tagClass: 'tag-ai'
    },
    'newbie-011': {
        file: 'data/萌新学习/011-去AI味进阶-文体风格控制与人味注入.md',
        tag: '去AI味',
        tagClass: 'tag-ai'
    },
    'newbie-012': {
        file: 'data/萌新学习/012-去AI味案例集-从AI味到人味的改写对比.md',
        tag: '去AI味',
        tagClass: 'tag-ai'
    },
    'newbie-013': {
        file: 'data/萌新学习/013-去AI味工具箱-各平台去AI味技巧汇总.md',
        tag: '去AI味',
        tagClass: 'tag-ai'
    },
    'deai-001': {
        file: 'data/去AI味/001-去AI味Prompt模板库.md',
        tag: '去AI味',
        tagClass: 'tag-ai'
    },
    'deai-002': {
        file: 'data/去AI味/002-AI高频词与表达词典.md',
        tag: '去AI味',
        tagClass: 'tag-ai'
    },
    'deai-003': {
        file: 'data/去AI味/003-2026去AI味最新技巧速递.md',
        tag: '去AI味',
        tagClass: 'tag-ai'
    },
    'deai-004': {
        file: 'data/去AI味/004-AI味vs人味对比案例集.md',
        tag: '去AI味',
        tagClass: 'tag-ai'
    },
    'deai-005': {
        file: 'data/去AI味/005-去AI味终极指南.md',
        tag: '去AI味',
        tagClass: 'tag-ai'
    },
    'deai-006': {
        file: 'data/去AI味/006-2026年AI检测工具与反检测策略.md',
        tag: '去AI味',
        tagClass: 'tag-ai'
    },
    'deai-007': {
        file: 'data/去AI味/007-学术论文去AI味实战指南.md',
        tag: '去AI味',
        tagClass: 'tag-ai'
    },
    'deai-008': {
        file: 'data/去AI味/008-自媒体文案去AI味全攻略.md',
        tag: '去AI味',
        tagClass: 'tag-ai'
    },
    'deai-009': {
        file: 'data/去AI味/009-Claude4-GPT5去AI味新方法.md',
        tag: '去AI味',
        tagClass: 'tag-ai'
    },
    'deai-010': {
        file: 'data/去AI味/010-去AI味常见误区与避坑指南.md',
        tag: '去AI味',
        tagClass: 'tag-ai'
    },
    'book-analysis-001': {
        file: 'data/拆书心得/001-呼兰河传-祖父的园子-童年书写与自然意象.md',
        tag: '拆书心得',
        tagClass: 'tag-ai'
    },
    'book-analysis-002': {
        file: 'data/拆书心得/002-呼兰河传-大泥坑-环境叙事与群像刻画.md',
        tag: '拆书心得',
        tagClass: 'tag-ai'
    },
    'book-analysis-003': {
        file: 'data/拆书心得/003-呼兰河传-小团圆媳妇之死-封建礼教吃人实录.md',
        tag: '拆书心得',
        tagClass: 'tag-ai'
    },
    'book-analysis-004': {
        file: 'data/拆书心得/004-呼兰河传-看客群像-冷漠的社会心理学.md',
        tag: '拆书心得',
        tagClass: 'tag-ai'
    },
    'book-analysis-005': {
        file: 'data/拆书心得/005-呼兰河传-冯歪嘴子-底层生命的韧性.md',
        tag: '拆书心得',
        tagClass: 'tag-ai'
    },
    'book-analysis-006': {
        file: 'data/拆书心得/006-呼兰河传-儿童视角与留白艺术.md',
        tag: '拆书心得',
        tagClass: 'tag-ai'
    },
    'book-analysis-007': {
        file: 'data/拆书心得/007-红楼梦-黛玉葬花-中国文学最伟大的独白.md',
        tag: '红楼梦',
        tagClass: 'tag-ai'
    },
    'book-analysis-008': {
        file: 'data/拆书心得/008-红楼梦-刘姥姥进大观园-喜剧外壳下的残酷内核.md',
        tag: '红楼梦',
        tagClass: 'tag-ai'
    },
    'book-analysis-009': {
        file: 'data/拆书心得/009-红楼梦-宝钗扑蝶-完美人设的裂缝.md',
        tag: '红楼梦',
        tagClass: 'tag-ai'
    },
    'book-analysis-010': {
        file: 'data/拆书心得/010-红楼梦-王熙凤出场-未见其人先闻其声的叙事革命.md',
        tag: '红楼梦',
        tagClass: 'tag-ai'
    },
    'book-analysis-011': {
        file: 'data/拆书心得/011-红楼梦-宝玉挨打-父权暴力的全息投影.md',
        tag: '红楼梦',
        tagClass: 'tag-ai'
    },
    'book-analysis-012': {
        file: 'data/拆书心得/012-红楼梦-晴雯撕扇-尊严比扇子贵.md',
        tag: '红楼梦',
        tagClass: 'tag-ai'
    },
    'book-analysis-013': {
        file: 'data/拆书心得/013-活着-福贵买牛-极简叙事的终极力量.md',
        tag: '活着',
        tagClass: 'tag-ai'
    },
    'book-analysis-014': {
        file: 'data/拆书心得/014-活着-有庆之死-荒诞比残忍更残忍.md',
        tag: '活着',
        tagClass: 'tag-ai'
    },
    'book-analysis-015': {
        file: 'data/拆书心得/015-活着-家珍-沉默的重量.md',
        tag: '活着',
        tagClass: 'tag-ai'
    },
    'book-analysis-016': {
        file: 'data/拆书心得/016-活着-苦根之死-最后一根稻草的荒诞.md',
        tag: '活着',
        tagClass: 'tag-ai'
    },
    'book-analysis-017': {
        file: 'data/拆书心得/017-百年孤独-开头-一句话改写了小说史.md',
        tag: '百年孤独',
        tagClass: 'tag-ai'
    },
    'book-analysis-018': {
        file: 'data/拆书心得/018-百年孤独-丽贝卡吃土-孤独的味觉.md',
        tag: '百年孤独',
        tagClass: 'tag-ai'
    },
    'book-analysis-019': {
        file: 'data/拆书心得/019-百年孤独-末尾-羊皮卷的预言与宿命的闭环.md',
        tag: '百年孤独',
        tagClass: 'tag-ai'
    },
    'book-analysis-020': {
        file: 'data/拆书心得/020-AI拆书方法论上-让AI成为你的文学导师.md',
        tag: 'AI拆书方法论',
        tagClass: 'tag-ai'
    },
    'book-analysis-021': {
        file: 'data/拆书心得/021-AI拆书方法论下-5个实战Prompt模板.md',
        tag: 'AI拆书方法论',
        tagClass: 'tag-ai'
    },
    'book-analysis-022': {
        file: 'data/拆书心得/022-围城-方鸿渐的假文凭-知识分子的虚荣与自卑.md',
        tag: '围城',
        tagClass: 'tag-ai'
    },
    'book-analysis-023': {
        file: 'data/拆书心得/023-围城-结尾-那只老钟的隐喻.md',
        tag: '围城',
        tagClass: 'tag-ai'
    },
    'book-analysis-024': {
        file: 'data/拆书心得/024-三体-黑暗森林法则-宇宙社会学的冷酷逻辑.md',
        tag: '三体',
        tagClass: 'tag-ai'
    },
    'book-analysis-025': {
        file: 'data/拆书心得/025-三体-面壁计划-人类最后的博弈.md',
        tag: '三体',
        tagClass: 'tag-ai'
    },
    'book-analysis-026': {
        file: 'data/拆书心得/026-平凡的世界-孙少平的苦难美学-路遥的生命哲学.md',
        tag: '平凡的世界',
        tagClass: 'tag-ai'
    },
    'littheory-001': {
        file: 'data/文学理论/001-叙事学入门.md',
        tag: '文学理论',
        tagClass: 'tag-ai'
    },
    'littheory-002': {
        file: 'data/文学理论/002-结构主义.md',
        tag: '文学理论',
        tagClass: 'tag-ai'
    },
    'littheory-003': {
        file: 'data/文学理论/003-读者批评理论.md',
        tag: '文学理论',
        tagClass: 'tag-ai'
    },
    'littheory-004': {
        file: 'data/文学理论/004-女性主义文学批评.md',
        tag: '文学理论',
        tagClass: 'tag-ai'
    },
    'littheory-005': {
        file: 'data/文学理论/005-后现代主义文学理论.md',
        tag: '文学理论',
        tagClass: 'tag-ai'
    },
    'littheory-006': {
        file: 'data/文学理论/006-比较文学.md',
        tag: '文学理论',
        tagClass: 'tag-ai'
    },
    'book-excerpt-001': {
        file: 'data/书摘文案/001-经典书摘.md',
        tag: '书摘文案',
        tagClass: 'tag-ai'
    },
    'book-excerpt-002': {
        file: 'data/书摘文案/002-名人名言.md',
        tag: '书摘文案',
        tagClass: 'tag-ai'
    },
    'book-excerpt-003': {
        file: 'data/书摘文案/003-经典书评.md',
        tag: '书摘文案',
        tagClass: 'tag-ai'
    },
    'book-excerpt-004': {
        file: 'data/书摘文案/004-微信读书高赞划线.md',
        tag: '书摘文案',
        tagClass: 'tag-ai'
    },
    'book-excerpt-005': {
        file: 'data/书摘文案/005-网络热梗与流行语.md',
        tag: '书摘文案',
        tagClass: 'tag-ai'
    },
    'book-excerpt-006': {
        file: 'data/书摘文案/006-抖音小红书高赞文案.md',
        tag: '书摘文案',
        tagClass: 'tag-ai'
    },
    'knowledge-001-gpt-academic': {
        file: 'data/知识创作/001-gpt-academic.md',
        tag: '知识创作',
        tagClass: 'tag-ai'
    },
    'knowledge-002-langchain': {
        file: 'data/知识创作/002-langchain.md',
        tag: '知识创作',
        tagClass: 'tag-ai'
    },
    'knowledge-003-lobe-chat': {
        file: 'data/知识创作/003-lobe-chat.md',
        tag: '知识创作',
        tagClass: 'tag-ai'
    },
    'knowledge-004-chatgpt-next-web': {
        file: 'data/知识创作/004-chatgpt-next-web.md',
        tag: '知识创作',
        tagClass: 'tag-ai'
    },
    'knowledge-005-dify': {
        file: 'data/知识创作/005-dify.md',
        tag: '知识创作',
        tagClass: 'tag-ai'
    },
    'knowledge-006-open-interpreter': {
        file: 'data/知识创作/006-open-interpreter.md',
        tag: '知识创作',
        tagClass: 'tag-ai'
    },
    'knowledge-007-chatpaper': {
        file: 'data/知识创作/007-chatpaper.md',
        tag: '知识创作',
        tagClass: 'tag-ai'
    },
    'knowledge-008-ollama': {
        file: 'data/知识创作/008-ollama.md',
        tag: '知识创作',
        tagClass: 'tag-ai'
    },
    'knowledge-009-anything-llm': {
        file: 'data/知识创作/009-anything-llm.md',
        tag: '知识创作',
        tagClass: 'tag-ai'
    },
    'knowledge-010-fastgpt': {
        file: 'data/知识创作/010-fastgpt.md',
        tag: '知识创作',
        tagClass: 'tag-ai'
    },
    'knowledge-011-prompt-engineering': {
        file: 'data/知识创作/011-prompt-engineering.md',
        tag: '知识创作',
        tagClass: 'tag-ai'
    },
    'knowledge-012-toolchain': {
        file: 'data/知识创作/012-toolchain.md',
        tag: '知识创作',
        tagClass: 'tag-ai'
    },
    'knowledge-013-ecosystem': {
        file: 'data/知识创作/013-ecosystem.md',
        tag: '知识创作',
        tagClass: 'tag-ai'
    },
    'knowledge-014-ai-writing-guide': {
        file: 'data/知识创作/014-ai-writing-guide.md',
        tag: '知识创作',
        tagClass: 'tag-ai'
    },
    'knowledge-015-content-matrix': {
        file: 'data/知识创作/015-content-matrix.md',
        tag: '知识创作',
        tagClass: 'tag-ai'
    },
};

function getArticleIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || 'article-001';
}

function parseMarkdown(md) {
    let html = md;

    html = html.replace(/^# (.+)$/gm, (m, t) => `<h1 class="article-title">${escapeHtml(t)}</h1>`);

    html = html.replace(/^## (.+)$/gm, (m, t) => `<h2 class="article-section-title">${escapeHtml(t)}</h2>`);

    html = html.replace(/^### (.+)$/gm, (m, t) => `<h3 class="article-subsection-title">${escapeHtml(t)}</h3>`);

    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        return `<pre class="code-block"><code class="code-content">${escapeHtml(code.trim())}</code></pre>`;
    });

    // Bold before italic to avoid `*` inside `**` being partially matched
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/(?<!\*)\*(?!\*)([^*]+)(?<!\*)\*(?!\*)/g, '<em>$1</em>');

    // Inline code (after bold/italic so `**code**` isn't broken)
    html = html.replace(/`([^`]+)`/g, (match, code) => `<code>${escapeHtml(code)}</code>`);

    // Process tables as multi-line blocks (first non-separator row = header)
    html = html.replace(/(?:^\|.+\|$\n?)+/gm, (tableBlock) => {
        const rows = tableBlock.trim().split('\n');
        let tbl = '<table class="article-table">';
        let header = true;
        for (const row of rows) {
            const cells = row.split('|').filter(c => c.trim());
            if (cells.every(c => /^-+$/.test(c.trim()))) continue;
            const tag = header ? 'th' : 'td';
            header = false;
            tbl += '<tr>' + cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('') + '</tr>';
        }
        tbl += '</table>';
        return tbl;
    });

    // Escape alt text and link text to prevent XSS
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
        return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" class="article-image">`;
    });

    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, href) => {
        return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener" class="article-link">${escapeHtml(text)}</a>`;
    });

    html = html.replace(/^---$/gm, '<hr class="article-divider">');

    // 有序列表 - 先标记为 ol-item
    html = html.replace(/^(\d+)\. (.+)$/gm, '<li class="article-list-item ol-item">$2</li>');

    // 无序列表
    html = html.replace(/^[-*] (.+)$/gm, '<li class="article-list-item ul-item">$1</li>');

    // 有序列表项包裹在 <ol> 中
    html = html.replace(/(<li class="article-list-item ol-item">[\s\S]*?<\/li>)+/g, (match) => {
        return `<ol class="article-list">${match.replace(/ ol-item/g, '')}</ol>`;
    });

    // 无序列表项包裹在 <ul> 中
    html = html.replace(/(<li class="article-list-item(?: ul-item)?">[\s\S]*?<\/li>)+/g, (match) => {
        return `<ul class="article-list">${match.replace(/ ul-item/g, '')}</ul>`;
    });

    html = html.replace(/^> (.+)$/gm, (m, t) => `<blockquote class="article-quote">${escapeHtml(t)}</blockquote>`);

    html = html.replace(/^#### (.+)$/gm, (m, t) => `<h4 class="article-h4">${escapeHtml(t)}</h4>`);

    html = html.replace(/^##### (.+)$/gm, (m, t) => `<h5 class="article-h5">${escapeHtml(t)}</h5>`);

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

    const articleId = getArticleIdFromUrl();
    const title = articleData.title || extractFirstHeading(content) || '文章详情';
    const description = extractDescription(content) || articleData.tag || 'AI写作教程与拆书心得';
    
    if (typeof SeoManager !== 'undefined') {
        SeoManager.injectArticleSeo({
            id: articleId,
            title: title,
            description: description,
            tags: [articleData.tag],
            publishDate: articleData.date || new Date().toISOString().split('T')[0],
            imageUrl: articleData.imageUrl || null
        });
        SeoManager.addReadingTime(articleContent);
    } else {
        document.title = `${title} - AI 萌新小窝`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.content = description.substring(0, 160);
    }
    const h1El = document.getElementById('articleH1');
    if (h1El) h1El.textContent = title;

    // 加载相关文章推荐
    loadRelatedArticles(articleId, articleData.tag);
}

function extractFirstHeading(content) {
    const match = content.match(/^# (.+)$/m);
    return match ? match[1] : '';
}

function extractDescription(content) {
    const lines = content.split('\n');
    for (const line of lines) {
        const text = line.replace(/[*_#>`]/g, '').trim();
        if (text.length > 20 && text.length < 200) {
            return text;
        }
    }
    return content.substring(0, 150);
}

function updateNextArticle(currentId) {
    const ids = Object.keys(ARTICLES_MAP);
    const currentIndex = ids.indexOf(currentId);
    if (currentIndex === -1) return;

    // 上一篇
    const prevIndex = (currentIndex - 1 + ids.length) % ids.length;
    const prevId = ids[prevIndex];
    const prevLink = document.getElementById('prevArticle');
    if (prevLink) {
        prevLink.href = `article.html?id=${prevId}`;
        prevLink.querySelector('span:last-child').textContent = ARTICLES_MAP[prevId].tag;
    }

    // 下一篇
    const nextIndex = (currentIndex + 1) % ids.length;
    const nextId = ids[nextIndex];
    const nextLink = document.getElementById('nextArticle');
    if (nextLink) {
        nextLink.href = `article.html?id=${nextId}`;
        nextLink.querySelector('span:last-child').textContent = ARTICLES_MAP[nextId].tag;
    }
}

// 加载相关文章推荐
function loadRelatedArticles(currentId, currentTag) {
    const grid = document.getElementById('relatedArticlesGrid');
    if (!grid) return;

    // 相关类别映射
    const RELATED_CATS = {
        '去AI味': ['萌新学习'],
        '萌新学习': ['去AI味'],
        '拆书心得': ['文学理论', '书摘文案'],
        '文学理论': ['拆书心得'],
        '知识创作': ['萌新学习'],
        '书摘文案': ['拆书心得', '文学理论']
    };

    const relatedCats = RELATED_CATS[currentTag] || [];
    const entries = Object.entries(ARTICLES_MAP).filter(([id]) => id !== currentId);

    // 优先：同标签 > 相关类别 > 其他
    const sameTag = entries.filter(([, d]) => d.tag === currentTag);
    const relatedTag = entries.filter(([, d]) => d.tag !== currentTag && relatedCats.includes(d.tag));
    const others = entries.filter(([, d]) => d.tag !== currentTag && !relatedCats.includes(d.tag));

    const related = [...sameTag, ...relatedTag, ...others].slice(0, 6);

    if (related.length === 0) {
        document.getElementById('relatedArticles').style.display = 'none';
        return;
    }

    grid.innerHTML = related.map(([id, data]) => `
        <a href="article.html?id=${id}" style="display: block; padding: 16px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-md); text-decoration: none; transition: all 0.2s;">
            <span style="display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; background: rgba(55,170,170,0.1); color: var(--accent-primary); margin-bottom: 8px;">${data.tag}</span>
            <div style="color: var(--text-secondary); font-size: 13px;">查看详情 →</div>
        </a>
    `).join('');
}


async function loadArticle() {
    const articleId = getArticleIdFromUrl();
    const articleInfo = ARTICLES_MAP[articleId];

    if (!articleInfo) {
        
        // 动态处理萌新学习
        if (articleId.startsWith('newbie-')) {
            try {
                console.log('Loading newbie learning article:', articleId);
                const params = new URLSearchParams(window.location.search);
                const fileName = params.get('file');
                
                if (fileName) {
                    const fileResponse = await fetch(`data/萌新学习/${fileName}`);
                    if (fileResponse.ok) {
                        const content = await fileResponse.text();
                        const titleMatch = content.match(/^# (.+)$/m);
                        const dateMatch = content.match(/\*\*发布时间\*\*[：:]\s*(\d{4}-\d{2}-\d{2})/);
                        const summaryMatch = content.match(/## 📌 一句话总结\s*\n\s*\n\*\*(.+?)\*\*/);
                        
                        const prefix = articleId.replace('newbie-', '');
                        const categoryMap = {
                            '001': '博主教程', '002': '博主教程',
                            '003': '博主教程', '004': '博主教程'
                        };

                        renderArticle({
                            tag: categoryMap[prefix] || '萌新学习',
                            tagClass: 'tag-ai',
                            title: titleMatch ? titleMatch[1] : '',
                            date: dateMatch ? dateMatch[1] : ''
                        }, content);
                        updateNextArticle(articleId);
                        return;
                    }
                }
                
                const dirResponse = await fetch('data/萌新学习/');
                if (dirResponse.ok) {
                    const html = await dirResponse.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const links = doc.querySelectorAll('a[href$=".md"]');
                    const mdFiles = [];
                    
                    links.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href) {
                            const name = decodeURIComponent(href.split('/').pop());
                            if (name.endsWith('.md')) {
                                mdFiles.push(name);
                            }
                        }
                    });
                    
                    mdFiles.sort();
                    
                    const prefix = articleId.replace('newbie-', '');
                    const targetFile = mdFiles.find(f => f.startsWith(prefix));
                    
                    if (targetFile) {
                        const fileResponse = await fetch(`data/萌新学习/${encodeURIComponent(targetFile)}`);
                        if (fileResponse.ok) {
                            const content = await fileResponse.text();
                            const titleMatch = content.match(/^# (.+)$/m);
                            const dateMatch = content.match(/\*\*发布时间\*\*[：:]\s*(\d{4}-\d{2}-\d{2})/);
                            
                            const categoryMap = {
                                '001': '博主教程', '002': '博主教程',
                                '003': '博主教程', '004': '博主教程'
                            };

                            renderArticle({
                                tag: categoryMap[prefix] || '萌新学习',
                                tagClass: 'tag-ai',
                                title: titleMatch ? titleMatch[1] : '',
                                date: dateMatch ? dateMatch[1] : ''
                            }, content);
                            updateNextArticle(articleId);
                            return;
                        }
                    }
                }
            } catch (error) {
                console.error('加载萌新学习文章失败:', error);
            }
        }
        
        
        // 动态处理书摘文案 (book-excerpt-*)
        if (articleId.startsWith('book-excerpt-')) {
            try {
                console.log('Loading book excerpt article:', articleId);
                const params = new URLSearchParams(window.location.search);
                const filePath = params.get('file');
                
                if (filePath) {
                    console.log('Loading from file param:', filePath);
                    const fileResponse = await fetch(filePath);
                    if (fileResponse.ok) {
                        const content = await fileResponse.text();
                        const titleMatch = content.match(/^# (.+)$/m);
                        const dateMatch = content.match(/\*\*发布时间\*\*[：:]\s*(\d{4}-\d{2}-\d{2})/);

                        renderArticle({
                            tag: '书摘文案',
                            tagClass: 'tag-ai',
                            title: titleMatch ? titleMatch[1] : '',
                            date: dateMatch ? dateMatch[1] : ''
                        }, content);
                        updateNextArticle(articleId);
                        return;
                    }
                }
                
                // 从目录加载
                const dirResponse = await fetch('data/书摘文案/');
                if (dirResponse.ok) {
                    const html = await dirResponse.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const links = doc.querySelectorAll('a[href$=".md"]');
                    const mdFiles = [];
                    
                    links.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href) {
                            const name = decodeURIComponent(href.split('/').pop());
                            if (name.endsWith('.md')) {
                                mdFiles.push(name);
                            }
                        }
                    });
                    
                    mdFiles.sort();
                    
                    const idNum = articleId.replace('book-excerpt-', '').replace(/[^0-9]/g, '');
                    const prefix = idNum.padStart(3, '0') || '001';
                    const targetFile = mdFiles.find(f => f.startsWith(prefix));
                    
                    if (targetFile) {
                        const fileResponse = await fetch(`data/书摘文案/${encodeURIComponent(targetFile)}`);
                        if (fileResponse.ok) {
                            const content = await fileResponse.text();
                            const titleMatch = content.match(/^# (.+)$/m);
                            const dateMatch = content.match(/\*\*发布时间\*\*[：:]\s*(\d{4}-\d{2}-\d{2})/);

                            renderArticle({
                                tag: '书摘文案',
                                tagClass: 'tag-ai',
                                title: titleMatch ? titleMatch[1] : '',
                                date: dateMatch ? dateMatch[1] : ''
                            }, content);
                            updateNextArticle(articleId);
                            return;
                        }
                    }
                }
            } catch (error) {
                console.error('加载书摘文案失败:', error);
            }
        }
        
        // 动态处理文学理论 (littheory-*)
        if (articleId.startsWith('littheory-')) {
            try {
                console.log('Loading literary theory article:', articleId);
                const params = new URLSearchParams(window.location.search);
                const filePath = params.get('file');
                
                if (filePath) {
                    console.log('Loading from file param:', filePath);
                    const fileResponse = await fetch(filePath);
                    if (fileResponse.ok) {
                        const content = await fileResponse.text();
                        const titleMatch = content.match(/^# (.+)$/m);
                        const dateMatch = content.match(/\*\*发布时间\*\*[：:]\s*(\d{4}-\d{2}-\d{2})/);

                        renderArticle({
                            tag: '文学理论',
                            tagClass: 'tag-ai',
                            title: titleMatch ? titleMatch[1] : '',
                            date: dateMatch ? dateMatch[1] : ''
                        }, content);
                        updateNextArticle(articleId);
                        return;
                    }
                }
                
                const dirResponse = await fetch('data/文学理论/');
                if (dirResponse.ok) {
                    const html = await dirResponse.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const links = doc.querySelectorAll('a[href$=".md"]');
                    const mdFiles = [];
                    
                    links.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href) {
                            const name = decodeURIComponent(href.split('/').pop());
                            if (name.endsWith('.md')) {
                                mdFiles.push(name);
                            }
                        }
                    });
                    
                    mdFiles.sort();
                    
                    const prefix = articleId.replace('littheory-', '');
                    const targetFile = mdFiles.find(f => f.startsWith(prefix));
                    
                    if (targetFile) {
                        const fileResponse = await fetch(`data/文学理论/${encodeURIComponent(targetFile)}`);
                        if (fileResponse.ok) {
                            const content = await fileResponse.text();
                            const titleMatch = content.match(/^# (.+)$/m);
                            const dateMatch = content.match(/\*\*发布时间\*\*[：:]\s*(\d{4}-\d{2}-\d{2})/);

                            renderArticle({
                                tag: '文学理论',
                                tagClass: 'tag-ai',
                                title: titleMatch ? titleMatch[1] : '',
                                date: dateMatch ? dateMatch[1] : ''
                            }, content);
                            updateNextArticle(articleId);
                            return;
                        }
                    }
                }
            } catch (error) {
                console.error('加载文学理论失败:', error);
            }
        }
        
        // 动态处理知识创作 (knowledge-*)
        if (articleId.startsWith('knowledge-')) {
            try {
                console.log('Loading knowledge creation article:', articleId);
                const targetFile = articleId.replace('knowledge-', '') + '.md';
                const fileResponse = await fetch(`data/知识创作/${encodeURIComponent(targetFile)}`);
                if (fileResponse.ok) {
                    const content = await fileResponse.text();
                    const titleMatch = content.match(/^# (.+)$/m);
                    const dateMatch = content.match(/\*\*📅 更新日期\*\*[：:]\s*(\d{4}-\d{2}-\d{2})/);
                    renderArticle({
                        tag: '知识创作',
                        tagClass: 'tag-ai',
                        title: titleMatch ? titleMatch[1] : '',
                        date: dateMatch ? dateMatch[1] : ''
                    }, content);
                    updateNextArticle(articleId);
                    return;
                }
            } catch (error) {
                console.error('加载知识创作文章失败:', error);
            }
        }
        
        // 动态处理拆书心得 (book-analysis-*)
        if (articleId.startsWith('book-analysis-')) {
            try {
                console.log('Loading book analysis article:', articleId);
                const params = new URLSearchParams(window.location.search);
                const fileName = params.get('file');
                
                if (fileName) {
                    const fileResponse = await fetch(`data/拆书心得/${fileName}`);
                    if (fileResponse.ok) {
                        const content = await fileResponse.text();
                        const titleMatch = content.match(/^# (.+)$/m);
                        const dateMatch = content.match(/\*\*发布时间\*\*[：:]\s*(\d{4}-\d{2}-\d{2})/);

                        const prefix = articleId.replace('book-analysis-', '');
                        const categoryMap = {
                            '001': '呼兰河传', '002': '呼兰河传',
                            '003': '呼兰河传', '004': '呼兰河传',
                            '005': '呼兰河传', '006': '呼兰河传',
                            '007': '红楼梦', '008': '红楼梦',
                            '009': '红楼梦', '010': '红楼梦',
                            '011': '红楼梦', '012': '红楼梦',
                            '013': '活着', '014': '活着',
                            '015': '活着', '016': '活着',
                            '017': '百年孤独', '018': '百年孤独',
                            '019': '百年孤独',
                            '020': 'AI拆书方法论', '021': 'AI拆书方法论',
                            '022': '围城', '023': '围城',
                            '024': '三体', '025': '三体',
                            '026': '平凡的世界'
                        };

                        renderArticle({
                            tag: categoryMap[prefix] || '拆书心得',
                            tagClass: 'tag-ai',
                            title: titleMatch ? titleMatch[1] : '',
                            date: dateMatch ? dateMatch[1] : ''
                        }, content);
                        updateNextArticle(articleId);
                        return;
                    }
                }
                
                const dirResponse = await fetch('data/拆书心得/');
                if (dirResponse.ok) {
                    const html = await dirResponse.text();
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const links = doc.querySelectorAll('a[href$=".md"]');
                    const mdFiles = [];
                    
                    links.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href) {
                            const name = decodeURIComponent(href.split('/').pop());
                            if (name.endsWith('.md')) {
                                mdFiles.push(name);
                            }
                        }
                    });
                    
                    mdFiles.sort();
                    
                    const prefix = articleId.replace('book-analysis-', '');
                    const targetFile = mdFiles.find(f => f.startsWith(prefix));
                    
                    if (targetFile) {
                        const fileResponse = await fetch(`data/拆书心得/${encodeURIComponent(targetFile)}`);
                        if (fileResponse.ok) {
                            const content = await fileResponse.text();
                            const titleMatch = content.match(/^# (.+)$/m);
                            const dateMatch = content.match(/\*\*发布时间\*\*[：:]\s*(\d{4}-\d{2}-\d{2})/);

                            const categoryMap = {
                                '001': '呼兰河传', '002': '呼兰河传',
                                '003': '呼兰河传', '004': '呼兰河传',
                                '005': '呼兰河传', '006': '呼兰河传',
                                '007': '红楼梦', '008': '红楼梦',
                                '009': '红楼梦', '010': '红楼梦',
                                '011': '红楼梦', '012': '红楼梦',
                                '013': '活着', '014': '活着',
                                '015': '活着', '016': '活着',
                                '017': '百年孤独', '018': '百年孤独',
                                '019': '百年孤独',
                                '020': 'AI拆书方法论', '021': 'AI拆书方法论',
                                '022': '围城', '023': '围城',
                                '024': '三体', '025': '三体',
                                '026': '平凡的世界'
                            };

                            renderArticle({
                                tag: categoryMap[prefix] || '拆书心得',
                                tagClass: 'tag-ai',
                                title: titleMatch ? titleMatch[1] : '',
                                date: dateMatch ? dateMatch[1] : ''
                            }, content);
                            updateNextArticle(articleId);
                            return;
                        }
                    }
                }
            } catch (error) {
                console.error('加载拆书心得失败:', error);
            }
        }
        
        // 如果不是已知类型或者加载失败，显示错误
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
        let hash = window.location.hash;
        
        if (articleId.startsWith('project-')) {
            // 处理精选项目 - 从ID中提取文件名
            const fileName = articleId.replace('project-', '') + '.md';
            
            // 尝试加载精选项目文件
            let fileResponse = await fetch(`data/精选项目/${fileName}`);
            
            if (!fileResponse.ok) {
                // 如果找不到文件，尝试获取目录中的所有文件
                const dirResponse = await fetch('data/精选项目/');
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
                            const name = href.split('/').pop();
                            if (name.endsWith('.md')) {
                                mdFiles.push(name);
                            }
                        }
                    });
                    
                    // 按文件名排序
                    mdFiles.sort();
                    
                    // 尝试加载第一个文件
                    if (mdFiles.length > 0) {
                        const firstFile = mdFiles[0];
                        fileResponse = await fetch(`data/精选项目/${firstFile}`);
                        if (fileResponse.ok) {
                            content = await fileResponse.text();
                        } else {
                            throw new Error('精选项目文件加载失败');
                        }
                    } else {
                        throw new Error('没有找到精选项目文件');
                    }
                } else {
                    throw new Error('精选项目目录访问失败');
                }
            } else {
                content = await fileResponse.text();
            }
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

        const dateMatch = content.match(/\*\*发布时间\*\*[：:]\s*(\d{4}-\d{2}-\d{2})/) || content.match(/\*\*📅 更新日期\*\*[：:]\s*(\d{4}-\d{2}-\d{2})/);
        if (dateMatch) {
            articleInfo.date = dateMatch[1];
        }

        renderArticle(articleInfo, content);
        updateNextArticle(articleId);
        
        // 滚动到锚点位置
        if (hash) {
            setTimeout(() => {
                const element = document.querySelector(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
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

// 文章阅读量和点赞功能
function initArticleStats() {
    const articleId = getArticleIdFromUrl();
    if (!articleId) return;

    // 阅读量统计
    const viewKey = `views_${articleId}`;
    const viewedKey = `viewed_${articleId}`;
    let views = parseInt(localStorage.getItem(viewKey) || '0');

    // 每个用户每篇文章只计一次阅读
    if (!localStorage.getItem(viewedKey)) {
        views++;
        localStorage.setItem(viewKey, views.toString());
        localStorage.setItem(viewedKey, '1');
    }

    const viewCountEl = document.getElementById('viewCount');
    if (viewCountEl) viewCountEl.textContent = views;

    // 点赞功能
    const likeKey = `likes_${articleId}`;
    const likedKey = `liked_${articleId}`;
    let likes = parseInt(localStorage.getItem(likeKey) || '0');
    const isLiked = localStorage.getItem(likedKey) === '1';

    const likeCountEl = document.getElementById('likeCount');
    const likeIconEl = document.getElementById('likeIcon');
    if (likeCountEl) likeCountEl.textContent = likes;
    if (likeIconEl) likeIconEl.textContent = isLiked ? '❤️' : '🤍';

    // 存储到全局供 toggleLike 使用
    window._articleStats = { articleId, likes, isLiked };
}

function toggleLike() {
    const stats = window._articleStats;
    if (!stats) return;

    const likeKey = `likes_${stats.articleId}`;
    const likedKey = `liked_${stats.articleId}`;

    if (stats.isLiked) {
        stats.likes--;
        stats.isLiked = false;
        localStorage.setItem(likedKey, '0');
    } else {
        stats.likes++;
        stats.isLiked = true;
        localStorage.setItem(likedKey, '1');
    }

    localStorage.setItem(likeKey, stats.likes.toString());

    const likeCountEl = document.getElementById('likeCount');
    const likeIconEl = document.getElementById('likeIcon');
    if (likeCountEl) likeCountEl.textContent = stats.likes;
    if (likeIconEl) likeIconEl.textContent = stats.isLiked ? '❤️' : '🤍';

    // 添加动画效果
    const btn = document.getElementById('likeBtn');
    if (btn) {
        btn.style.transform = 'scale(1.1)';
        setTimeout(() => btn.style.transform = 'scale(1)', 200);
    }
}

document.addEventListener('DOMContentLoaded', loadArticle);
document.addEventListener('DOMContentLoaded', initArticleStats);

// 阅读进度条
function initReadingProgress() {
    const progressBar = document.getElementById('readingProgress');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = progress + '%';
    }, { passive: true });
}

document.addEventListener('DOMContentLoaded', () => {
    initReadingProgress();
    
    // 分享按钮样式增强
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.background = 'rgba(0, 245, 212, 0.1)';
            btn.style.borderColor = 'var(--accent-primary)';
            btn.style.color = 'var(--accent-primary)';
            btn.style.transform = 'translateY(-2px)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'var(--bg-card)';
            btn.style.borderColor = 'var(--border-color)';
            btn.style.color = 'var(--text-secondary)';
            btn.style.transform = 'translateY(0)';
        });
    });
});

function getShareInfo() {
    const title = document.title;
    const url = window.location.href;
    const desc = document.querySelector('meta[name="description"]')?.content || '';
    return { title, url, desc };
}

function shareToWeibo() {
    const { title, url, desc } = getShareInfo();
    window.open(`https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title + ' - ' + desc)}`, '_blank', 'width=600,height=400');
}

function shareToQQ() {
    const { title, url, desc } = getShareInfo();
    window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(desc)}`, '_blank', 'width=600,height=400');
}

function shareToDouban() {
    const { title, url, desc } = getShareInfo();
    window.open(`https://www.douban.com/share/service?url=${encodeURIComponent(url)}&name=${encodeURIComponent(title)}&text=${encodeURIComponent(desc)}`, '_blank', 'width=600,height=400');
}

function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        const btn = document.getElementById('copyLinkBtn');
        if (btn) {
            const original = btn.textContent;
            btn.textContent = '已复制!';
            btn.style.color = 'var(--accent-primary)';
            setTimeout(() => {
                btn.textContent = original;
                btn.style.color = '';
            }, 2000);
        }
    }).catch(() => {
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        const btn = document.getElementById('copyLinkBtn');
        if (btn) {
            btn.textContent = '已复制!';
            setTimeout(() => { btn.textContent = '复制链接'; }, 2000);
        }
    });
}

function shareToWechat() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('链接已复制！请打开微信，粘贴链接分享给朋友或发到朋友圈。');
    }).catch(() => {
        alert('请手动复制浏览器地址栏的链接，在微信中粘贴分享。');
    });
}