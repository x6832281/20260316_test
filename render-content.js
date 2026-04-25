// 文章内容数据（直接从 Markdown 文件提取）
const ARTICLES_DATA = [
    {
        id: 'article-001',
        tag: 'AI Agent',
        tagClass: 'tag-ai',
        accentClass: 'accent-ai',
        title: 'AI Agent 自进化：EvoMap evolver 深度评测',
        date: '2026-04-17',
        readTime: '8 分钟',
        desc: 'EvoMap evolver 是本周最火的 AI 项目，3 天涨星 3600+，它让 AI Agent 能够像生物一样自我进化。'
    },
    {
        id: 'article-002',
        tag: '游戏开发',
        tagClass: 'tag-game',
        accentClass: 'accent-game',
        title: '49 个 AI 一起做游戏，开发者要失业了？',
        date: '2026-04-17',
        readTime: '6 分钟',
        desc: '有人把 Claude Code 变成了完整的游戏开发工作室，49 个 AI Agent 分工协作，11K stars 引爆开发者圈。'
    },
    {
        id: 'article-003',
        tag: 'AI 学习',
        tagClass: 'tag-ai',
        accentClass: 'accent-ai',
        title: '中文 AI 学习资源大爆发，这 5 个教程必看',
        date: '2026-04-17',
        readTime: '5 分钟',
        desc: '《动手学大模型》本周登顶 GitHub 热榜，31K stars！我整理了 5 个必看的中文 AI 学习资源。'
    },
    {
        id: 'article-004',
        tag: '隐私',
        tagClass: 'tag-resource',
        accentClass: 'accent-resource',
        title: 'AI 能看屏幕听对话，隐私怎么办？',
        date: '2026-04-17',
        readTime: '7 分钟',
        desc: '本周爆火的 omi 项目让 AI 能看你的屏幕、听你的对话，9.5K stars 背后，隐私问题值得深思。'
    },
    {
        id: 'article-005',
        tag: '成本分析',
        tagClass: 'tag-game',
        accentClass: 'accent-game',
        title: 'AI 工具成本大对比：免费 vs 付费，哪个更划算？',
        date: '2026-04-17',
        readTime: '6 分钟',
        desc: 'AI 工具越来越多，免费和付费怎么选？我测试了 20+ 个工具，给你最真实的成本分析。'
    }
];

// 热搜 TOP 10 数据
const TRENDING_DATA = [
    { rank: '01', title: 'AI Agent 自进化引擎爆火', event: 'EvoMap 发布 evolver，3 天涨星 3600+', articleId: 'article-001' },
    { rank: '02', title: 'Claude Code 变游戏工作室', event: '49 个 AI Agent 协作开发游戏，11K stars', articleId: 'article-002' },
    { rank: '03', title: '大疆 Pocket 4 上手视频刷屏', event: '影视飓风首发评测，B 站 226 万播放', articleId: 'article-003' },
    { rank: '04', title: '中文大模型教程登顶 GitHub', event: '《动手学大模型》31K stars', articleId: 'article-003' },
    { rank: '05', title: 'AI 能看屏幕听对话了', event: 'omi 发布新一代 AI 助手，9.5K stars', articleId: 'article-004' },
    { rank: '06', title: '开源语音合成工作室火了', event: 'voicebox 19K stars', articleId: 'article-005' },
    { rank: '07', title: 'Google 发布 AI 文件检测工具', event: 'magika 15K stars', articleId: 'article-005' },
    { rank: '08', title: '世界最小喷气载人飞机挑战成功', event: 'B 站 UP 主魔界造物保持 25 年纪录', articleId: 'article-001' },
    { rank: '09', title: 'Chrome DevTools 给 AI 用了', event: '35K stars，coding agent 开发效率提升', articleId: 'article-002' },
    { rank: '10', title: '大众电动车 1200 公里深度体验', event: 'ID.ERA 9X 实测', articleId: 'article-005' }
];

// 渲染文章卡片
function renderArticleCard(article) {
    return `
        <a href="article.html?id=${article.id}" class="article-card" data-article-id="${article.id}">
            <div class="card-accent ${article.accentClass}"></div>
            <div class="card-content">
                <div class="card-meta">
                    <span class="card-tag ${article.tagClass}">${article.tag}</span>
                    <span class="card-readtime">${article.readTime || '5 分钟'}</span>
                </div>
                <h3 class="card-title">${article.title}</h3>
                <p class="card-desc">${article.desc}</p>
                <div class="card-footer">
                    <time class="card-date">${article.date}</time>
                    <span class="card-link">阅读 →</span>
                </div>
            </div>
        </a>
    `;
}

// 渲染热搜列表
function renderTrendingList(trendingItems) {
    return trendingItems.map((item, index) => {
        let rankClass = '';
        let hotBadge = '';
        // 使用特殊的id格式来标识热搜项
        const articleUrl = `article.html?id=trending-${index + 1}`;
        
        if (index < 3) {
            rankClass = index === 0 ? 'rank-gold' : index === 1 ? 'rank-silver' : 'rank-bronze';
            hotBadge = '<span class="item-badge hot">热</span>';
        }
        
        return `
            <li class="trending-item ${index < 3 ? 'item-hot' : ''}">
                <span class="item-rank ${rankClass}">${item.rank}</span>
                <a href="${articleUrl}" class="item-text" title="${item.event}">${item.title}</a>
                ${hotBadge}
            </li>
        `;
    }).join('');
}

// 萌新学习数据
const NEWBIE_DATA = [
    {
        id: 'newbie-001',
        title: 'AI 名人演讲精选',
        category: '名人演讲',
        icon: '🎤',
        date: '2026-04-20',
        desc: 'Sam Altman、李开复等 AI 领域知名人物的核心观点与推荐演讲'
    },
    {
        id: 'newbie-002',
        title: '零基础 AI 入门教程推荐',
        category: '热门教程',
        icon: '📚',
        date: '2026-04-20',
        desc: '吴恩达《AI For Everyone》等最适合新手的入门教程'
    },
    {
        id: 'newbie-003',
        title: 'B站热门 AI 学习视频',
        category: 'B站热门学习视频',
        icon: '📺',
        date: '2026-04-20',
        desc: '播放量最高的 AI 入门视频，10分钟带你了解人工智能'
    },
    {
        id: 'newbie-004',
        title: 'AI 基本术语通俗解释',
        category: '基本术语解释',
        icon: '📖',
        date: '2026-04-20',
        desc: '人工智能、机器学习、深度学习、大模型等术语的通俗解释'
    },
    {
        id: 'newbie-005',
        title: 'AI 工具使用入门指南',
        category: '工具使用',
        icon: '🛠️',
        date: '2026-04-20',
        desc: 'ChatGPT、通义千问、豆包等免费 AI 工具的使用方法'
    },
    {
        id: 'newbie-006',
        title: 'AI 效率提升：文档处理与数据整理',
        category: 'AI效率提升',
        icon: '⚡',
        date: '2026-04-20',
        desc: '用 AI 写邮件、做表格、整理数据，效率提升 80%'
    }
];

// 搞钱排行数据
const MONEY_DATA = [
    {
        id: 'money-001',
        title: '用 AI 做自媒体，月入过万的搞钱指南',
        category: '自媒体',
        icon: '💰',
        date: '2026-04-20',
        desc: '用 AI 辅助做自媒体，每天 2 小时，3 个月实现月入过万'
    },
    {
        id: 'money-002',
        title: 'AI 自由职业接单，时薪 100+ 的搞钱方法',
        category: '自由职业',
        icon: '💼',
        date: '2026-04-20',
        desc: '用 AI 工具提升效率，在接单平台做自由职业，时薪轻松过百'
    },
    {
        id: 'money-003',
        title: 'AI 知识付费，把经验变成钱的搞钱指南',
        category: '知识付费',
        icon: '📚',
        date: '2026-04-20',
        desc: '用 AI 帮你制作课程、写教材、做课件，把经验变成被动收入'
    },
    {
        id: 'money-004',
        title: 'AI 电商带货，零库存也能赚钱',
        category: '电商',
        icon: '🛒',
        date: '2026-04-20',
        desc: '用 AI 做电商选品、写文案、做客服，零库存也能月入过万'
    },
    {
        id: 'money-005',
        title: 'AI 短视频带货，流量变现最快的搞钱方法',
        category: '短视频',
        icon: '🎬',
        date: '2026-04-20',
        desc: '用 AI 批量制作短视频，挂商品链接，一条视频爆了就赚几千块'
    },
    {
        id: 'money-006',
        title: 'AI 工具开发，技术变现的搞钱指南',
        category: '技术开发',
        icon: '🔧',
        date: '2026-04-20',
        desc: '用 AI 辅助开发小工具，做成 SaaS 产品，月入几万到几十万'
    }
];

// AI创意数据
const CREATIVE_DATA = [
    {
        id: 'creative-001',
        title: '用 AI 绘画创作你的第一幅数字艺术品',
        category: 'AI绘画',
        icon: '🎨',
        date: '2026-04-20',
        desc: '用 Midjourney 等 AI 绘画工具，零基础也能创作出令人惊艳的数字艺术品'
    },
    {
        id: 'creative-002',
        title: '用 AI 创作音乐，不会乐器也能做音乐人',
        category: 'AI音乐',
        icon: '🎵',
        date: '2026-04-20',
        desc: '用 Suno、Udio 等 AI 音乐工具，输入文字就能生成完整歌曲'
    },
    {
        id: 'creative-003',
        title: '用 AI 制作短视频，不会剪辑也能做博主',
        category: 'AI视频',
        icon: '🎬',
        date: '2026-04-20',
        desc: '用 Runway、Pika 等 AI 视频工具，输入文字就能生成视频'
    },
    {
        id: 'creative-004',
        title: '用 AI 辅助写作，不会写小说也能成为作家',
        category: 'AI写作',
        icon: '✍️',
        date: '2026-04-20',
        desc: '用 ChatGPT、Claude 等 AI 工具辅助写作，从构思到成稿效率提升 10 倍'
    },
    {
        id: 'creative-005',
        title: '用 AI 做 UI 设计，不会设计也能做出好看界面',
        category: 'AI设计',
        icon: '🖥️',
        date: '2026-04-20',
        desc: '用 AI 设计工具，输入描述就能生成 UI 界面，零基础也能做出专业级设计'
    },
    {
        id: 'creative-006',
        title: '用 AI 做游戏开发，不会编程也能做游戏',
        category: 'AI游戏',
        icon: '🎮',
        date: '2026-04-20',
        desc: '用 Cursor、GitHub Copilot 等 AI 编程工具，零基础也能开发自己的小游戏'
    }
];

// 实战案例数据
const CASE_DATA = [
    {
        id: 'case-001',
        title: '某电商公司用 AI 客服，成本降低 70%',
        category: '企业应用',
        icon: '🏢',
        date: '2026-04-20',
        desc: '一家中型电商公司引入 AI 客服后，人工客服减少 70%，客户满意度反而提升了 15%'
    },
    {
        id: 'case-002',
        title: '某教育公司用 AI 辅助教学，学生成绩提升 30%',
        category: '教育领域',
        icon: '🎓',
        date: '2026-04-20',
        desc: '一家在线教育公司引入 AI 个性化辅导系统后，学生平均成绩提升 30%'
    },
    {
        id: 'case-003',
        title: '某自媒体人用 AI 日更 10 篇，粉丝增长 10 倍',
        category: '内容创作',
        icon: '📱',
        date: '2026-04-20',
        desc: '一位自媒体人用 AI 辅助创作，从日更 1 篇到日更 10 篇，3 个月粉丝从 1 万涨到 10 万'
    },
    {
        id: 'case-004',
        title: '某医生用 AI 辅助诊断，效率提升 3 倍',
        category: '医疗健康',
        icon: '🏥',
        date: '2026-04-20',
        desc: '一位三甲医院医生引入 AI 辅助诊断系统后，每天可看诊患者数量从 30 人提升到 90 人'
    },
    {
        id: 'case-005',
        title: '某跨境电商用 AI 翻译，海外销量增长 5 倍',
        category: '电商零售',
        icon: '🌍',
        date: '2026-04-20',
        desc: '一家跨境电商公司用 AI 翻译产品描述和客服消息，3 个月内海外销量增长 5 倍'
    },
    {
        id: 'case-006',
        title: '个人用户用 AI 管理日常，效率提升 200%',
        category: '个人效率',
        icon: '⚡',
        date: '2026-04-20',
        desc: '一位上班族用 AI 工具管理日常工作生活，每天节省 3 小时，效率提升 200%'
    }
];

// AI写作数据（文学创作）
const LITERATURE_DATA = [
    {
        id: 'literature-001',
        title: '用AI写第一篇小说：零基础入门指南',
        category: '小说创作',
        icon: '📖',
        date: '2026-04-22',
        desc: '掌握AI辅助写小说的核心步骤，零基础也能创作出精彩故事'
    },
    {
        id: 'literature-002',
        title: 'AI辅助文案创作：朋友圈、小红书爆款文案速成',
        category: '文案创作',
        icon: '✍️',
        date: '2026-04-22',
        desc: '学会用AI写吸引人的社交媒体文案，让你的内容脱颖而出'
    },
    {
        id: 'literature-003',
        title: '用AI写搞笑段子的秘诀：成为朋友圈段子手',
        category: '幽默段子',
        icon: '😂',
        date: '2026-04-22',
        desc: '掌握AI辅助写搞笑段子的技巧，让你轻松创作让人捧腹大笑的内容'
    },
    {
        id: 'literature-004',
        title: 'AI诗词创作指南：用AI写诗作词的文艺之旅',
        category: '诗词创作',
        icon: '🌸',
        date: '2026-04-22',
        desc: '学会用AI创作现代诗和古体诗，让你的文字充满诗意和文艺气息'
    },
    {
        id: 'literature-005',
        title: 'AI辅助写杂文随笔：让你的文字有深度有思想',
        category: '杂文随笔',
        icon: '📝',
        date: '2026-04-22',
        desc: '掌握AI辅助写杂文随笔的技巧，让你的文字表达更有深度和思想性'
    },
    {
        id: 'literature-006',
        title: 'AI辅助剧本创作入门：从想法到短视频剧本',
        category: '剧本创作',
        icon: '🎬',
        date: '2026-04-22',
        desc: '学会用AI辅助写短视频剧本、微电影剧本，让你的创意变成可视化内容'
    }
];

// 渲染搞钱排行卡片
function renderMoneyCard(item) {
    return `
        <a href="article.html?id=${item.id}" class="money-card" data-money-id="${item.id}">
            <div class="money-icon">${item.icon}</div>
            <div class="money-content">
                <div class="money-meta">
                    <span class="money-category">${item.category}</span>
                    <time class="money-date">${item.date}</time>
                </div>
                <h3 class="money-title">${item.title}</h3>
                <p class="money-desc">${item.desc}</p>
                <span class="money-link">查看 →</span>
            </div>
        </a>
    `;
}

// 渲染AI创意卡片
function renderCreativeCard(item) {
    return `
        <a href="article.html?id=${item.id}" class="creative-card" data-creative-id="${item.id}">
            <div class="creative-icon">${item.icon}</div>
            <div class="creative-content">
                <div class="creative-meta">
                    <span class="creative-category">${item.category}</span>
                    <time class="creative-date">${item.date}</time>
                </div>
                <h3 class="creative-title">${item.title}</h3>
                <p class="creative-desc">${item.desc}</p>
                <span class="creative-link">探索 →</span>
            </div>
        </a>
    `;
}

// 渲染实战案例卡片
function renderCaseCard(item) {
    return `
        <a href="article.html?id=${item.id}" class="case-card" data-case-id="${item.id}">
            <div class="case-icon">${item.icon}</div>
            <div class="case-content">
                <div class="case-meta">
                    <span class="case-category">${item.category}</span>
                    <time class="case-date">${item.date}</time>
                </div>
                <h3 class="case-title">${item.title}</h3>
                <p class="case-desc">${item.desc}</p>
                <span class="case-link">查看 →</span>
            </div>
        </a>
    `;
}

// 渲染萌新学习卡片
function renderNewbieCard(item) {
    return `
        <a href="article.html?id=${item.id}" class="newbie-card" data-newbie-id="${item.id}">
            <div class="newbie-icon">${item.icon}</div>
            <div class="newbie-content">
                <div class="newbie-meta">
                    <span class="newbie-category">${item.category}</span>
                    <time class="newbie-date">${item.date}</time>
                </div>
                <h3 class="newbie-title">${item.title}</h3>
                <p class="newbie-desc">${item.desc}</p>
                <span class="newbie-link">学习 →</span>
            </div>
        </a>
    `;
}

// 渲染文学创作卡片
function renderLiteratureCard(item) {
    return `
        <a href="article.html?id=${item.id}" class="literature-card" data-literature-id="${item.id}">
            <div class="literature-icon">${item.icon}</div>
            <div class="literature-content">
                <div class="literature-meta">
                    <span class="literature-category">${item.category}</span>
                    <time class="literature-date">${item.date}</time>
                </div>
                <h3 class="literature-title">${item.title}</h3>
                <p class="literature-desc">${item.desc}</p>
                <span class="literature-link">查看 →</span>
            </div>
        </a>
    `;
}

// 渲染文学创作分类筛选
function renderLiteratureWithFilter() {
    const container = document.getElementById('literature-container');
    if (!container) return;
    
    // 创建分类筛选按钮
    const filterHtml = `
        <div class="literature-filter">
            <button class="literature-filter-btn active" data-category="all">全部</button>
            <button class="literature-filter-btn" data-category="小说创作">小说</button>
            <button class="literature-filter-btn" data-category="文案创作">文案</button>
            <button class="literature-filter-btn" data-category="幽默段子">段子</button>
        </div>
    `;
    
    // 渲染卡片
    const cardsHtml = LITERATURE_DATA.map(item => renderLiteratureCard(item)).join('');
    
    container.innerHTML = filterHtml + `<div class="literature-grid">${cardsHtml}</div>`;
    
    // 绑定筛选按钮事件
    const filterBtns = container.querySelectorAll('.literature-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新按钮状态
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // 筛选卡片
            const category = btn.dataset.category;
            const cards = container.querySelectorAll('.literature-card');
            cards.forEach(card => {
                const cardCategory = card.querySelector('.literature-category').textContent;
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// 从热搜排行文档中提取数据
function extractTrendingFromMarkdown(markdownContent) {
    const trendingItems = [];
    const lines = markdownContent.split('\n');
    let inTrendingSection = false;
    let rank = 1;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line === '## 🔥 今日热搜 TOP 10') {
            inTrendingSection = true;
            continue;
        }
        
        if (inTrendingSection && line.startsWith('### ')) {
            // 提取标题
            const titleMatch = line.match(/### \d+️⃣ (.+?) 🔥+/);
            if (titleMatch) {
                const title = titleMatch[1];
                
                // 提取事件描述（一句话总结）
                let event = '';
                for (let j = i + 1; j < lines.length; j++) {
                    const nextLine = lines[j].trim();
                    if (nextLine.startsWith('**一句话总结**：')) {
                        event = nextLine.replace('**一句话总结**：', '').trim();
                        break;
                    }
                }
                
                trendingItems.push({
                    rank: rank.toString().padStart(2, '0'),
                    title: title,
                    event: event,
                    articleId: 'article-001' // 默认为第一篇文章
                });
                
                rank++;
                if (rank > 10) break;
            }
        }
        
        if (inTrendingSection && line === '---' && trendingItems.length >= 10) {
            break;
        }
    }
    
    return trendingItems;
}

// 获取最新的热搜排行文档
async function getLatestTrendingData() {
    try {
        // 直接尝试读取最新的文件（基于当前日期）
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        const latestFileName = `hot-search-${dateStr}.md`;
        
        // 尝试读取今天的文件
        const fileResponse = await fetch(`data/热搜排行/${latestFileName}`);
        if (fileResponse.ok) {
            const content = await fileResponse.text();
            return extractTrendingFromMarkdown(content);
        }
        
        // 如果今天的文件不存在，尝试获取目录中的所有文件
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
                    // 提取文件名
                    const fileName = href.split('/').pop();
                    if (fileName.endsWith('.md')) {
                        mdFiles.push(fileName);
                    }
                }
            });
            
            // 按文件名排序，找出最新的文件
            mdFiles.sort((a, b) => {
                // 提取日期部分
                const dateA = a.match(/\d{4}-\d{2}-\d{2}/);
                const dateB = b.match(/\d{4}-\d{2}-\d{2}/);
                
                if (dateA && dateB) {
                    return new Date(dateB[0]) - new Date(dateA[0]);
                }
                return 0;
            });
            
            // 获取最新的.md文件
            if (mdFiles.length > 0) {
                const latestFile = mdFiles[0];
                const fileResponse = await fetch(`data/热搜排行/${latestFile}`);
                if (fileResponse.ok) {
                    const content = await fileResponse.text();
                    return extractTrendingFromMarkdown(content);
                }
            }
        }
    } catch (error) {
        console.error('Error fetching latest trending data:', error);
    }
    
    // 如果获取失败，返回默认数据
    return TRENDING_DATA;
}

// 从精选项目Markdown文件中提取数据
async function getFeaturedProjects() {
    try {
        // 获取精选项目目录中的所有文件
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
                    // 提取文件名
                    const fileName = href.split('/').pop();
                    if (fileName.endsWith('.md')) {
                        mdFiles.push(fileName);
                    }
                }
            });
            
            // 按文件名排序
            mdFiles.sort();
            
            // 最多取6个文件
            const topFiles = mdFiles.slice(0, 6);
            
            // 读取每个文件的内容
            const projects = [];
            for (const fileName of topFiles) {
                const fileResponse = await fetch(`data/精选项目/${fileName}`);
                if (fileResponse.ok) {
                    const content = await fileResponse.text();
                    
                    // 提取项目信息
                    const nameMatch = content.match(/^# 📁 (.+)$/m);
                    const name = nameMatch ? nameMatch[1] : '未知项目';
                    
                    const urlMatch = content.match(/\*\*项目地址\*\*[：:]\s*\[([^\]]+)\]\(([^\)]+)\)/);
                    const url = urlMatch ? urlMatch[2] : '';
                    
                    const starsMatch = content.match(/\*\*Star 数\*\*[：:]\s*(\d+)/);
                    const stars = starsMatch ? starsMatch[1] : '0';
                    
                    const summaryMatch = content.match(/## 📝 项目总结\n\n([\s\S]+?)\n\n##/);
                    const summary = summaryMatch ? summaryMatch[1].trim() : '暂无总结';
                    
                    const recommendationMatch = content.match(/## 🌟 推荐指数\n\n(.+)/m);
                    const recommendation = recommendationMatch ? recommendationMatch[1].trim() : '⭐⭐⭐';
                    
                    // 生成ID
                    const id = `project-${fileName.replace('.md', '')}`;
                    
                    projects.push({
                        id: id,
                        name: name,
                        url: url,
                        stars: stars,
                        summary: summary,
                        recommendation: recommendation,
                        file: `data/精选项目/${fileName}`
                    });
                }
            }
            
            return projects;
        }
    } catch (error) {
        console.error('Error fetching featured projects:', error);
    }
    
    // 如果获取失败，返回默认数据
    return [
        {
            id: 'project-001',
            name: 'awesome-chatgpt-prompts',
            url: 'https://github.com/f/awesome-chatgpt-prompts',
            stars: '150000',
            summary: '这是一个收集了大量ChatGPT提示词的项目，包含各种场景下的实用提示词，帮助用户更好地与ChatGPT交互。',
            recommendation: '⭐⭐⭐⭐⭐'
        },
        {
            id: 'project-002',
            name: 'stable-diffusion-webui',
            url: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui',
            stars: '100000',
            summary: '这是一个基于Gradio库的Stable Diffusion浏览器界面，允许用户通过Web界面生成AI图像。',
            recommendation: '⭐⭐⭐⭐⭐'
        },
        {
            id: 'project-003',
            name: 'LangChain',
            url: 'https://github.com/langchain-ai/langchain',
            stars: '80000',
            summary: 'LangChain是一个用于构建基于大型语言模型(LLM)应用的框架，通过组合各种组件来创建复杂的AI应用。',
            recommendation: '⭐⭐⭐⭐⭐'
        },
        {
            id: 'project-004',
            name: 'tiktoken',
            url: 'https://github.com/openai/tiktoken',
            stars: '50000',
            summary: 'tiktoken是OpenAI开发的令牌化工具，用于将文本转换为令牌，这对于使用OpenAI API时的令牌计数非常重要。',
            recommendation: '⭐⭐⭐⭐'
        },
        {
            id: 'project-005',
            name: 'llama.cpp',
            url: 'https://github.com/ggerganov/llama.cpp',
            stars: '45000',
            summary: 'llama.cpp是Facebook LLaMA模型的C/C++移植版本，允许在CPU上高效运行大型语言模型。',
            recommendation: '⭐⭐⭐⭐⭐'
        },
        {
            id: 'project-006',
            name: 'whisper.cpp',
            url: 'https://github.com/ggerganov/whisper.cpp',
            stars: '40000',
            summary: 'whisper.cpp是OpenAI Whisper语音识别模型的C/C++移植版本，允许在CPU上高效运行语音识别。',
            recommendation: '⭐⭐⭐⭐'
        }
    ];
}

// 渲染精选项目卡片
function renderProjectCard(project) {
    return `
        <a href="article.html?id=${project.id}" class="article-card" data-article-id="${project.id}">
            <div class="card-accent accent-ai"></div>
            <div class="card-content">
                <div class="card-meta">
                    <span class="card-tag tag-ai">GitHub 项目</span>
                    <span class="card-readtime">⭐ ${project.stars}</span>
                </div>
                <h3 class="card-title">${project.name}</h3>
                <p class="card-desc">${project.summary}</p>
                <div class="card-footer">
                    <span class="card-recommendation">${project.recommendation}</span>
                    <span class="card-link">查看 →</span>
                </div>
            </div>
        </a>
    `;
}

// 初始化渲染
async function renderHomepage() {
    // 获取最新的热搜数据
    const latestTrendingData = await getLatestTrendingData();
    
    // 获取精选项目数据
    const featuredProjects = await getFeaturedProjects();
    
    // 渲染精选项目
    const articlesGrid = document.getElementById('articles-container');
    if (articlesGrid) {
        const projectsHTML = featuredProjects.map(project => renderProjectCard(project)).join('');
        articlesGrid.innerHTML = projectsHTML;
    }
    
    // 渲染热搜榜
    const trendingList = document.getElementById('trending-container');
    if (trendingList) {
        trendingList.innerHTML = renderTrendingList(latestTrendingData);
    }
    
    // 渲染搞钱排行
    const moneyGrid = document.getElementById('money-container');
    if (moneyGrid) {
        const moneyHTML = MONEY_DATA.map(item => renderMoneyCard(item)).join('');
        moneyGrid.innerHTML = moneyHTML;
    }
    
    // 渲染AI创意
    const creativeGrid = document.getElementById('creative-container');
    if (creativeGrid) {
        const creativeHTML = CREATIVE_DATA.map(item => renderCreativeCard(item)).join('');
        creativeGrid.innerHTML = creativeHTML;
    }
    
    // 渲染实战案例
    const caseGrid = document.getElementById('case-container');
    if (caseGrid) {
        const caseHTML = CASE_DATA.map(item => renderCaseCard(item)).join('');
        caseGrid.innerHTML = caseHTML;
    }
    
    // 渲染萌新学习
    const newbieGrid = document.getElementById('newbie-container');
    if (newbieGrid) {
        const newbieHTML = NEWBIE_DATA.map(item => renderNewbieCard(item)).join('');
        newbieGrid.innerHTML = newbieHTML;
    }
    
    // 渲染AI创作（文学创作）
    renderLiteratureWithFilter();
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', renderHomepage);
