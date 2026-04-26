// Test getMoneyProjects function
async function testGetMoneyProjects() {
    console.log('Testing getMoneyProjects...');
    try {
        const dirPath = 'data/搞钱项目/';
        const encodedDirPath = encodeURI(dirPath);
        console.log('Fetching directory:', encodedDirPath);
        
        const dirResponse = await fetch(encodedDirPath);
        console.log('Directory response status:', dirResponse.status);
        
        if (dirResponse.ok) {
            const html = await dirResponse.text();
            console.log('Directory HTML length:', html.length);
            console.log('First 500 chars of directory:', html.substring(0, 500));
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            const links = doc.querySelectorAll('a[href$=".md"]');
            console.log('Found', links.length, 'MD files');
            
            links.forEach(link => {
                const href = link.getAttribute('href');
                if (href) {
                    console.log('Found link:', href);
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

testGetMoneyProjects();
