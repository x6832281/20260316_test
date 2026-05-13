

async function getNewbieLearningData() {
    const items = [];

    try {
        const dirPath = 'data/萌新学习/';
        const encodedDirPath = encodeURI(dirPath);

        const dirResponse = await fetch(encodedDirPath);
        if (dirResponse.ok) {
            const html = await dirResponse.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const links = doc.querySelectorAll('a[href$=".md"]');
            const mdFiles = [];

            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href) {
                    const fileName = href.split('/').pop();
                    if (fileName.endsWith('.md')) {
                        mdFiles.push({href: href, name: decodeURIComponent(fileName)});
                    }
                }
            });

            mdFiles.sort((a, b) => a.name.localeCompare(b.name));

            const categoryMap = {
                '001': { category: '博主教程', icon: '🎓' },
                '002': { category: '博主教程', icon: '🎓' },
                '003': { category: '博主教程', icon: '🎓' },
                '004': { category: '博主教程', icon: '🎓' },
                '005': { category: '博主教程', icon: '🎓' },
                '006': { category: '博主教程', icon: '🎓' },
            };

            for (const file of mdFiles) {
                try {
                    const fileUrl = encodedDirPath + file.href;
                    const fileResponse = await fetch(fileUrl);
                    if (fileResponse.ok) {
                        const content = await fileResponse.text();

                        const titleMatch = content.match(/^# (.+)$/m);
                        const title = titleMatch ? titleMatch[1].trim() : file.name.replace('.md', '');

                        const summaryMatch = content.match(/## 📌 一句话总结\s*\n\s*\n\*\*(.+?)\*\*/);
                        const desc = summaryMatch ? summaryMatch[1].trim() : '';

                        const dateMatch = content.match(/\*\*发布时间\*\*[：:]\s*(.+)$/m);
                        const date = dateMatch ? dateMatch[1].trim() : new Date().toISOString().split('T')[0];

                        const filePrefix = file.name.match(/^(\d{3})/);
                        const prefix = filePrefix ? filePrefix[1] : '001';
                        const catInfo = categoryMap[prefix] || { category: '萌新学习', icon: '📘' };

                        const id = `newbie-${prefix}`;

                        items.push({
                            id: id,
                            title: title,
                            category: catInfo.category,
                            icon: catInfo.icon,
                            date: date,
                            desc: desc,
                            file: fileUrl,
                            fileName: file.name
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching ${file.name}:`, error);
                }
            }
        }
    } catch (error) {
        console.error('Error getting newbie learning data:', error);
    }

    if (items.length > 0) {
        return items;
    }

    return getFallbackNewbieData();
}

function getFallbackNewbieData() {
    return [
        {
            id: 'newbie-001',
            title: '数字生命卡兹克：AI 写作心法与去 AI 味技巧',
            category: '博主教程',
            icon: '🎓',
            date: '2026-04-27',
            desc: '学卡兹克的"去 AI 味"心法——让 AI 写出来的文字像人写的一样'
        },
        {
            id: 'newbie-002',
            title: '秋芝与宝玉：AI 工具避坑与提示词调教指南',
            category: '博主教程',
            icon: '🎓',
            date: '2026-04-27',
            desc: '秋芝教你找到对的路，宝玉教你走好每一步——工具选择 + 提示词技巧'
        },
        {
            id: 'newbie-003',
            title: '林亦 LYi 与武彬：AI 创作灵感与商业写作思维',
            category: '博主教程',
            icon: '🎓',
            date: '2026-04-27',
            desc: '林亦LYi 教你用 AI 打开脑洞找灵感，武彬教你用 AI 构建商业写作体系'
        },
        {
            id: 'newbie-004',
            title: 'AI 写作达人合集：世界观构建与故事内核',
            category: '博主教程',
            icon: '🎓',
            date: '2026-04-27',
            desc: '集合五位 AI 写作达人的精华——从世界观搭建到素材搜集的全链路方法论'
        },
        {
            id: 'newbie-005',
            title: 'AI 辅助网文写作：从大纲到连载的完整指南',
            category: '博主教程',
            icon: '🎓',
            date: '2026-04-27',
            desc: 'AI帮你写大纲、做设定、生成章节，再到续写连载——网文作者的AI生产力革命'
        },
        {
            id: 'newbie-006',
            title: 'AI 写作变现指南：从爱好到副业的进阶之路',
            category: '博主教程',
            icon: '🎓',
            date: '2026-04-27',
            desc: '用AI写作打造个人IP，接商单、做自媒体、写网文——零基础也能月入过万的变现路径'
        }
    ];
}

// 从文学理论Markdown文件中提取数据
async function getLiteraryTheoryData() {
    console.log('=== Starting getLiteraryTheoryData ===');
    const items = [];

    try {
        const dirPath = 'data/文学理论/';
        const encodedDirPath = encodeURI(dirPath);

        const dirResponse = await fetch(encodedDirPath);
        if (dirResponse.ok) {
            const html = await dirResponse.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const links = doc.querySelectorAll('a[href$=".md"]');
            const mdFiles = [];

            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href) {
                    const fileName = href.split('/').pop();
                    if (fileName.endsWith('.md')) {
                        mdFiles.push({href: href, name: decodeURIComponent(fileName)});
                    }
                }
            });

            mdFiles.sort((a, b) => a.name.localeCompare(b.name));
            const filesToProcess = mdFiles.slice(0, 6);

            const categoryMap = {
                '001': { category: '叙事学理论', icon: '📝' },
                '002': { category: '结构主义', icon: '🔍' },
                '003': { category: '读者批评', icon: '👁️' },
                '004': { category: '女性主义', icon: '♀️' },
                '005': { category: '后现代主义', icon: '🌀' },
                '006': { category: '比较文学', icon: '🌍' }
            };

            for (const file of filesToProcess) {
                try {
                    const fileUrl = encodedDirPath + file.href;
                    const fileResponse = await fetch(fileUrl);
                    if (fileResponse.ok) {
                        const content = await fileResponse.text();

                        const titleMatch = content.match(/^# (.+)$/m);
                        const title = titleMatch ? titleMatch[1].trim() : file.name.replace('.md', '');

                        const summaryMatch = content.match(/## 📌 一句话总结\s*\n\s*\n\*\*(.+?)\*\*/);
                        const desc = summaryMatch ? summaryMatch[1].trim() : '';

                        const dateMatch = content.match(/\*\*发布时间\*\*[：:]\s*(.+)$/m);
                        const date = dateMatch ? dateMatch[1].trim() : new Date().toISOString().split('T')[0];

                        const filePrefix = file.name.match(/^(\d{3})/);
                        const prefix = filePrefix ? filePrefix[1] : '001';
                        const catInfo = categoryMap[prefix] || { category: '文学理论', icon: '🎓' };

                        const id = `littheory-${prefix}`;

                        items.push({
                            id: id,
                            title: title,
                            category: catInfo.category,
                            icon: catInfo.icon,
                            date: date,
                            desc: desc,
                            file: fileUrl
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching ${file.name}:`, error);
                }
            }
        }
    } catch (error) {
        console.error('Error getting literary theory data:', error);
    }

    if (items.length > 0) {
        return items;
    }

    return getFallbackLiteraryTheoryData();
}

function getFallbackLiteraryTheoryData() {
    return [
        {
            id: 'littheory-001',
            title: '叙事学入门：故事如何被讲述',
            category: '杨宁·文学理论',
            icon: '📝',
            date: '2026-04-28',
            desc: '杨宁老师B站千万播放课程，从普罗普到热奈特的叙事语法——故事如何被讲述？'
        },
        {
            id: 'littheory-002',
            title: '结构主义文学理论：文本背后的深层结构',
            category: '杨宁·西方文论',
            icon: '🔍',
            date: '2026-04-28',
            desc: '索绪尔能指与所指，列维-斯特劳斯神话结构——杨宁《西方文论》系统讲解'
        },
        {
            id: 'littheory-003',
            title: '读者批评理论：文本在读者心中重生',
            category: '杨宁·文学理论',
            icon: '👁️',
            date: '2026-04-28',
            desc: '"你是否看到一只鸡？"杨宁第二季课程深入接受美学与读者反应批评'
        },
        {
            id: 'littheory-004',
            title: '女性主义文学批评：重读经典中的她者之声',
            category: '杨宁·西方文论',
            icon: '♀️',
            date: '2026-04-28',
            desc: '杨宁症候阅读法拆解童话——从伍尔夫到斯皮瓦克的女性主义批评全脉络'
        },
        {
            id: 'littheory-005',
            title: '后现代主义文学理论：意义之塔的崩塌',
            category: '杨宁/樊星',
            icon: '🌀',
            date: '2026-04-28',
            desc: '德里达解构、鲍德里亚拟像——杨宁西方文论+武大樊星专题研究双推荐'
        },
        {
            id: 'littheory-006',
            title: '比较文学：跨越语言与文化的理论视野',
            category: '乐黛云/欧丽娟',
            icon: '🌍',
            date: '2026-04-28',
            desc: '北大乐黛云比较文学+台大欧丽娟中国文学史——跨文化视野的双重盛宴'
        }
    ];
}


// AI写作数据（文学创作）
async function getBookExcerpts() {
    const excerpts = [];

    try {
        const dirPath = 'data/书摘文案/';
        const encodedDirPath = encodeURI(dirPath);

        const dirResponse = await fetch(encodedDirPath);
        if (dirResponse.ok) {
            const html = await dirResponse.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const links = doc.querySelectorAll('a[href$=".md"]');
            const mdFiles = [];

            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href) {
                    const fileName = href.split('/').pop();
                    if (fileName.endsWith('.md')) {
                        mdFiles.push({href: href, name: decodeURIComponent(fileName)});
                    }
                }
            });

            mdFiles.sort((a, b) => a.name.localeCompare(b.name));
            const filesToProcess = mdFiles.slice(0, 6);

            const categoryMap = {
                '001': { category: '经典书摘', icon: '📖' },
                '002': { category: '名人名言', icon: '🏛️' },
                '003': { category: '经典书评', icon: '✍️' },
                '004': { category: '微信读书', icon: '📱' },
                '005': { category: '网络热梗', icon: '🔥' },
                '006': { category: '高赞文案', icon: '🌟' }
            };

            for (const file of filesToProcess) {
                try {
                    const fileUrl = encodedDirPath + file.href;
                    const fileResponse = await fetch(fileUrl);
                    if (fileResponse.ok) {
                        const content = await fileResponse.text();

                        const titleMatch = content.match(/^# (.+)$/m);
                        const title = titleMatch ? titleMatch[1].trim() : file.name.replace('.md', '');

                        const summaryMatch = content.match(/## 📌 一句话总结\s*\n\s*\n*\*\*(.+?)\*\*/);
                        const desc = summaryMatch ? summaryMatch[1].trim() : '';

                        const dateMatch = content.match(/\*\*发布时间\*\*[：:]\s*(.+)$/m);
                        const date = dateMatch ? dateMatch[1].trim() : new Date().toISOString().split('T')[0];

                        const filePrefix = file.name.match(/^(\d{3})/);
                        const prefix = filePrefix ? filePrefix[1] : '001';
                        const catInfo = categoryMap[prefix] || { category: '书摘文案', icon: '📖' };

                        const id = `book-excerpt-${file.name.replace('.md', '').replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-').substring(0, 30)}`;

                        excerpts.push({
                            id: id,
                            title: title,
                            category: catInfo.category,
                            icon: catInfo.icon,
                            date: date,
                            desc: desc,
                            file: fileUrl
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching ${file.name}:`, error);
                }
            }
        }
    } catch (error) {
        console.error('Error getting book excerpts:', error);
    }

    if (excerpts.length > 0) {
        return excerpts;
    }

    return getFallbackBookExcerpts();
}

function getFallbackBookExcerpts() {
    return [
        {
            id: 'book-excerpt-001',
            title: '经典书摘：那些直击灵魂的句子',
            category: '经典书摘',
            icon: '📖',
            date: '2026-04-26',
            desc: '那些被无数人划线、摘抄、反复品味的句子，每一句都是作者用一生写就的真理'
        },
        {
            id: 'book-excerpt-002',
            title: '名人名言：智者的一句话，胜过普通人的一生',
            category: '名人名言',
            icon: '🏛️',
            date: '2026-04-26',
            desc: '那些穿越时空的名言，每一句背后都是一个人用血泪换来的领悟'
        },
        {
            id: 'book-excerpt-003',
            title: '经典书评：一本书最好的注脚',
            category: '经典书评',
            icon: '✍️',
            date: '2026-04-26',
            desc: '好的书评能穿透纸背，直抵灵魂——它不仅是读后感，更是一个人与一本书的深度对话'
        },
        {
            id: 'book-excerpt-004',
            title: '微信读书高赞划线：百万读者共同标注的灵魂之句',
            category: '微信读书',
            icon: '📱',
            date: '2026-04-26',
            desc: '微信读书里被划线过万的句子，是百万读者用指尖投出的票'
        },
        {
            id: 'book-excerpt-005',
            title: '网络热梗与流行语：冲浪必备语言指南',
            category: '网络热梗',
            icon: '🔥',
            date: '2026-04-26',
            desc: '看不懂这些梗，你真的没法冲浪了！'
        },
        {
            id: 'book-excerpt-006',
            title: '抖音小红书高赞文案：爆款句子的秘密',
            category: '高赞文案',
            icon: '🌟',
            date: '2026-04-26',
            desc: '那些在抖音和小红书上获赞百万的句子，不是偶然爆火——它们精准击中了无数人的情绪'
        }
    ];
}

// 渲染文学理论卡片
function renderLiteraryTheoryCard(item) {
    const fileParam = item.file ? `&file=${encodeURIComponent(item.file)}` : '';
    return `
        <a href="article.html?id=${item.id}${fileParam}" class="littheory-card" data-littheory-id="${item.id}">
            <div class="littheory-icon">${item.icon || '🎓'}</div>
            <div class="littheory-content">
                <div class="littheory-meta">
                    <span class="littheory-category">${item.category}</span>
                    <time class="littheory-date">${item.date}</time>
                </div>
                <h3 class="littheory-title">${item.title}</h3>
                <p class="littheory-desc">${item.desc}</p>
                <span class="littheory-link">查看详情 →</span>
            </div>
        </a>
    `;
}


// 渲染萌新学习卡片
function renderNewbieCard(item, index) {
    const fileParam = item.fileName ? `&file=${encodeURIComponent(item.fileName)}` : '';
    const num = String(index + 1).padStart(2, '0');
    return `
        <a href="article.html?id=${item.id}${fileParam}" class="newbie-card accent-tutorial" data-newbie-id="${item.id}" style="animation-delay: ${index * 0.08}s">
            <div class="newbie-card-accent"></div>
            <span class="newbie-card-num">${num}</span>
            <div class="newbie-card-body">
                <div class="newbie-card-header">
                    <span class="newbie-card-icon">${item.icon}</span>
                    <span class="newbie-card-category">${item.category}</span>
                </div>
                <h3 class="newbie-card-title">${item.title}</h3>
                <p class="newbie-card-desc">${item.desc}</p>
                <div class="newbie-card-footer">
                    <time class="newbie-card-date">${item.date}</time>
                    <span class="newbie-card-arrow">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                </div>
            </div>
        </a>
    `;
}

// 渲染文学创作卡片
function renderLiteratureCard(item) {
    const fileParam = item.file ? `&file=${encodeURIComponent(item.file)}` : '';
    return `
        <a href="article.html?id=${item.id}${fileParam}" class="literature-card" data-literature-id="${item.id}">
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
async function renderLiteratureWithFilter() {
    const container = document.getElementById('literature-container');
    if (!container) return;

    const literatureData = await getBookExcerpts();

    const filterHtml = `
        <div class="literature-filter">
            <button class="literature-filter-btn active" data-category="all">全部</button>
            <button class="literature-filter-btn" data-category="经典书摘">书摘</button>
            <button class="literature-filter-btn" data-category="名人名言">名言</button>
            <button class="literature-filter-btn" data-category="经典书评">书评</button>
            <button class="literature-filter-btn" data-category="网络热梗">热梗</button>
        </div>
    `;

    const cardsHtml = literatureData.map(item => renderLiteratureCard(item)).join('');

    container.innerHTML = filterHtml + `<div class="literature-grid">${cardsHtml}</div>`;

    const filterBtns = container.querySelectorAll('.literature-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

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

async function renderNewbieWithFilter() {
    const container = document.getElementById('newbie-container');
    if (!container) return;

    const newbieData = await getNewbieLearningData();

    const filterHtml = `
        <div class="newbie-filter">
            <span class="newbie-filter-label">筛选</span>
            <button class="newbie-filter-btn active" data-category="all">全部文章</button>
            <button class="newbie-filter-btn" data-category="博主教程">🎓 博主教程</button>
        </div>
    `;

    const cardsHtml = newbieData.map((item, i) => renderNewbieCard(item, i)).join('');

    container.innerHTML = filterHtml + `<div class="newbie-grid">${cardsHtml}</div>`;

    const filterBtns = container.querySelectorAll('.newbie-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.category;
            const cards = container.querySelectorAll('.newbie-card');
            cards.forEach(card => {
                const cardCategory = card.querySelector('.newbie-card-category').textContent;
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
        const fileResponse = await fetch('data/热搜排行/hot-search-latest.md');
        if (fileResponse.ok) {
            const content = await fileResponse.text();
            return extractTrendingFromMarkdown(content);
        }
    } catch (error) {
        console.error('Error fetching latest trending data:', error);
    }
    
    return [];
}

// 从精选项目Markdown文件中提取数据
async function getFeaturedProjects() {
    const projects = [];
    
    try {
        // 尝试获取目录中的所有文件
        const dirPath = 'data/精选项目/';
        const encodedDirPath = encodeURI(dirPath);
        
        const dirResponse = await fetch(encodedDirPath);
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
                        mdFiles.push({href: href, name: decodeURIComponent(fileName)});
                    }
                }
            });
            
            mdFiles.sort((a, b) => a.name.localeCompare(b.name));
            const filesToProcess = mdFiles.slice(0, 6);
            
            for (const file of filesToProcess) {
                try {
                    const fileUrl = encodedDirPath + file.href;
                    console.log('Fetching project file:', fileUrl);
                    const fileResponse = await fetch(fileUrl);
                    if (fileResponse.ok) {
                        const content = await fileResponse.text();
                        console.log('Successfully loaded:', file.name, 'Content length:', content.length);
                        
                        // 提取项目信息
                        const nameMatch = content.match(/^# (.+)$/m);
                        const name = nameMatch ? nameMatch[1].trim() : '未知项目';
                        
                        const urlMatch = content.match(/## 🔗 相关链接\n\n-\s*\[GitHub 仓库\]\(([^)]+)\)/);
                        const url = urlMatch ? urlMatch[1] : '';
                        
                        // 提取星标数，支持带k的格式
                        const starsMatch = content.match(/\*\*⭐ 星标\*\*[：:]\s*([\d.]+k?)/);
                        let stars = 0;
                        if (starsMatch) {
                            const starsStr = starsMatch[1];
                            if (starsStr.endsWith('k')) {
                                stars = parseInt(parseFloat(starsStr.replace('k', '')) * 1000);
                            } else {
                                stars = parseInt(starsStr);
                            }
                        }
                        
                        // 提取一句话总结，使用更精确的匹配
                        let summary = '暂无总结';
                        // 首先尝试匹配标准格式
                        const summaryMatch = content.match(/## 📝 一句话总结\s*\n\s*([^\n]+)\s*\n/);
                        if (summaryMatch && summaryMatch[1]) {
                            summary = summaryMatch[1].trim();
                        } else {
                            // 如果标准格式匹配失败，尝试其他格式
                            const altSummaryMatch = content.match(/## 📝 一句话总结[\s\S]*?([^\n]+)\s*\n/);
                            if (altSummaryMatch && altSummaryMatch[1]) {
                                summary = altSummaryMatch[1].trim();
                            }
                        }
                        
                        // 确保只保留一句话，移除多余内容
                        summary = summary.split('。')[0] + '。';
                        if (summary.length > 100) {
                            summary = summary.substring(0, 100) + '...';
                        }
                        
                        console.log('Extracted for', file.name, '- name:', name, 'stars:', stars, 'summary:', summary);
                        
                        const id = `project-${file.name.replace('.md', '')}`;
                        
                        projects.push({
                            id: id,
                            name: name,
                            url: url,
                            stars: stars,
                            summary: summary,
                            file: fileUrl
                        });
                    } else {
                        console.warn('Failed to fetch:', file.name, 'Status:', fileResponse.status);
                    }
                } catch (error) {
                    console.error(`Error fetching ${file.name}:`, error);
                }
            }
        } else {
            console.warn('Failed to fetch directory:', dirResponse.status);
        }
    } catch (error) {
        console.error('Error getting featured projects:', error);
    }
    
    console.log('Total projects loaded:', projects.length);
    
    // 如果成功获取到项目，返回
    if (projects.length > 0) {
        return projects;
    }
    
    // 如果获取失败，返回默认数据
    return [
        {
            id: 'project-001-awesome-chatgpt-prompts',
            name: 'awesome-chatgpt-prompts',
            url: 'https://github.com/f/awesome-chatgpt-prompts',
            stars: 150000,
            summary: '这是一个收集了大量ChatGPT提示词的项目，包含各种场景下的实用提示词，帮助用户更好地与ChatGPT交互。'
        },
        {
            id: 'project-002-awesome-python',
            name: 'awesome-python',
            url: 'https://github.com/vinta/awesome-python',
            stars: 170000,
            summary: '这是一个精选的Python框架、库、软件和资源列表，帮助开发者快速找到合适的Python工具。'
        },
        {
            id: 'project-003-awesome-ai',
            name: 'awesome-ai',
            url: 'https://github.com/jayhack/awesome-ai',
            stars: 60000,
            summary: '这是一个精心策划的AI资源列表，涵盖了人工智能领域的各种工具、框架和项目。'
        },
        {
            id: 'project-004-stable-diffusion-webui',
            name: 'stable-diffusion-webui',
            url: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui',
            stars: 100000,
            summary: '这是一个基于Gradio库的Stable Diffusion浏览器界面，允许用户通过Web界面生成AI图像。'
        },
        {
            id: 'project-005-LangChain',
            name: 'LangChain',
            url: 'https://github.com/langchain-ai/langchain',
            stars: 80000,
            summary: 'LangChain是一个用于构建基于大型语言模型(LLM)应用的框架，通过组合各种组件来创建复杂的AI应用。'
        },
        {
            id: 'project-006-llama.cpp',
            name: 'llama.cpp',
            url: 'https://github.com/ggerganov/llama.cpp',
            stars: 45000,
            summary: 'llama.cpp是Facebook LLaMA模型的C/C++移植版本，允许在CPU上高效运行大型语言模型。'
        }
    ];
}

// 从知识创作Markdown文件中提取数据
async function getKnowledgeCreationData() {
    const projects = [];

    try {
        const dirPath = 'data/知识创作/';
        const encodedDirPath = encodeURI(dirPath);

        const dirResponse = await fetch(encodedDirPath);
        if (dirResponse.ok) {
            const html = await dirResponse.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const links = doc.querySelectorAll('a[href$=".md"]');
            const mdFiles = [];

            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href) {
                    const fileName = href.split('/').pop();
                    if (fileName.endsWith('.md')) {
                        mdFiles.push({href: href, name: decodeURIComponent(fileName)});
                    }
                }
            });

            mdFiles.sort((a, b) => a.name.localeCompare(b.name));
            const filesToProcess = mdFiles.slice(0, 12);

            for (const file of filesToProcess) {
                try {
                    const fileUrl = encodedDirPath + file.href;
                    const fileResponse = await fetch(fileUrl);
                    if (fileResponse.ok) {
                        const content = await fileResponse.text();

                        const nameMatch = content.match(/^# (.+)$/m);
                        const name = nameMatch ? nameMatch[1].trim() : '未知项目';

                        const urlMatch = content.match(/\[GitHub 仓库\]\(([^)]+)\)/);
                        const url = urlMatch ? urlMatch[1] : '';

                        const starsMatch = content.match(/\*\*⭐ 星标\*\*[：:]\s*([\d.]+k?)/);
                        let stars = 0;
                        if (starsMatch) {
                            const starsStr = starsMatch[1];
                            if (starsStr.endsWith('k')) {
                                stars = parseInt(parseFloat(starsStr.replace('k', '')) * 1000);
                            } else {
                                stars = parseInt(starsStr);
                            }
                        }

                        const summaryMatch = content.match(/## 📝 一句话总结\s*\n\s*\n\*\*(.+?)\*\*/);
                        let summary = '暂无总结';
                        if (summaryMatch && summaryMatch[1]) {
                            summary = summaryMatch[1].trim();
                        } else {
                            const altMatch = content.match(/## 📝 一句话总结\s*\n\s*([^\n]+)/);
                            if (altMatch && altMatch[1]) {
                                summary = altMatch[1].trim();
                            }
                        }

                        const dateMatch = content.match(/\*\*📅 更新日期\*\*[：:]\s*([^\n]+)/);
                        const date = dateMatch ? dateMatch[1].trim() : new Date().toISOString().split('T')[0];

                        const id = `knowledge-${file.name.replace('.md', '')}`;

                        projects.push({
                            id: id,
                            name: name,
                            url: url,
                            stars: stars,
                            summary: summary,
                            date: date,
                            file: fileUrl,
                            fileName: file.name
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching ${file.name}:`, error);
                }
            }
        }
    } catch (error) {
        console.error('Error getting knowledge creation data:', error);
    }

    if (projects.length > 0) {
        return projects;
    }

    return getFallbackKnowledgeCreationData();
}

function getFallbackKnowledgeCreationData() {
    return [
        {
            id: 'knowledge-001-gpt-academic',
            name: 'gpt_academic —— AI 学术写作助手',
            url: 'https://github.com/binary-husky/gpt_academic',
            stars: 65000,
            summary: '中科院出品的高颜值AI学术写作助手，支持论文润色、翻译、代码解读、PDF分析等一站式学术写作功能。',
            date: '2026-04-27',
            fileName: '001-gpt-academic.md'
        },
        {
            id: 'knowledge-002-langchain',
            name: 'LangChain —— AI 写作流水线框架',
            url: 'https://github.com/langchain-ai/langchain',
            stars: 95000,
            summary: '构建AI写作流水线的终极框架，用链式调用串联搜集→分析→大纲→写作→润色→检查全流程。',
            date: '2026-04-27',
            fileName: '002-langchain.md'
        },
        {
            id: 'knowledge-003-lobe-chat',
            name: 'LobeChat —— 现代化 AI 写作对话平台',
            url: 'https://github.com/lobehub/lobe-chat',
            stars: 48000,
            summary: '颜值最高的开源ChatGPT网页客户端，支持多模型、插件市场、知识库，是AI写作的绝佳前端。',
            date: '2026-04-27',
            fileName: '003-lobe-chat.md'
        },
        {
            id: 'knowledge-004-chatgpt-next-web',
            name: 'ChatGPT Next Web —— 一键部署写作助手',
            url: 'https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web',
            stars: 78000,
            summary: 'GitHub上最火的ChatGPT私有化部署方案，一键拥有跨平台的AI写作助手，支持手机/电脑/平板。',
            date: '2026-04-27',
            fileName: '004-chatgpt-next-web.md'
        },
        {
            id: 'knowledge-005-dify',
            name: 'Dify —— LLM 应用开发与知识创作平台',
            url: 'https://github.com/langgenius/dify',
            stars: 52000,
            summary: '国产开源的LLM应用开发平台，可视化构建AI知识库、写作助手和内容生成流水线。',
            date: '2026-04-27',
            fileName: '005-dify.md'
        },
        {
            id: 'knowledge-006-open-interpreter',
            name: 'Open Interpreter —— 自然语言操控电脑做研究',
            url: 'https://github.com/OpenInterpreter/open-interpreter',
            stars: 56000,
            summary: '用自然语言让AI操控你的电脑——自动搜集资料、分析数据、生成报告，知识创作的超级助手。',
            date: '2026-04-27',
            fileName: '006-open-interpreter.md'
        },
        {
            id: 'knowledge-007-chatpaper',
            name: 'ChatPaper —— AI 论文阅读与翻译工具',
            url: 'https://github.com/kaixindelele/ChatPaper',
            stars: 18000,
            summary: 'arXiv论文一键翻译+摘要，AI辅助文献综述，科研写作者必备的论文阅读加速器。',
            date: '2026-04-27',
            fileName: '007-chatpaper.md'
        },
        {
            id: 'knowledge-008-ollama',
            name: 'Ollama —— 本地运行大模型，隐私写作利器',
            url: 'https://github.com/ollama/ollama',
            stars: 105000,
            summary: '一键在本地运行Llama、Qwen、DeepSeek等大模型，写作数据不出电脑，隐私创作者的终极方案。',
            date: '2026-04-27',
            fileName: '008-ollama.md'
        },
        {
            id: 'knowledge-009-anything-llm',
            name: 'AnythingLLM —— 全功能桌面 AI 写作伴侣',
            url: 'https://github.com/Mintplex-Labs/anything-llm',
            stars: 32000,
            summary: '把任何文档变成AI知识库，全能型桌面AI应用，写作、研究、整理一站式搞定。',
            date: '2026-04-27',
            fileName: '009-anything-llm.md'
        },
        {
            id: 'knowledge-010-fastgpt',
            name: 'FastGPT —— AI 知识库问答与内容生成平台',
            url: 'https://github.com/labring/FastGPT',
            stars: 22000,
            summary: '国产开源AI知识库平台，拖拽式构建写作助手，支持RAG检索增强生成，让AI基于你的素材写作。',
            date: '2026-04-27',
            fileName: '010-fastgpt.md'
        },
        {
            id: 'knowledge-011-prompt-engineering',
            name: 'AI 写作提示词工程 —— 从入门到精通',
            url: '',
            stars: 0,
            summary: '掌握提示词工程的5个核心技巧，让你的AI写作质量从"能用"飞跃到"专业"，告别AI味和流水账。',
            date: '2026-04-27',
            fileName: '011-prompt-engineering.md'
        },
        {
            id: 'knowledge-012-toolchain',
            name: 'AI 写作工具链 —— 从灵感到发布的完整工作流',
            url: '',
            stars: 0,
            summary: '搭建专属的AI写作工具链：灵感搜集→大纲构建→AI写作→润色→发布，每个环节都有最佳开源工具推荐。',
            date: '2026-04-27',
            fileName: '012-toolchain.md'
        },
        {
            id: 'knowledge-013-ecosystem',
            name: '开源 AI 写作生态全景图 —— 2026 年度总结',
            url: '',
            stars: 0,
            summary: '一张图看遍2026年AI写作开源生态：基础模型→推理框架→写作前端→知识库→发布工具，全部开源免费。',
            date: '2026-04-27',
            fileName: '013-ecosystem.md'
        },
        {
            id: 'knowledge-014-ai-writing-guide',
            name: 'AI 写作风格指南 —— 打造个人化写作风格',
            url: '',
            stars: 0,
            summary: '告别千篇一律的AI味，学会训练AI模仿你的写作风格——从用词习惯、句式节奏到情感表达，全方位打造专属文风。',
            date: '2026-04-27',
            fileName: '014-ai-writing-guide.md'
        },
        {
            id: 'knowledge-015-content-matrix',
            name: 'AI 内容矩阵搭建 —— 多平台分发策略',
            url: '',
            stars: 0,
            summary: '用AI一次性生成适配知乎、小红书、公众号、抖音等不同平台的内容版本，一篇变多篇，效率翻倍。',
            date: '2026-04-27',
            fileName: '015-content-matrix.md'
        }
    ];
}

function renderKnowledgeCreationCard(project, index) {
    const num = String(index + 1).padStart(2, '0');
    const formattedStars = formatStars(project.stars);
    const projectName = project.name.replace(/⭐/g, '').trim();
    const hasStars = project.stars > 0;
    const categoryLabel = hasStars ? `⭐ ${formattedStars}` : '📘 指南';
    const cardIcon = hasStars ? '📦' : '📘';

    return `
        <a href="article.html?id=${project.id}" class="newbie-card accent-knowledge" style="animation-delay: ${index * 0.08}s">
            <div class="newbie-card-accent"></div>
            <span class="newbie-card-num">${num}</span>
            <div class="newbie-card-body">
                <div class="newbie-card-header">
                    <span class="newbie-card-icon">${cardIcon}</span>
                    <span class="newbie-card-category">${categoryLabel}</span>
                </div>
                <h3 class="newbie-card-title">${projectName}</h3>
                <p class="newbie-card-desc">${project.summary}</p>
                <div class="newbie-card-footer">
                    <time class="newbie-card-date">${project.date}</time>
                    <span class="newbie-card-arrow">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                </div>
            </div>
        </a>
    `;
}

async function renderKnowledgeCreationWithFilter() {
    const container = document.getElementById('knowledge-creation-container');
    if (!container) return;

    const knowledgeData = await getKnowledgeCreationData();

    const cardsHtml = knowledgeData.map((item, i) => renderKnowledgeCreationCard(item, i)).join('');

    container.innerHTML = `<div class="newbie-grid">${cardsHtml}</div>`;
}

// 格式化star数，使用k结尾
function formatStars(stars) {
    if (stars >= 1000) {
        return (stars / 1000).toFixed(1) + 'k';
    }
    return stars;
}

// 渲染精选项目卡片
function renderProjectCard(project) {
    let summary = project.summary;
    if (!/[\u4e00-\u9fa5]/.test(summary)) {
        summary = "这是一个热门项目，受到了众多开发者的关注和贡献。";
    }
    
    const formattedStars = formatStars(project.stars);
    const projectName = project.name.replace(/⭐/g, '').trim();
    
    return `
        <a href="article.html?id=${project.id}" class="article-card" data-article-id="${project.id}">
            <div class="card-accent accent-ai"></div>
            <div class="card-content">
                <div class="card-meta">
                    <span class="card-readtime">⭐ ${formattedStars}</span>
                </div>
                <h3 class="card-title">${projectName}</h3>
                <p class="card-desc">${summary}</p>
                <div class="card-footer">
                    <span class="card-link">查看 →</span>
                </div>
            </div>
        </a>
    `;
}

async function getBookAnalysisData() {
    const items = [];

    try {
        const dirPath = 'data/拆书心得/';
        const encodedDirPath = encodeURI(dirPath);

        const dirResponse = await fetch(encodedDirPath);
        if (dirResponse.ok) {
            const html = await dirResponse.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const links = doc.querySelectorAll('a[href$=".md"]');
            const mdFiles = [];

            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href) {
                    const fileName = href.split('/').pop();
                    if (fileName.endsWith('.md')) {
                        mdFiles.push({href: href, name: decodeURIComponent(fileName)});
                    }
                }
            });

            mdFiles.sort((a, b) => a.name.localeCompare(b.name));

            const categoryMap = {
                '001': { category: '呼兰河传', icon: '🌊' },
                '002': { category: '呼兰河传', icon: '👁️' },
                '003': { category: '呼兰河传', icon: '⛓️' },
                '004': { category: '呼兰河传', icon: '👥' },
                '005': { category: '呼兰河传', icon: '🌱' },
                '006': { category: '呼兰河传', icon: '✨' },
                '007': { category: '红楼梦', icon: '🌸' },
                '008': { category: '红楼梦', icon: '🎭' },
                '009': { category: '红楼梦', icon: '🦋' },
                '010': { category: '红楼梦', icon: '🔥' },
                '011': { category: '红楼梦', icon: '⚡' },
                '012': { category: '红楼梦', icon: '🖐️' },
                '013': { category: '活着', icon: '🐂' },
                '014': { category: '活着', icon: '💉' },
                '015': { category: '活着', icon: '🤍' },
                '016': { category: '活着', icon: '🫘' },
                '017': { category: '百年孤独', icon: '🧊' },
                '018': { category: '百年孤独', icon: '🌍' },
                '019': { category: '百年孤独', icon: '🌀' },
                '020': { category: 'AI拆书方法论', icon: '🤖' },
                '021': { category: 'AI拆书方法论', icon: '📋' }
            };

            for (const file of mdFiles) {
                try {
                    const fileUrl = encodedDirPath + file.href;
                    const fileResponse = await fetch(fileUrl);
                    if (fileResponse.ok) {
                        const content = await fileResponse.text();

                        const titleMatch = content.match(/^# (.+)$/m);
                        const title = titleMatch ? titleMatch[1].trim() : file.name.replace('.md', '');

                        const summaryMatch = content.match(/## 📌 一句话总结\s*\n\s*\n\*\*(.+?)\*\*/);
                        const desc = summaryMatch ? summaryMatch[1].trim() : '';

                        const dateMatch = content.match(/\*\*发布时间\*\*[：:]\s*(.+)$/m);
                        const date = dateMatch ? dateMatch[1].trim() : new Date().toISOString().split('T')[0];

                        const filePrefix = file.name.match(/^(\d{3})/);
                        const prefix = filePrefix ? filePrefix[1] : '001';
                        const catInfo = categoryMap[prefix] || { category: '拆书心得', icon: '📚' };

                        const id = `book-analysis-${prefix}`;

                        items.push({
                            id: id,
                            title: title,
                            category: catInfo.category,
                            icon: catInfo.icon,
                            date: date,
                            desc: desc,
                            file: fileUrl,
                            fileName: file.name
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching ${file.name}:`, error);
                }
            }
        }
    } catch (error) {
        console.error('Error getting book analysis data:', error);
    }

    if (items.length > 0) {
        return items;
    }

    return getFallbackBookAnalysisData();
}

function getFallbackBookAnalysisData() {
    return [
        {
            id: 'book-analysis-007',
            title: '红楼梦·黛玉葬花：中国文学最伟大的独白',
            category: '红楼梦',
            icon: '🌸',
            date: '2026-05-01',
            desc: '黛玉葬花不是哭花，是哭自己——曹雪芹用一首葬花吟，写出了中国文学中最绝望也最清醒的自我认知',
            fileName: '007-红楼梦-黛玉葬花-中国文学最伟大的独白.md'
        },
        {
            id: 'book-analysis-008',
            title: '红楼梦·刘姥姥进大观园：喜剧外壳下的残酷内核',
            category: '红楼梦',
            icon: '🎭',
            date: '2026-05-01',
            desc: '所有人都笑刘姥姥，但刘姥姥才是大观园里唯一清醒的人——曹雪芹用一场闹剧写出了最深刻的阶级寓言',
            fileName: '008-红楼梦-刘姥姥进大观园-喜剧外壳下的残酷内核.md'
        },
        {
            id: 'book-analysis-009',
            title: '红楼梦·宝钗扑蝶：完美人设的裂缝',
            category: '红楼梦',
            icon: '🦋',
            date: '2026-05-01',
            desc: '宝钗扑蝶是最"不像宝钗"的一幕——而恰恰是这不像，暴露了她完美人设下最深的裂缝',
            fileName: '009-红楼梦-宝钗扑蝶-完美人设的裂缝.md'
        },
        {
            id: 'book-analysis-010',
            title: '红楼梦·王熙凤出场：未见其人先闻其声的叙事革命',
            category: '红楼梦',
            icon: '🔥',
            date: '2026-05-01',
            desc: '王熙凤的出场改写了中国小说的人物登场规则——曹雪芹用一声笑完成了别人用三千字都做不到的人物塑造',
            fileName: '010-红楼梦-王熙凤出场-未见其人先闻其声的叙事革命.md'
        },
        {
            id: 'book-analysis-011',
            title: '红楼梦·宝玉挨打：父权暴力的全息投影',
            category: '红楼梦',
            icon: '⚡',
            date: '2026-05-01',
            desc: '贾政打的不只是宝玉的屁股，打的是整个贾府所有人对"正确人生"的恐惧——每个人的反应都是一份权力关系的供词',
            fileName: '011-红楼梦-宝玉挨打-父权暴力的全息投影.md'
        },
        {
            id: 'book-analysis-012',
            title: '红楼梦·晴雯撕扇：尊严比扇子贵',
            category: '红楼梦',
            icon: '🖐️',
            date: '2026-05-01',
            desc: '晴雯撕的不是扇子，是"奴才就该低人一等"的规矩——曹雪芹用一个丫鬟的疯狂举动写出了最壮烈的尊严宣言',
            fileName: '012-红楼梦-晴雯撕扇-尊严比扇子贵.md'
        },
        {
            id: 'book-analysis-013',
            title: '活着·福贵买牛：极简叙事的终极力量',
            category: '活着',
            icon: '🐂',
            date: '2026-05-01',
            desc: '余华用最少的字写出了最重的痛——当所有亲人都死了，福贵买了一头老牛，给它取名"福贵"，然后继续活着',
            fileName: '013-活着-福贵买牛-极简叙事的终极力量.md'
        },
        {
            id: 'book-analysis-014',
            title: '活着·有庆之死：荒诞比残忍更残忍',
            category: '活着',
            icon: '💉',
            date: '2026-05-01',
            desc: '一个孩子被活活抽血抽死，为了救县长夫人——余华用最荒诞的死法写出了最真实的制度暴力',
            fileName: '014-活着-有庆之死-荒诞比残忍更残忍.md'
        },
        {
            id: 'book-analysis-015',
            title: '活着·家珍：沉默的重量',
            category: '活着',
            icon: '🤍',
            date: '2026-05-01',
            desc: '家珍是《活着》中最安静的人，但她的沉默比福贵的讲述更有力量——余华用一个不说话的女人写出了最深的坚韧',
            fileName: '015-活着-家珍-沉默的重量.md'
        },
        {
            id: 'book-analysis-016',
            title: '活着·苦根之死：最后一根稻草的荒诞',
            category: '活着',
            icon: '🫘',
            date: '2026-05-01',
            desc: '苦根被豆子撑死——这是《活着》中最荒诞的死法，也是余华对"苦难叙事"最决绝的回答',
            fileName: '016-活着-苦根之死-最后一根稻草的荒诞.md'
        },
        {
            id: 'book-analysis-017',
            title: '百年孤独·开头：一句话改写了小说史',
            category: '百年孤独',
            icon: '🧊',
            date: '2026-05-01',
            desc: '"多年以后，面对行刑队"——这一句话同时站在了过去、现在和未来，改写了整个小说的叙事语法',
            fileName: '017-百年孤独-开头-一句话改写了小说史.md'
        },
        {
            id: 'book-analysis-018',
            title: '百年孤独·丽贝卡吃土：孤独的味觉',
            category: '百年孤独',
            icon: '🌍',
            date: '2026-05-01',
            desc: '丽贝卡吃土不是病，是她唯一能消化的东西——马尔克斯用一个吃土的女孩写出了孤独最原始的味觉',
            fileName: '018-百年孤独-丽贝卡吃土-孤独的味觉.md'
        },
        {
            id: 'book-analysis-019',
            title: '百年孤独·末尾：羊皮卷的预言与宿命的闭环',
            category: '百年孤独',
            icon: '🌀',
            date: '2026-05-01',
            desc: '当最后一个布恩迪亚读完羊皮卷，马孔多被飓风抹去——马尔克斯用一个"早已写好的结局"证明了孤独是不可逃脱的宿命',
            fileName: '019-百年孤独-末尾-羊皮卷的预言与宿命的闭环.md'
        },
        {
            id: 'book-analysis-020',
            title: 'AI拆书方法论（上）：让AI成为你的文学导师',
            category: 'AI拆书方法论',
            icon: '🤖',
            date: '2026-05-01',
            desc: '拆书不是总结，是品味——用AI逐段拆解经典，把一本厚书变成一个个可以独立品读的写作课',
            fileName: '020-AI拆书方法论上-让AI成为你的文学导师.md'
        },
        {
            id: 'book-analysis-021',
            title: 'AI拆书方法论（下）：5个实战Prompt模板',
            category: 'AI拆书方法论',
            icon: '📋',
            date: '2026-05-01',
            desc: '5个从"选书"到"写拆书笔记"的实战Prompt模板，复制粘贴即可使用——让AI帮你把任何一本经典拆成写作课',
            fileName: '021-AI拆书方法论下-5个实战Prompt模板.md'
        },
        {
            id: 'book-analysis-001',
            title: '呼兰河传·祖父的园子：童年书写与自然意象',
            category: '呼兰河传',
            icon: '🌊',
            date: '2026-04-30',
            desc: '祖父的园子是整部《呼兰河传》中唯一温暖的光——萧红用童稚的笔触写出了一个自由的世界',
            fileName: '001-呼兰河传-祖父的园子-童年书写与自然意象.md'
        },
        {
            id: 'book-analysis-002',
            title: '呼兰河传·大泥坑：环境叙事与群像刻画',
            category: '呼兰河传',
            icon: '👁️',
            date: '2026-04-30',
            desc: '萧红用一个泥坑写活了一座城——大泥坑不是背景板，而是呼兰河城的精神隐喻',
            fileName: '002-呼兰河传-大泥坑-环境叙事与群像刻画.md'
        },
        {
            id: 'book-analysis-003',
            title: '呼兰河传·小团圆媳妇之死：封建礼教吃人实录',
            category: '呼兰河传',
            icon: '⛓️',
            date: '2026-04-30',
            desc: '所有人都是凶手，没有人觉得自己有罪——萧红写出了中国文学中最恐怖的谋杀',
            fileName: '003-呼兰河传-小团圆媳妇之死-封建礼教吃人实录.md'
        },
        {
            id: 'book-analysis-004',
            title: '呼兰河传·看客群像：冷漠的社会心理学',
            category: '呼兰河传',
            icon: '👥',
            date: '2026-04-30',
            desc: '萧红继承了鲁迅的"看客"批判，但她比鲁迅更冷——记录本身比愤怒更让人绝望',
            fileName: '004-呼兰河传-看客群像-冷漠的社会心理学.md'
        },
        {
            id: 'book-analysis-005',
            title: '呼兰河传·冯歪嘴子：底层生命的韧性',
            category: '呼兰河传',
            icon: '🌱',
            date: '2026-04-30',
            desc: '冯歪嘴子是唯一没有被泥坑吞没的人——他只是绕过去，继续走',
            fileName: '005-呼兰河传-冯歪嘴子-底层生命的韧性.md'
        },
        {
            id: 'book-analysis-006',
            title: '呼兰河传·儿童视角与留白艺术',
            category: '呼兰河传',
            icon: '✨',
            date: '2026-04-30',
            desc: '儿童视角能看见成人看不见的东西：荒谬不需要解释，残忍不需要渲染',
            fileName: '006-呼兰河传-儿童视角与留白艺术.md'
        }
    ];
}

function renderBookAnalysisCard(item, index) {
    const fileParam = item.fileName ? `&file=${encodeURIComponent(item.fileName)}` : '';
    const num = String(index + 1).padStart(2, '0');
    return `
        <a href="article.html?id=${item.id}${fileParam}" class="newbie-card accent-book" data-book-id="${item.id}" style="animation-delay: ${index * 0.08}s">
            <div class="newbie-card-accent"></div>
            <span class="newbie-card-num">${num}</span>
            <div class="newbie-card-body">
                <div class="newbie-card-header">
                    <span class="newbie-card-icon">${item.icon}</span>
                    <span class="newbie-card-category">${item.category}</span>
                </div>
                <h3 class="newbie-card-title">${item.title}</h3>
                <p class="newbie-card-desc">${item.desc}</p>
                <div class="newbie-card-footer">
                    <time class="newbie-card-date">${item.date}</time>
                    <span class="newbie-card-arrow">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </span>
                </div>
            </div>
        </a>
    `;
}

async function renderBookAnalysisWithFilter() {
    const container = document.getElementById('case-container');
    if (!container) return;

    const bookData = await getBookAnalysisData();

    const filterHtml = `
        <div class="newbie-filter">
            <span class="newbie-filter-label">筛选</span>
            <button class="newbie-filter-btn active" data-category="all">全部文章</button>
            <button class="newbie-filter-btn" data-category="红楼梦">🌸 红楼梦</button>
            <button class="newbie-filter-btn" data-category="活着">🐂 活着</button>
            <button class="newbie-filter-btn" data-category="百年孤独">🧊 百年孤独</button>
            <button class="newbie-filter-btn" data-category="呼兰河传">🌊 呼兰河传</button>
            <button class="newbie-filter-btn" data-category="AI拆书方法论">🤖 AI拆书方法论</button>
        </div>
    `;

    const cardsHtml = bookData.map((item, i) => renderBookAnalysisCard(item, i)).join('');

    container.innerHTML = filterHtml + `<div class="newbie-grid">${cardsHtml}</div>`;

    const filterBtns = container.querySelectorAll('.newbie-filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.dataset.category;
            const cards = container.querySelectorAll('.newbie-card');
            cards.forEach(card => {
                const cardCategory = card.querySelector('.newbie-card-category').textContent;
                const categoryMap = {
                    '红楼梦': ['红楼梦'],
                    '活着': ['活着'],
                    '百年孤独': ['百年孤独'],
                    '呼兰河传': ['呼兰河传'],
                    'AI拆书方法论': ['AI拆书方法论']
                };
                const allowedCategories = categoryMap[category];
                if (category === 'all' || (allowedCategories && allowedCategories.includes(cardCategory))) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// 初始化渲染
async function renderHomepage() {
    console.log('=== Starting renderHomepage (parallel) ===');

    // 并行加载所有数据源
    const [featuredProjects, littheoryData] = await Promise.all([
        getFeaturedProjects().catch(e => { console.error('Featured projects failed:', e); return []; }),
        getLiteraryTheoryData().catch(e => { console.error('Literary theory failed:', e); return []; })
    ]);

    // 并行渲染所有板块
    await Promise.all([
        // 精选项目
        (async () => {
            const articlesGrid = document.getElementById('articles-container');
            if (articlesGrid && featuredProjects.length) {
                articlesGrid.innerHTML = featuredProjects.map(project => renderProjectCard(project)).join('');
            }
        })(),
        // 文学理论
        (async () => {
            const littheoryGrid = document.getElementById('littheory-container');
            if (littheoryGrid && littheoryData.length) {
                littheoryGrid.innerHTML = littheoryData.map(item => renderLiteraryTheoryCard(item)).join('');
            }
        })(),
        // 知识创作
        renderKnowledgeCreationWithFilter().catch(e => console.error('Knowledge creation failed:', e)),
        // 拆书心得
        renderBookAnalysisWithFilter().catch(e => console.error('Book analysis failed:', e)),
        // 萌新学习
        renderNewbieWithFilter().catch(e => console.error('Newbie learning failed:', e)),
        // 书摘文案
        renderLiteratureWithFilter().catch(e => console.error('Literature failed:', e))
    ]);

    console.log('=== renderHomepage complete ===');
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', renderHomepage);
