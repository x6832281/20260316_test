// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js?v=20260418')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

// 搜索引擎配置
const SEARCH_ENGINES = {
    bilibili: { url: 'https://search.bilibili.com/all', param: 'keyword', home: 'https://www.bilibili.com' },
    github: { url: 'https://github.com/search', param: 'q', home: 'https://github.com' },
    doubao: { url: 'https://www.doubao.com/chat/', param: 'q', home: 'https://www.doubao.com' },
    qianwen: { url: 'https://tongyi.aliyun.com/qianwen/', param: 'q', home: 'https://tongyi.aliyun.com' },
    yandex: { url: 'https://yandex.com/search/', param: 'text', home: 'https://yandex.com' },
    baidu: { url: 'https://www.baidu.com/s', param: 'wd', home: 'https://www.baidu.com' }
};

// 搜索功能
function search(engine) {
    const input = document.getElementById('search-input');
    const query = input ? input.value.trim() : '';
    const config = SEARCH_ENGINES[engine];
    if (!config) return;
    
    if (query) {
        // 有搜索内容时：进行搜索
        const url = `${config.url}?${config.param}=${encodeURIComponent(query)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    } else {
        // 没有搜索内容时：打开搜索引擎首页
        window.open(config.home, '_blank', 'noopener,noreferrer');
    }
}

// 键盘事件处理
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
    
    // 移动端菜单切换
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // 点击导航链接后关闭菜单
        navMenu.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    
    // 内容标签页切换
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            
            // 移除所有 active 类
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 添加 active 类到当前标签
            button.classList.add('active');
            const targetContent = document.getElementById(`${tabId}-tab`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
    
    // 初始化弹幕功能
    initDanmaku();
    
    // 初始化弹幕开关
    initDanmakuToggle();
});

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

// 初始化弹幕功能
function initDanmaku() {
    const container = document.getElementById('danmaku-container');
    if (!container) return;
    
    // 开始循环弹幕
    startDanmakuLoop(container);
    
    // 每30秒刷新一次留言数据
    setInterval(() => {
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
