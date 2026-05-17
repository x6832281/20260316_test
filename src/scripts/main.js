// @ts-nocheck
// ============================================================
// Shared utilities — manifest fetching, content discovery
// ============================================================
const MANIFEST_CACHE = {};

async function fetchManifest() {
    if (MANIFEST_CACHE.data) return MANIFEST_CACHE.data;
    try {
        const resp = await fetch('data/manifest.json');
        if (!resp.ok) throw new Error('Manifest fetch failed');
        MANIFEST_CACHE.data = await resp.json();
        return MANIFEST_CACHE.data;
    } catch (e) {
        console.warn('Manifest unavailable, using fallback:', e);
        return null;
    }
}

// ID prefix mapping: directory name -> content ID prefix
const DIR_ID_PREFIX = {
    '萌新学习': 'newbie',
    '去AI味': 'deai',
    '拆书心得': 'book-analysis',
    '文学理论': 'littheory',
    '书摘文案': 'book-excerpt',
    '知识创作': 'knowledge',
    '精选项目': 'project'
};

// Icon & category mapping for 萌新学习 (by file prefix)
const NEWBIE_ICONS = {
    '001': '🎓', '002': '🎓', '003': '🎓', '004': '🎓',
    '005': '📖', '006': '💰', '007': '📚', '008': '✍️',
    '009': '🎯', '010': '🛠️', '011': '🎨', '012': '📝', '013': '🔧'
};

const NEWBIE_CATEGORIES = {
    '001': '博主教程', '002': '博主教程', '003': '博主教程', '004': '博主教程',
    '005': '网文写作', '006': '写作变现', '007': '拆书入门', '008': '实战教程',
    '009': '去AI味', '010': '去AI味', '011': '去AI味', '012': '去AI味', '013': '去AI味'
};

async function fetchContentFromManifest(dirName) {
    const manifest = await fetchManifest();
    if (!manifest) return null;

    const items = [];
    for (const [path, meta] of Object.entries(manifest)) {
        if (meta.dir !== dirName) continue;

        const fileName = path.split('/').pop();
        const prefixMatch = fileName.match(/^(\d{3})/);
        const prefix = prefixMatch ? prefixMatch[1] : '001';

        // Generate content ID
        let id;
        if (dirName === '知识创作') {
            id = 'knowledge-' + fileName.replace('.md', '');
        } else if (dirName === '精选项目') {
            const slug = fileName.replace('.md', '').replace(/^\d{3}-/, '');
            id = 'project-' + prefix + '-' + slug;
        } else {
            const idPrefix = DIR_ID_PREFIX[dirName] || dirName;
            id = idPrefix + '-' + prefix;
        }

        items.push({
            id: id,
            title: meta.title,
            name: meta.title,
            category: meta.category || NEWBIE_CATEGORIES[prefix] || dirName,
            icon: NEWBIE_ICONS[prefix] || '📘',
            date: meta.date,
            desc: meta.summary,
            summary: meta.summary,
            file: path,
            fileName: fileName,
            stars: meta.stars || 0,
            github_url: meta.github_url || ''
        });
    }

    items.sort((a, b) => a.fileName.localeCompare(b.fileName));
    return items.length > 0 ? items : null;
}

// Format star count with 'k' suffix
function formatStars(stars) {
    if (stars >= 1000) {
        return (stars / 1000).toFixed(1) + 'k';
    }
    return stars;
}

// Shared card renderers used by both homepage and topic pages
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

// ============================================================
// PWA Service Worker Registration
// ============================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js?v=20260517')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

// ============================================================
// Search Engine Configuration
// ============================================================
const SEARCH_ENGINES = {
    bilibili: { url: 'https://search.bilibili.com/all', param: 'keyword', home: 'https://www.bilibili.com' },
    github: { url: 'https://github.com/search', param: 'q', home: 'https://github.com' },
    doubao: { url: '', param: '', home: 'https://www.doubao.com/chat/' },
    qianwen: { url: '', param: '', home: 'https://tongyi.aliyun.com/qianwen/' },
    yandex: { url: 'https://yandex.com/search/', param: 'text', home: 'https://yandex.com' },
    baidu: { url: 'https://www.baidu.com/s', param: 'wd', home: 'https://www.baidu.com' }
};

// 搜索功能
function search(engine) {
    const input = document.getElementById('search-input');
    const query = input ? input.value.trim() : '';
    const config = SEARCH_ENGINES[engine];
    if (!config) return;

    let url;
    if (query && config.url && config.param) {
        url = `${config.url}?${config.param}=${encodeURIComponent(query)}`;
    } else {
        url = config.home;
    }

    const newWindow = window.open(url, '_blank');
    if (newWindow) {
        newWindow.opener = null;
    }
}

// ============================================
// 返回顶部按钮
// ============================================
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', '返回顶部');
    document.body.appendChild(backToTopBtn);

    let isVisible = false;

    const toggleBackToTop = () => {
        const shouldShow = window.scrollY > 400;
        if (shouldShow !== isVisible) {
            backToTopBtn.classList.toggle('visible', shouldShow);
            isVisible = shouldShow;
        }
    };

    window.addEventListener('scroll', toggleBackToTop, { passive: true });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ============================================
// 卡片鼠标追踪光效
// ============================================
function initCardMouseTracking() {
    const cards = document.querySelectorAll('.littheory-card, .literature-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', x + '%');
            card.style.setProperty('--mouse-y', y + '%');
        });
    });
}

// ============================================
// 图片懒加载
// ============================================
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '100px' });

        images.forEach(img => imageObserver.observe(img));
    } else {
        images.forEach(img => img.classList.add('loaded'));
    }
}

// ============================================
// 移动端菜单
// ============================================
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (!menuBtn || !navMenu) return;

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = menuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = isActive ? 'hidden' : '';
    });

    navMenu.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            menuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ============================================
// 弹幕功能
// ============================================

// 初始化弹幕开关
function initDanmakuToggle() {
    const toggleBtn = document.getElementById('danmaku-toggle');
    const container = document.getElementById('danmaku-container');

    if (!toggleBtn || !container) return;

    // 检查本地存储中的弹幕状态
    const isDanmakuEnabled = localStorage.getItem('danmaku_enabled') !== 'false';

    // 设置初始状态
    if (isDanmakuEnabled) {
        container.classList.remove('hidden');
        toggleBtn.classList.remove('active');
    } else {
        container.classList.add('hidden');
        toggleBtn.classList.add('active');
    }

    // 添加点击事件
    toggleBtn.addEventListener('click', () => {
        const isHidden = container.classList.contains('hidden');

        if (isHidden) {
            // 开启弹幕
            container.classList.remove('hidden');
            toggleBtn.classList.remove('active');
            localStorage.setItem('danmaku_enabled', 'true');
        } else {
            // 关闭弹幕
            container.classList.add('hidden');
            toggleBtn.classList.add('active');
            localStorage.setItem('danmaku_enabled', 'false');
        }
    });
}

// 弹幕循环定时器
let danmakuInterval = null;
let danmakuRefreshInterval = null;

// 初始化弹幕功能
function initDanmaku() {
    const container = document.getElementById('danmaku-container');
    if (!container) return;

    startDanmakuLoop(container);

    // 每30秒刷新留言数据（只设置一次）
    if (danmakuRefreshInterval) clearInterval(danmakuRefreshInterval);
    danmakuRefreshInterval = setInterval(() => {
        startDanmakuLoop(container);
    }, 30000);
}

// 开始弹幕循环
function startDanmakuLoop(container) {
    // 清除之前的定时器
    if (danmakuInterval) {
        clearInterval(danmakuInterval);
    }

    // 检查弹幕是否开启
    const isDanmakuEnabled = localStorage.getItem('danmaku_enabled') !== 'false';
    if (!isDanmakuEnabled) return;

    // 从localStorage获取最近20条留言
    const messages = getRecentMessages(20);

    if (messages.length === 0) {
        // 如果没有留言，添加默认弹幕
        const defaultMessages = [
            { message: '欢迎来到AI文学创作平台！' },
            { message: '用AI辅助创作，让灵感无限' },
            { message: '分享你的创作经验，与大家交流' },
            { message: 'AI执笔，生活成诗' },
            { message: '探索AI文学创作的无限可能' }
        ];
        messages.push(...defaultMessages);
    }

    // 循环显示弹幕
    let index = 0;
    danmakuInterval = setInterval(() => {
        // 再次检查弹幕是否开启
        const isEnabled = localStorage.getItem('danmaku_enabled') !== 'false';
        if (!isEnabled) {
            clearInterval(danmakuInterval);
            return;
        }

        if (index >= messages.length) {
            index = 0; // 重新开始循环
        }
        createDanmaku(messages[index], container);
        index++;
    }, 2000); // 每2秒显示一条弹幕
}

// 从localStorage获取最近的留言
function getRecentMessages(limit) {
    try {
        const messages = JSON.parse(localStorage.getItem('board_messages') || '[]');
        return messages.slice(0, limit).reverse();
    } catch (e) {
        console.error('获取留言失败:', e);
        return [];
    }
}

// 创建弹幕元素
function createDanmaku(message, container) {
    if (!message || !message.message) return;

    const danmaku = document.createElement('div');
    danmaku.className = 'danmaku-item';
    danmaku.textContent = message.message;

    // 随机位置（垂直方向）
    const top = Math.random() * (container.offsetHeight - 30);
    danmaku.style.top = `${top}px`;

    // 随机动画时长（8-15秒）
    const duration = 8 + Math.random() * 7;
    danmaku.style.animationDuration = `${duration}s`;

    // 随机颜色（使用主题色）
    const colors = ['var(--accent-primary)', 'var(--accent-warm)', 'var(--accent-cool)', 'var(--text-primary)'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    danmaku.style.color = randomColor;

    container.appendChild(danmaku);

    // 动画结束后移除元素
    danmaku.addEventListener('animationend', () => {
        danmaku.remove();
    });
}

// ============================================
// DOMContentLoaded — init all features
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');

    // 回车键搜索（默认使用哔哩哔哩，有内容则搜索，无内容则打开首页）
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                search('bilibili');
            }
        });
    }

    // 搜索按钮事件委托
    const searchEngines = document.querySelector('.search-engines');
    if (searchEngines) {
        searchEngines.addEventListener('click', (e) => {
            const button = e.target.closest('.engine-btn');
            if (!button) return;

            const engine = button.dataset.engine;
            if (engine) {
                search(engine);
            }
        });
    }

    // 内容标签页锚点导航
    const tabButtons = document.querySelectorAll('.content-tabs-anchor .tab-btn');

    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // 滚动时高亮当前Section对应的Tab
    const sections = document.querySelectorAll('.tab-content[id^="section-"]');
    if (sections.length > 0 && tabButtons.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    tabButtons.forEach(btn => {
                        btn.classList.toggle('active', btn.getAttribute('href') === '#' + sectionId);
                    });
                }
            });
        }, { rootMargin: '-100px 0px -60% 0px' });

        sections.forEach(section => observer.observe(section));
    }

    // 初始化弹幕功能
    initDanmaku();
    initDanmakuToggle();

    // 返回顶部按钮
    initBackToTop();

    // 卡片鼠标追踪光效
    initCardMouseTracking();

    // 图片懒加载
    initLazyLoading();

    // 移动端菜单
    initMobileMenu();
});
