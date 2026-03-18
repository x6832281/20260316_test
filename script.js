// 初始化 Supabase（替换为你的 Project URL 和 anon key）
const supabaseUrl = 'https://wutixqqiuksglbijggdu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dGl4cXFpdWtzZ2xiaWpnZ2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MzQ5NzAsImV4cCI6MjA4OTQxMDk3MH0.6y_uZrcSqcjOCz-8EaXZHmmnD28OAkcyNNBkX5JySBU';
// 使用全局supabase对象中的createClient函数
const supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);

// 留言板功能
const messageForm = document.getElementById('message-form');
const messageList = document.getElementById('message-list');

if (messageForm && messageList) {
    // 提交留言
    messageForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const message = document.getElementById('message').value;
        
        if (name && message) {
            const newMessage = {
                name: name,
                message: message,
                created_at: new Date().toISOString()
            };
            
            // 保存到 Supabase
            const { error } = await supabaseClient
                .from('messages')
                .insert({ name, message });
            
            if (error) {
                console.error('提交失败:', error);
                console.error('错误详情:', error.message, error.details);
                // 备份到本地存储
                saveMessageToLocalStorage(newMessage);
                loadMessages(); // 重新加载留言
            } else {
                messageForm.reset();
                loadMessages(); // 重新加载留言
            }
        }
    });
    
    // 加载留言
    async function loadMessages() {
        try {
            const { data: messages, error } = await supabaseClient
                    .from('messages')
                    .select('*')
                    .order('created_at', { ascending: false });
            
            if (error) {
                console.error('加载失败:', error);
                console.error('错误详情:', error.message, error.details);
                // 从本地存储加载
                loadMessagesFromLocalStorage();
            } else {
                displayMessages(messages);
                // 同步到本地存储
                saveMessagesToLocalStorage(messages);
            }
        } catch (err) {
            console.error('加载留言时发生错误:', err);
            // 从本地存储加载
            loadMessagesFromLocalStorage();
        }
    }
    
    // 显示留言
    function displayMessages(messages) {
        messageList.innerHTML = '';
        if (messages && messages.length > 0) {
            messages.forEach(msg => {
                const messageItem = document.createElement('div');
                messageItem.className = 'message-item';
                messageItem.innerHTML = `
                    <div class="message-author">${msg.name}</div>
                    <div class="message-content">${msg.message}</div>
                    <div class="message-time">${new Date(msg.created_at).toLocaleString('zh-CN')}</div>
                `;
                messageList.appendChild(messageItem);
            });
        } else {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'message-item';
            emptyMessage.innerHTML = '<div class="message-content">暂无留言</div>';
            messageList.appendChild(emptyMessage);
        }
    }
    
    // 保存留言到本地存储
    function saveMessageToLocalStorage(message) {
        try {
            const messages = JSON.parse(localStorage.getItem('messages') || '[]');
            messages.unshift(message);
            // 只保留最近50条留言
            if (messages.length > 50) {
                messages.splice(50);
            }
            localStorage.setItem('messages', JSON.stringify(messages));
        } catch (err) {
            console.error('保存到本地存储失败:', err);
        }
    }
    
    // 保存多条留言到本地存储
    function saveMessagesToLocalStorage(messages) {
        try {
            localStorage.setItem('messages', JSON.stringify(messages));
        } catch (err) {
            console.error('保存到本地存储失败:', err);
        }
    }
    
    // 从本地存储加载留言
    function loadMessagesFromLocalStorage() {
        try {
            const messages = JSON.parse(localStorage.getItem('messages') || '[]');
            displayMessages(messages);
        } catch (err) {
            console.error('从本地存储加载失败:', err);
            displayMessages([]);
        }
    }
    
    // 初始加载
    loadMessages();
}
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
});
