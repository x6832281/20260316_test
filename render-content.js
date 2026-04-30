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
    
    return TRENDING_DATA;
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
                '001': { category: '童年书写', icon: '🌿' },
                '002': { category: '环境叙事', icon: '🌊' },
                '003': { category: '封建礼教', icon: '⛓️' },
                '004': { category: '看客心理', icon: '👁️' },
                '005': { category: '底层生命', icon: '🌱' },
                '006': { category: '叙事创新', icon: '✨' }
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
            id: 'book-analysis-001',
            title: '呼兰河传·祖父的园子：童年书写与自然意象',
            category: '童年书写',
            icon: '🌿',
            date: '2026-04-30',
            desc: '祖父的园子是整部《呼兰河传》中唯一温暖的光——萧红用童稚的笔触写出了一个自由的世界，却也因此反衬出园外成人社会的冰冷',
            fileName: '001-呼兰河传-祖父的园子-童年书写与自然意象.md'
        },
        {
            id: 'book-analysis-002',
            title: '呼兰河传·大泥坑：环境叙事与群像刻画',
            category: '环境叙事',
            icon: '🌊',
            date: '2026-04-30',
            desc: '萧红用一个泥坑写活了一座城——大泥坑不是背景板，而是呼兰河城的精神隐喻，每个人对待泥坑的态度就是他们对待命运的态度',
            fileName: '002-呼兰河传-大泥坑-环境叙事与群像刻画.md'
        },
        {
            id: 'book-analysis-003',
            title: '呼兰河传·小团圆媳妇之死：封建礼教吃人实录',
            category: '封建礼教',
            icon: '⛓️',
            date: '2026-04-30',
            desc: '所有人都是凶手，没有人觉得自己有罪——萧红写出了中国文学中最恐怖的谋杀：一场以"善意"为名的集体杀害',
            fileName: '003-呼兰河传-小团圆媳妇之死-封建礼教吃人实录.md'
        },
        {
            id: 'book-analysis-004',
            title: '呼兰河传·看客群像：冷漠的社会心理学',
            category: '看客心理',
            icon: '👁️',
            date: '2026-04-30',
            desc: '萧红继承了鲁迅的"看客"批判，但她比鲁迅更冷——她不做道德评判，只是记录，而记录本身比愤怒更让人绝望',
            fileName: '004-呼兰河传-看客群像-冷漠的社会心理学.md'
        },
        {
            id: 'book-analysis-005',
            title: '呼兰河传·冯歪嘴子：底层生命的韧性',
            category: '底层生命',
            icon: '🌱',
            date: '2026-04-30',
            desc: '冯歪嘴子是整部小说中唯一没有被泥坑吞没的人——他不代表伟大，只代表一种最低限度的生命韧性：活着，就这么简单',
            fileName: '005-呼兰河传-冯歪嘴子-底层生命的韧性.md'
        },
        {
            id: 'book-analysis-006',
            title: '呼兰河传·儿童视角与留白艺术',
            category: '叙事创新',
            icon: '✨',
            date: '2026-04-30',
            desc: '儿童视角能看见成人看不见的东西：荒谬不需要解释，残忍不需要渲染——萧红的留白让读者自己在沉默中完成最深刻的阅读',
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
            <button class="newbie-filter-btn" data-category="祖父的园子">🌿 祖父的园子</button>
            <button class="newbie-filter-btn" data-category="大泥坑">🌊 大泥坑</button>
            <button class="newbie-filter-btn" data-category="小团圆媳妇">⛓️ 小团圆媳妇</button>
            <button class="newbie-filter-btn" data-category="冯歪嘴子">🌱 冯歪嘴子</button>
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
                    '祖父的园子': ['童年书写'],
                    '大泥坑': ['环境叙事'],
                    '看客': ['看客心理'],
                    '小团圆媳妇': ['封建礼教'],
                    '冯歪嘴子': ['底层生命'],
                    '儿童视角': ['叙事创新']
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
    console.log('=== Starting renderHomepage function ===');

    // 获取精选项目数据
    console.log('Getting featured projects...');
    const featuredProjects = await getFeaturedProjects();
    console.log('Featured projects loaded:', featuredProjects.length, 'items');
    
    // 获取文学理论数据
    console.log('Getting literary theory data...');
    const littheoryData = await getLiteraryTheoryData();
    console.log('Literary theory data loaded:', littheoryData.length, 'items');
    
    // 渲染精选项目
    console.log('Rendering featured projects...');
    const articlesGrid = document.getElementById('articles-container');
    if (articlesGrid) {
        const projectsHTML = featuredProjects.map(project => renderProjectCard(project)).join('');
        articlesGrid.innerHTML = projectsHTML;
        console.log('Featured projects rendered successfully');
    } else {
        console.error('articles-container not found');
    }
    
    // 渲染知识创作
    console.log('Rendering knowledge creation...');
    await renderKnowledgeCreationWithFilter();
    console.log('Knowledge creation rendered successfully');
    
    // 渲染文学理论
    console.log('Rendering literary theory...');
    const littheoryGrid = document.getElementById('littheory-container');
    if (littheoryGrid) {
        const littheoryHTML = littheoryData.map(item => renderLiteraryTheoryCard(item)).join('');
        littheoryGrid.innerHTML = littheoryHTML;
        console.log('Literary theory rendered successfully');
    } else {
        console.error('littheory-container not found');
    }
    
    // 渲染AI创意
    const creativeGrid = document.getElementById('creative-container');
    if (creativeGrid) {
        const creativeHTML = CREATIVE_DATA.map(item => renderCreativeCard(item)).join('');
        creativeGrid.innerHTML = creativeHTML;
    }
    
    // 渲染拆书心得
    console.log('Rendering book analysis...');
    await renderBookAnalysisWithFilter();
    
    // 渲染萌新学习
    console.log('Rendering newbie learning...');
    await renderNewbieWithFilter();
    
    // 渲染书摘文案
    await renderLiteratureWithFilter();
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', renderHomepage);
