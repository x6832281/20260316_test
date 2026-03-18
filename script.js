// 搜索引擎配置
const SEARCH_ENGINES = {
    google: { url: 'https://www.google.com/search', param: 'q' },
    bing: { url: 'https://www.bing.com/search', param: 'q' },
    yandex: { url: 'https://yandex.com/search/', param: 'text' },
    yahoo: { url: 'https://search.yahoo.com/search', param: 'p' },
    baidu: { url: 'https://www.baidu.com/s', param: 'wd' },
    doubao: { url: 'https://www.doubao.com/search', param: 'q' }
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
    
    // 回车键搜索（默认使用Google）
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            search('google');
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
    
    // 留言板功能
    const messageForm = document.getElementById('message-form');
    const messageList = document.getElementById('message-list');
    
    if (messageForm && messageList) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const message = document.getElementById('message').value;
            
            if (name && message) {
                const now = new Date();
                const time = now.toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                const messageItem = document.createElement('div');
                messageItem.className = 'message-item';
                messageItem.innerHTML = `
                    <div class="message-author">${name}</div>
                    <div class="message-content">${message}</div>
                    <div class="message-time">${time}</div>
                `;
                
                messageList.prepend(messageItem);
                messageForm.reset();
                
                // 保存留言到本地存储
                const messages = JSON.parse(localStorage.getItem('messages') || '[]');
                messages.unshift({ name, message, time });
                localStorage.setItem('messages', JSON.stringify(messages));
            }
        });
        
        // 加载本地存储的留言
        function loadMessages() {
            const messages = JSON.parse(localStorage.getItem('messages') || '[]');
            messages.forEach(msg => {
                const messageItem = document.createElement('div');
                messageItem.className = 'message-item';
                messageItem.innerHTML = `
                    <div class="message-author">${msg.name}</div>
                    <div class="message-content">${msg.message}</div>
                    <div class="message-time">${msg.time}</div>
                `;
                messageList.appendChild(messageItem);
            });
        }
        
        loadMessages();
    }
});
