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
    { rank: '01', title: 'AI Agent 自进化引擎爆火', event: 'EvoMap 发布 evolver，3 天涨星 3600+' },
    { rank: '02', title: 'Claude Code 变游戏工作室', event: '49 个 AI Agent 协作开发游戏，11K stars' },
    { rank: '03', title: '大疆 Pocket 4 上手视频刷屏', event: '影视飓风首发评测，B 站 226 万播放' },
    { rank: '04', title: '中文大模型教程登顶 GitHub', event: '《动手学大模型》31K stars' },
    { rank: '05', title: 'AI 能看屏幕听对话了', event: 'omi 发布新一代 AI 助手，9.5K stars' },
    { rank: '06', title: '开源语音合成工作室火了', event: 'voicebox 19K stars' },
    { rank: '07', title: 'Google 发布 AI 文件检测工具', event: 'magika 15K stars' },
    { rank: '08', title: '世界最小喷气载人飞机挑战成功', event: 'B 站 UP 主魔界造物保持 25 年纪录' },
    { rank: '09', title: 'Chrome DevTools 给 AI 用了', event: '35K stars，coding agent 开发效率提升' },
    { rank: '10', title: '大众电动车 1200 公里深度体验', event: 'ID.ERA 9X 实测' }
];

// 渲染文章卡片
function renderArticleCard(article) {
    return `
        <article class="article-card" data-article-id="${article.id}">
            <div class="card-accent ${article.accentClass}"></div>
            <div class="card-content">
                <span class="card-tag ${article.tagClass}">${article.tag}</span>
                <h3 class="card-title">${article.title}</h3>
                <p class="card-desc">${article.desc}</p>
                <div class="card-footer">
                    <time class="card-date">${article.date}</time>
                    <span class="card-link">阅读更多 →</span>
                </div>
            </div>
        </article>
    `;
}

// 渲染热搜列表
function renderTrendingList(trendingItems) {
    return trendingItems.map((item, index) => {
        let rankClass = '';
        let hotBadge = '';
        
        if (index < 3) {
            rankClass = index === 0 ? 'rank-gold' : index === 1 ? 'rank-silver' : 'rank-bronze';
            hotBadge = '<span class="item-badge hot">热</span>';
        }
        
        return `
            <li class="trending-item ${index < 3 ? 'item-hot' : ''}">
                <span class="item-rank ${rankClass}">${item.rank}</span>
                <span class="item-text" title="${item.event}">${item.title}</span>
                ${hotBadge}
            </li>
        `;
    }).join('');
}

// 初始化渲染
function renderHomepage() {
    // 渲染文章
    const articlesGrid = document.getElementById('articles-container');
    if (articlesGrid) {
        const articlesHTML = ARTICLES_DATA.map(article => renderArticleCard(article)).join('');
        articlesGrid.innerHTML = articlesHTML;
    }
    
    // 渲染热搜榜
    const trendingList = document.getElementById('trending-container');
    if (trendingList) {
        trendingList.innerHTML = renderTrendingList(TRENDING_DATA);
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', renderHomepage);
