// 搜索引擎配置
const SEARCH_ENGINES = {
    google: { url: 'https://www.google.com/search', param: 'q' },
    bing: { url: 'https://www.bing.com/search', param: 'q' },
    yandex: { url: 'https://yandex.com/search/', param: 'text' },
    yahoo: { url: 'https://search.yahoo.com/search', param: 'p' },
    baidu: { url: 'https://www.baidu.com/s', param: 'wd' },
    doubao: { url: 'https://www.doubao.com/chat/', param: 'q' }
};

// 搜索功能
function search(engine) {
    const input = document.getElementById('search-input');
    if (!input) return;
    
    const query = input.value.trim();
    if (!query) return;
    
    const config = SEARCH_ENGINES[engine];
    if (!config) return;
    
    const url = `${config.url}?${config.param}=${encodeURIComponent(query)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
}

// 键盘事件处理
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    // 回车键搜索（默认使用百度）
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            search('baidu');
        }
    });
    
    // 搜索按钮事件委托
    const searchButtons = document.querySelector('.search-buttons');
    if (searchButtons) {
        searchButtons.addEventListener('click', (e) => {
            const button = e.target.closest('.search-btn');
            if (!button) return;
            
            const engine = button.dataset.engine;
            if (engine) {
                search(engine);
            }
        });
    }
});
