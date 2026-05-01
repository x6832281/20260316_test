// SEO优化模块 - 动态注入Meta标签、结构化数据等
const SeoManager = {
    baseUrl: 'https://corely.top',
    
    // 更新页面标题
    setTitle(title) {
        document.title = `${title} - AI写作教程与拆书心得 | AI 萌新小窝`;
    },
    
    // 更新Meta描述
    setDescription(description) {
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'description';
            document.head.appendChild(meta);
        }
        meta.content = description;
    },
    
    // 更新关键词
    setKeywords(keywords) {
        let meta = document.querySelector('meta[name="keywords"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'keywords';
            document.head.appendChild(meta);
        }
        meta.content = keywords;
    },
    
    // 更新Canonical URL
    setCanonicalUrl(path) {
        const url = `${this.baseUrl}${path}`;
        let link = document.querySelector('link[rel="canonical"]');
        if (!link) {
            link = document.createElement('link');
            link.rel = 'canonical';
            document.head.appendChild(link);
        }
        link.href = url;
    },
    
    // 更新Open Graph标签
    setOgTags(title, description, path, imageUrl) {
        const url = `${this.baseUrl}${path}`;
        const ogTags = {
            'og:type': 'article',
            'og:title': title,
            'og:description': description,
            'og:url': url,
            'og:site_name': 'AI 萌新小窝',
            'og:locale': 'zh_CN'
        };
        
        if (imageUrl) {
            ogTags['og:image'] = imageUrl;
        }
        
        Object.entries(ogTags).forEach(([property, content]) => {
            let meta = document.querySelector(`meta[property="${property}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute('property', property);
                document.head.appendChild(meta);
            }
            meta.content = content;
        });
    },
    
    // 更新Twitter Card标签
    setTwitterTags(title, description) {
        const twitterTags = {
            'twitter:card': 'summary_large_image',
            'twitter:title': title,
            'twitter:description': description
        };
        
        Object.entries(twitterTags).forEach(([name, content]) => {
            let meta = document.querySelector(`meta[name="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = name;
                document.head.appendChild(meta);
            }
            meta.content = content;
        });
    },
    
    // 添加Article结构化数据
    addArticleStructuredData(article) {
        const existingScript = document.querySelector('#article-structured-data');
        if (existingScript) existingScript.remove();
        
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": article.description || article.title,
            "image": article.imageUrl || `${this.baseUrl}/logo.svg`,
            "author": {
                "@type": "Organization",
                "name": "AI 萌新小窝"
            },
            "publisher": {
                "@type": "Organization",
                "name": "AI 萌新小窝",
                "logo": {
                    "@type": "ImageObject",
                    "url": `${this.baseUrl}/logo.svg`
                }
            },
            "datePublished": article.publishDate || new Date().toISOString(),
            "dateModified": article.publishDate || new Date().toISOString(),
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `${this.baseUrl}/article.html?id=${article.id}`
            },
            "keywords": article.tags ? article.tags.join(', ') : 'AI写作'
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'article-structured-data';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    },
    
    // 添加面包屑结构化数据
    addBreadcrumbStructuredData(items) {
        const existingScript = document.querySelector('#breadcrumb-structured-data');
        if (existingScript) existingScript.remove();
        
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": items.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "item": `${this.baseUrl}${item.url}`
            }))
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'breadcrumb-structured-data';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    },
    
    // 添加FAQ结构化数据
    addFaqStructuredData(questions) {
        const existingScript = document.querySelector('#faq-structured-data');
        if (existingScript) existingScript.remove();
        
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": questions.map(q => ({
                "@type": "Question",
                "name": q.name,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": q.text
                }
            }))
        };
        
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = 'faq-structured-data';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    },
    
    // 为单篇文章注入所有SEO元素
    injectArticleSeo(article) {
        const path = `/article.html?id=${article.id}`;
        
        this.setTitle(article.title);
        this.setDescription(article.description || article.title.substring(0, 150));
        
        const allKeywords = [
            article.title,
            'AI写作',
            'AI写作教程',
            'AI拆书',
            'AI小说创作',
            'AI萌新小窝'
        ];
        if (article.tags) allKeywords.push(...article.tags);
        this.setKeywords(allKeywords.join(','));
        
        this.setCanonicalUrl(path);
        this.setOgTags(article.title, article.description || article.title.substring(0, 150), path, article.imageUrl);
        this.setTwitterTags(article.title, article.description || article.title.substring(0, 150));
        this.addArticleStructuredData({
            ...article,
            id: article.id,
            description: article.description || article.title.substring(0, 150),
            publishDate: article.publishDate
        });
        this.addBreadcrumbStructuredData([
            { name: '首页', url: '/' },
            { name: '热门文章', url: '/index.html#articles' },
            { name: article.title, url: path }
        ]);
    },
    
    // 添加阅读时间估算
    addReadingTime(contentElement) {
        if (!contentElement) return;
        const text = contentElement.textContent || '';
        const wordCount = text.length;
        const readingTime = Math.ceil(wordCount / 500);
        
        const readingTimeElement = document.createElement('div');
        readingTimeElement.className = 'reading-time';
        readingTimeElement.innerHTML = `
            <span class="reading-time-icon">📖</span>
            <span>约${readingTime}分钟阅读 · ${wordCount}字</span>
        `;
        
        const articleMeta = document.querySelector('.article-meta-top');
        if (articleMeta) {
            articleMeta.appendChild(readingTimeElement);
        }
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SeoManager;
}
