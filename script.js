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
    google: { url: 'https://www.google.com/search', param: 'q', home: 'https://www.google.com' },
    bing: { url: 'https://www.bing.com/search', param: 'q', home: 'https://www.bing.com' },
    yandex: { url: 'https://yandex.com/search/', param: 'text', home: 'https://yandex.com' },
    yahoo: { url: 'https://search.yahoo.com/search', param: 'p', home: 'https://www.yahoo.com' },
    baidu: { url: 'https://www.baidu.com/s', param: 'wd', home: 'https://www.baidu.com' },
    doubao: { url: 'https://www.doubao.com/chat/', param: 'q', home: 'https://www.doubao.com' },
    qianwen: { url: 'https://tongyi.aliyun.com/qianwen/', param: 'q', home: 'https://tongyi.aliyun.com' }
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
    
    // 回车键搜索（默认使用百度，有内容则搜索，无内容则打开首页）
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                search('baidu');
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
});
