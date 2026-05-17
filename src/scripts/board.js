// @ts-nocheck
// ============================================================
// Community board — Supabase CRUD, localStorage fallback
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const supabaseUrl = 'https://wutixqqiuksglbijggdu.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dGl4cXFpdWtzZ2xiaWpnZ2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MzQ5NzAsImV4cCI6MjA4OTQxMDk3MH0.6y_uZrcSqcjOCz-8EaXZHmmnD28OAkcyNNBkX5JySBU';
    const supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);

    const messageForm = document.getElementById('message-form');
    const messageList = document.getElementById('message-list');
    const messageCount = document.getElementById('message-count');

    if (messageForm) {
        messageForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const type = document.getElementById('type').value;
            const message = document.getElementById('message').value.trim();

            if (!name || !message) return;

            const submitBtn = messageForm.querySelector('.board-form-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading-dots">...</span>提交中';
            submitBtn.disabled = true;

            try {
                const { error } = await supabaseClient
                    .from('message')
                    .insert({ name, message, type });

                if (error) throw error;

                messageForm.reset();
                loadMessages();
            } catch (err) {
                console.error('提交失败:', err);
                saveToLocal({ name, message, type, created_at: new Date().toISOString() });
                loadMessages();
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    async function loadMessages() {
        try {
            const { data: messages, error } = await supabaseClient
                .from('message')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;
            displayMessages(messages);
            saveToLocalStorage(messages);
        } catch (err) {
            console.error('加载失败:', err);
            loadFromLocalStorage();
        }
    }

    function displayMessages(messages) {
        if (!messageList) return;
        messageList.innerHTML = '';

        if (messageCount) {
            messageCount.textContent = messages ? `${messages.length} 条留言` : '';
        }

        if (!messages || messages.length === 0) {
            messageList.innerHTML = `
                <div class="board-empty">
                    <div class="board-empty-icon">💭</div>
                    <p class="board-empty-text">暂无交流内容，来发表第一条吧！</p>
                </div>
            `;
            return;
        }

        messages.forEach((msg, index) => {
            const item = document.createElement('div');
            item.className = 'board-item';
            item.style.animationDelay = `${index * 0.05}s`;

            const initial = msg.name.charAt(0).toUpperCase();
            const type = msg.type || 'question';
            const typeLabels = {
                question: '问题咨询',
                work: '作品分享',
                experience: '经验交流',
                feedback: '建议反馈'
            };
            const typeLabel = typeLabels[type] || '问题咨询';

            item.innerHTML = `
                <div class="board-item-header">
                    <div class="board-item-author">
                        <div class="board-item-avatar">${initial}</div>
                        <span class="board-item-name">${escapeHtml(msg.name)}</span>
                        <span class="board-item-type board-item-type-${type}">${typeLabel}</span>
                    </div>
                    <span class="board-item-time">${formatTime(msg.created_at)}</span>
                </div>
                <p class="board-item-content">${escapeHtml(msg.message)}</p>
            `;
            messageList.appendChild(item);
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatTime(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diff = now - date;

        if (diff < 60000) return '刚刚';
        if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
        if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
        if (diff < 604800000) return Math.floor(diff / 86400000) + '天前';

        return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    }

    function saveToLocal(msg) {
        try {
            const messages = JSON.parse(localStorage.getItem('board_messages') || '[]');
            messages.unshift(msg);
            if (messages.length > 50) messages.splice(50);
            localStorage.setItem('board_messages', JSON.stringify(messages));
        } catch (e) {}
    }

    function saveToLocalStorage(messages) {
        try {
            localStorage.setItem('board_messages', JSON.stringify(messages));
        } catch (e) {}
    }

    function loadFromLocalStorage() {
        try {
            const messages = JSON.parse(localStorage.getItem('board_messages') || '[]');
            displayMessages(messages);
        } catch (e) {
            displayMessages([]);
        }
    }

    loadMessages();

    setInterval(loadMessages, 5000);

    const subscription = supabaseClient
        .channel('board-channel')
        .on('postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'message' },
            (payload) => {
                loadMessages();
            }
        )
        .subscribe();
});
