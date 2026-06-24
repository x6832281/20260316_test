const SEARCH_ENGINES = {
    bilibili: { url: 'https://search.bilibili.com/all', param: 'keyword', home: 'https://www.bilibili.com' },
    github: { url: 'https://github.com/search', param: 'q', home: 'https://github.com' },
    doubao: { url: '', param: '', home: 'https://www.doubao.com/chat/' },
    qianwen: { url: '', param: '', home: 'https://tongyi.aliyun.com/qianwen/' },
    yandex: { url: 'https://yandex.com/search/', param: 'text', home: 'https://yandex.com' },
    baidu: { url: 'https://www.baidu.com/s', param: 'wd', home: 'https://www.baidu.com' }
};

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

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                search('bilibili');
            }
        });
    }
    
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
});
