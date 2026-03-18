// 初始化 Supabase（替换为你的 Project URL 和 anon key）
const supabaseUrl = 'https://wutixqqiuksglbijggdu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dGl4cXFpdWtzZ2xiaWpnZ2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MzQ5NzAsImV4cCI6MjA4OTQxMDk3MH0.6y_uZrcSqcjOCz-8EaXZHmmnD28OAkcyNNBkX5JySBU';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
            // 保存到 Supabase
            const { error } = await supabase
                .from('messages')
                .insert({ name, message });
            
            if (error) {
                console.error('提交失败:', error);
            } else {
                messageForm.reset();
                loadMessages(); // 重新加载留言
            }
        }
    });
    
    // 加载留言
    async function loadMessages() {
        const { data: messages, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('加载失败:', error);
        } else {
            messageList.innerHTML = '';
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
