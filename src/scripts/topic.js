// @ts-nocheck
// ============================================================
// Generic topic page renderer — used by all topic listing pages
// dirName: manifest dir field (e.g. '去AI味', '萌新学习')
// containerId: DOM container id
// options: { cardRenderer, maxCards, filterCategories }
// ============================================================
async function renderTopicPage(dirName, containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { cardRenderer = 'newbie', maxCards = 0, filterCategories = [] } = options;

    const data = await fetchContentFromManifest(dirName);
    if (!data) {
        container.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px;">内容加载失败，请刷新页面重试</p>';
        return;
    }

    // Sort by date descending
    data.sort((a, b) => {
        const da = new Date(a.date); const db = new Date(b.date);
        return (db - da) || a.fileName.localeCompare(b.fileName);
    });

    const displayData = maxCards > 0 ? data.slice(0, maxCards) : data;

    // Render filter bar if categories provided
    let filterHtml = '';
    if (filterCategories.length > 0) {
        const buttons = [['all', '全部']].concat(filterCategories.map(c => [c, c]));
        filterHtml = `
            <div class="newbie-filter">
                <span class="newbie-filter-label">筛选</span>
                ${buttons.map(([val, label]) =>
                    `<button class="newbie-filter-btn${val === 'all' ? ' active' : ''}" data-category="${val}">${label}</button>`
                ).join('')}
            </div>`;
    }

    // Render cards
    const cardsHtml = displayData.map((item, i) => {
        if (cardRenderer === 'knowledge') {
            return renderKnowledgeCreationCard(item, i);
        }
        return renderNewbieCard(item, i);
    }).join('');

    container.innerHTML = filterHtml + `<div class="newbie-grid">${cardsHtml}</div>`;

    // Wire filter buttons if present
    if (filterCategories.length > 0) {
        const filterBtns = container.querySelectorAll('.newbie-filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const cat = btn.dataset.category;
                const cards = container.querySelectorAll('.newbie-card');
                cards.forEach(card => {
                    const cardCat = card.querySelector('.newbie-card-category').textContent;
                    if (cat === 'all' || cardCat.includes(cat)) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
}
