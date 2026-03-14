function search(engine) {
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        const searchEngines = {
            google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
            bing: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
            yandex: `https://yandex.com/search/?text=${encodeURIComponent(query)}`,
            yahoo: `https://search.yahoo.com/search?p=${encodeURIComponent(query)}`,
            baidu: `https://www.baidu.com/s?wd=${encodeURIComponent(query)}`
        };
        
        const url = searchEngines[engine];
        if (url) {
            window.open(url, '_blank');
        }
    }
}