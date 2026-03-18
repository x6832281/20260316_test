// 初始化 Supabase（替换为你的 Project URL 和 anon key）
const supabaseUrl = 'https://wutixqqiuksglbijggdu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dGl4cXFpdWtzZ2xiaWpnZ2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MzQ5NzAsImV4cCI6MjA4OTQxMDk3MH0.6y_uZrcSqcjOCz-8EaXZHmmnD28OAkcyNNBkX5JySBU';
// 使用全局supabase对象中的createClient函数
const supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);

// 留言板功能
const messageForm = document.getElementById('message-form');
const messageList = document.getElementById('message-list');
const messageDisplaySidebar = document.querySelector('.message-display-sidebar');

// 默认折叠状态
let isMessageDisplayExpanded = false;

if (messageForm && messageList && messageDisplaySidebar) {
    // 设置默认折叠状态
    messageDisplaySidebar.classList.add('collapsed');
    
    // 点击标题切换展开/折叠
    const sidebarTitle = messageDisplaySidebar.querySelector('.sidebar-title');
    if (sidebarTitle) {
        sidebarTitle.style.cursor = 'pointer';
        sidebarTitle.addEventListener('click', () => {
            toggleMessageDisplay();
        });
    }
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
                .from('message')
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
                    .from('message')
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
    
    // 切换留言展示区域展开/折叠
    function toggleMessageDisplay(forceExpand = false) {
        if (forceExpand || !isMessageDisplayExpanded) {
            messageDisplaySidebar.classList.remove('collapsed');
            messageDisplaySidebar.classList.add('expanded');
            isMessageDisplayExpanded = true;
        } else {
            messageDisplaySidebar.classList.remove('expanded');
            messageDisplaySidebar.classList.add('collapsed');
            isMessageDisplayExpanded = false;
        }
    }
    
    // 显示留言（只显示最近10条）
    function displayMessages(messages) {
        messageList.innerHTML = '';
        if (messages && messages.length > 0) {
            // 只显示最近10条留言
            const recentMessages = messages.slice(0, 10);
            recentMessages.forEach(msg => {
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
    
    // 实时订阅 - 监听新留言
    const subscription = supabaseClient
        .channel('message-channel')
        .on('postgres_changes', 
            { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'message' 
            }, 
            (payload) => {
                console.log('收到新留言:', payload.new);
                // 立即加载最新留言
                loadMessages();
                // 自动展开留言展示区域
                toggleMessageDisplay(true);
            }
        )
        .subscribe();
    
    // 页面关闭时取消订阅
    window.addEventListener('beforeunload', () => {
        subscription.unsubscribe();
    });
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
