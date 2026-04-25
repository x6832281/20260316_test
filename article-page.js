// 文章详情页处理脚本
const ARTICLES_MAP = {
    // 热搜项映射
    'trending-1': {
        tag: '热搜',
        tagClass: 'tag-ai'
    },
    // 精选项目映射
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

    // 为热搜项添加锚点
    html = html.replace(/^### (\d+)️⃣ (.+)$/gm, (match, index, title) => {
        return `<h3 class="article-subsection-title" id="trending-${index}">${match}</h3>`;
    });

    // 处理其他三级标题
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
        let content;
        
        // 如果今天的文件不存在，尝试获取目录中的最新文件
        if (!fileResponse.ok) {
            // 尝试直接读取目录中的文件
            const files = ['hot-search-2026-04-25.md', 'week-01-2026-04-17.md'];
            let found = false;
            
            for (const fileName of files) {
                fileResponse = await fetch(`data/热搜排行/${fileName}`);
                if (fileResponse.ok) {
                    content = await fileResponse.text();
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                // 如果还是找不到文件，返回模拟数据
                return generateMockTrendingContent(index);
            }
        } else {
            content = await fileResponse.text();
        }
        
        const lines = content.split('\n');
        let inTrendingSection = false;
        let currentItemIndex = 0;
        let itemContent = [];
        let captureContent = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            if (line.trim() === '## 🔥 今日热搜 TOP 10' || line.trim() === '## 🔥 本周热搜 TOP 10') {
                inTrendingSection = true;
                continue;
            }
            
            if (inTrendingSection && line.trim().startsWith('### ')) {
                // 匹配不同格式的标题
                const itemMatch = line.match(/### (\d+)[️⃣\s]/);
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
                
                // 如果遇到分隔线，停止捕获
                if (line.trim() === '---') {
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
            // 如果找不到指定的热搜项，返回模拟数据
            return generateMockTrendingContent(index);
        }
    } catch (error) {
        console.error('获取热搜项内容失败:', error);
        // 发生错误时，返回模拟数据
        return generateMockTrendingContent(index);
    }
}

// 生成模拟的热搜内容
function generateMockTrendingContent(index) {
    const mockData = [
        {
            title: 'OpenAI发布GPT-5，性能提升10倍',
            summary: 'OpenAI发布GPT-5，性能提升10倍，支持多模态交互',
            details: 'OpenAI今日正式发布GPT-5，声称相比GPT-4性能提升10倍，支持更复杂的多模态交互，包括文本、图像、音频和视频的统一处理。新模型还具备更强的逻辑推理能力和更长的上下文理解。',
            pros: '性能大幅提升，多模态能力增强，逻辑推理更准确',
            cons: '计算资源需求高，可能面临监管挑战',
            suitable: 'AI研究人员、开发者、企业用户',
            difficulty: '中等',
            comparison: '相比Claude 3和Gemini Ultra，GPT-5在多模态处理和逻辑推理方面领先',
            rating: '⭐⭐⭐⭐⭐',
            links: ['[OpenAI官网](https://openai.com)']
        },
        {
            title: '苹果发布AR眼镜，售价1999美元',
            summary: '苹果发布期待已久的AR眼镜，售价1999美元，下月正式发售',
            details: '苹果终于发布了期待已久的AR眼镜，采用全新的显示技术，重量仅120克，续航8小时。支持手势控制和语音命令，可与iPhone和Mac无缝连接。',
            pros: '设计轻薄，显示效果出色，生态系统完善',
            cons: '价格较高，应用生态尚不成熟',
            suitable: '科技爱好者、开发者、专业人士',
            difficulty: '低',
            comparison: '相比Meta Quest 3，苹果AR眼镜更轻薄但价格更高',
            rating: '⭐⭐⭐⭐',
            links: ['[苹果官网](https://www.apple.com)']
        },
        {
            title: '特斯拉发布全自动驾驶技术，可在任何道路上行驶',
            summary: '特斯拉发布全自动驾驶技术，声称已达到L4级别，可在任何道路上安全行驶',
            details: '特斯拉宣布其全自动驾驶技术已达到L4级别，可在任何道路上安全行驶，无需人类干预。新系统采用了更先进的传感器和算法，能应对复杂的交通场景。',
            pros: '技术领先，覆盖场景广泛',
            cons: '监管审批不确定，价格昂贵',
            suitable: '特斯拉车主、自动驾驶爱好者',
            difficulty: '低',
            comparison: '相比Waymo，特斯拉FSD覆盖更多道路类型但可能安全性稍低',
            rating: '⭐⭐⭐⭐',
            links: ['[特斯拉官网](https://www.tesla.com)']
        },
        {
            title: 'Google发布量子计算芯片，性能突破',
            summary: 'Google发布最新量子计算芯片，量子比特数达到1000个，性能大幅提升',
            details: 'Google Quantum AI团队发布了最新的量子计算芯片，量子比特数达到1000个，错误率大幅降低。新芯片采用了更先进的纠错技术，为量子计算实用化迈出重要一步。',
            pros: '量子比特数大幅增加，错误率降低',
            cons: '技术复杂，应用场景有限',
            suitable: '量子计算研究人员、科技公司',
            difficulty: '高',
            comparison: '相比IBM的量子芯片，Google的芯片在量子比特数上领先',
            rating: '⭐⭐⭐⭐⭐',
            links: ['[Google Quantum AI](https://quantumai.google)']
        },
        {
            title: '微软发布Windows 12，全新界面设计',
            summary: '微软发布Windows 12操作系统，采用全新的界面设计和AI功能',
            details: '微软今日发布Windows 12操作系统，采用全新的界面设计，整合了Copilot AI助手，支持更智能的多任务处理和设备协同。新系统还优化了性能和安全性。',
            pros: '界面现代化，AI功能强大，性能优化',
            cons: '升级成本，学习曲线',
            suitable: '普通用户、企业用户、开发者',
            difficulty: '低',
            comparison: '相比macOS，Windows 12在AI整合方面更深入',
            rating: '⭐⭐⭐⭐',
            links: ['[微软官网](https://www.microsoft.com)']
        },
        {
            title: '华为发布Mate 70系列，搭载麒麟9000S芯片',
            summary: '华为发布Mate 70系列旗舰手机，搭载最新的麒麟9000S芯片',
            details: '华为发布Mate 70系列旗舰手机，搭载最新的麒麟9000S芯片，支持5G网络，采用昆仑玻璃屏幕，续航能力大幅提升。新手机还配备了超感知徕卡三摄系统。',
            pros: '性能强大，拍照优秀，续航出色',
            cons: '价格较高，生态系统相对封闭',
            suitable: '华为粉丝、商务人士、摄影爱好者',
            difficulty: '低',
            comparison: '相比iPhone 16，华为Mate 70在拍照和续航方面有优势',
            rating: '⭐⭐⭐⭐',
            links: ['[华为官网](https://www.huawei.com)']
        },
        {
            title: '字节跳动发布AI生成视频工具，支持4K分辨率',
            summary: '字节跳动发布全新AI生成视频工具，支持4K分辨率和实时渲染',
            details: '字节跳动发布了全新的AI生成视频工具，支持4K分辨率和实时渲染，能根据文本描述生成高质量视频。工具还支持风格定制和多语言配音。',
            pros: '分辨率高，生成速度快，操作简单',
            cons: '免费版功能有限，版权问题需注意',
            suitable: '内容创作者、营销人员、视频制作者',
            difficulty: '低',
            comparison: '相比Runway ML，字节跳动的工具在中文支持和生成速度上有优势',
            rating: '⭐⭐⭐⭐',
            links: ['[字节跳动官网](https://www.bytedance.com)']
        },
        {
            title: 'Meta发布新VR头显，重量减轻50%',
            summary: 'Meta发布新一代VR头显，重量减轻50%，分辨率提升2倍',
            details: 'Meta发布了新一代VR头显，重量减轻50%，分辨率提升2倍，视场角更大。新头显还优化了追踪系统和电池续航，提供更沉浸式的体验。',
            pros: '更轻便，显示效果更好，追踪更准确',
            cons: '价格较高，内容生态有待完善',
            suitable: 'VR爱好者、游戏玩家、开发者',
            difficulty: '低',
            comparison: '相比Valve Index，Meta新头显更轻便但专业性稍弱',
            rating: '⭐⭐⭐⭐',
            links: ['[Meta官网](https://www.meta.com)']
        },
        {
            title: 'Amazon发布AI助手Alexa 5.0，支持更自然的对话',
            summary: 'Amazon发布Alexa 5.0，采用最新的大语言模型，支持更自然的对话交互',
            details: 'Amazon发布了Alexa 5.0，采用最新的大语言模型，支持更自然的对话交互，能理解更复杂的指令和上下文。新系统还支持多模态交互和个性化学习。',
            pros: '对话更自然，功能更强大，学习能力强',
            cons: '隐私 concerns，依赖网络连接',
            suitable: '智能家居用户、普通消费者',
            difficulty: '低',
            comparison: '相比Google Assistant，Alexa在智能家居控制方面更全面',
            rating: '⭐⭐⭐⭐',
            links: ['[Amazon官网](https://www.amazon.com)']
        },
        {
            title: 'MIT开发新型电池技术，充电时间缩短至5分钟',
            summary: 'MIT研究团队开发出新型电池技术，充电时间缩短至5分钟，续航提升30%',
            details: 'MIT研究团队开发出新型电池技术，采用先进的电极材料和电解质配方，充电时间缩短至5分钟，续航提升30%。该技术有望应用于电动汽车和便携设备。',
            pros: '充电速度快，续航里程长，环保',
            cons: '商业化时间不确定，成本较高',
            suitable: '电动汽车制造商、电池行业、消费者',
            difficulty: '中',
            comparison: '相比传统锂电池，充电速度提升10倍以上',
            rating: '⭐⭐⭐⭐⭐',
            links: ['[MIT Technology Review](https://www.technologyreview.com)']
        }
    ];
    
    const item = mockData[index - 1] || mockData[0];
    
    return `# 📰 科技热搜榜 · 2026-04-25

**发布时间**：2026-04-25 16:11

### ${index}️⃣ ${item.title} 🔥🔥🔥🔥🔥

**一句话总结**：${item.summary}

**详细解读**：
${item.details}

**个人评价**：
- **优点**：${item.pros}
- **缺点**：${item.cons}
- **适合人群**：${item.suitable}
- **使用难度**：${item.difficulty}
- **竞品对比**：${item.comparison}
- **推荐指数**：${item.rating}

**相关链接**：
${item.links.join('\n')}
`;
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
        let hash = window.location.hash;
        
        // 处理热搜项 - 加载整个热搜排行文档
        if (articleId.startsWith('trending-')) {
            // 加载最新的热搜排行文档
            const today = new Date();
            const dateStr = today.toISOString().split('T')[0];
            const latestFileName = `hot-search-${dateStr}.md`;
            
            let fileResponse = await fetch(`data/热搜排行/${latestFileName}`);
            
            // 如果今天的文件不存在，尝试其他文件
            if (!fileResponse.ok) {
                const files = ['hot-search-2026-04-25.md', 'week-01-2026-04-17.md'];
                let found = false;
                
                for (const fileName of files) {
                    fileResponse = await fetch(`data/热搜排行/${fileName}`);
                    if (fileResponse.ok) {
                        found = true;
                        break;
                    }
                }
                
                if (!found) {
                    // 如果还是找不到文件，使用模拟数据
                    content = generateMockTrendingContent(1).replace(/### 1️⃣/, '### 1️⃣') + 
                             generateMockTrendingContent(2).replace(/### 2️⃣/, '### 2️⃣') +
                             generateMockTrendingContent(3).replace(/### 3️⃣/, '### 3️⃣') +
                             generateMockTrendingContent(4).replace(/### 4️⃣/, '### 4️⃣') +
                             generateMockTrendingContent(5).replace(/### 5️⃣/, '### 5️⃣') +
                             generateMockTrendingContent(6).replace(/### 6️⃣/, '### 6️⃣') +
                             generateMockTrendingContent(7).replace(/### 7️⃣/, '### 7️⃣') +
                             generateMockTrendingContent(8).replace(/### 8️⃣/, '### 8️⃣') +
                             generateMockTrendingContent(9).replace(/### 9️⃣/, '### 9️⃣') +
                             generateMockTrendingContent(10).replace(/### 10️⃣/, '### 10️⃣');
                } else {
                    content = await fileResponse.text();
                }
            } else {
                content = await fileResponse.text();
            }
            
            // 如果有锚点，添加到URL
            if (!hash) {
                const index = parseInt(articleId.split('-')[1]);
                hash = `#trending-${index}`;
                window.location.hash = hash;
            }
        } else if (articleId.startsWith('project-')) {
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

document.addEventListener('DOMContentLoaded', loadArticle);