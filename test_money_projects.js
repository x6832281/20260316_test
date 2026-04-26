// Test getMoneyProjects function
async function testGetMoneyProjects() {
    console.log('Testing getMoneyProjects...');
    try {
        const projects = await getMoneyProjects();
        console.log('Projects found:', projects.length);
        console.log('First project:', projects[0]);
        return projects;
    } catch (error) {
        console.error('Error in getMoneyProjects:', error);
        return [];
    }
}

// Test directory access
async function testDirectoryAccess() {
    console.log('Testing directory access...');
    try {
        const response = await fetch('data/搞钱项目/');
        const html = await response.text();
        console.log('Directory access status:', response.status);
        console.log('MD files in directory:', (html.match(/\.md/g) || []).length);
    } catch (error) {
        console.error('Error accessing directory:', error);
    }
}

// Run tests
testDirectoryAccess();
testGetMoneyProjects().then(projects => {
    console.log('Test completed. Projects:', projects.length);
});
