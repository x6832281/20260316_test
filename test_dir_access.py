import urllib.request

# Test directory access
try:
    r = urllib.request.urlopen('http://localhost:8080/data/%E6%90%9E%E9%92%B1%E9%A1%B9%E7%9B%AE/')
    html = r.read().decode('utf-8')
    print('Directory accessible:', 'Directory listing' in html)
    print('Status code:', r.status)
    
    # Count .md files
    md_count = html.count('.md')
    print('MD files found:', md_count)
    
    # Extract first few MD files
    lines = html.split('\n')
    md_files = []
    for line in lines:
        if '.md' in line and 'href' in line:
            md_files.append(line.strip())
    print('First 3 MD files:')
    for f in md_files[:3]:
        print(f)
        
except Exception as e:
    print('Error:', e)

# Test render-content.js access
try:
    r = urllib.request.urlopen('http://localhost:8080/render-content.js')
    content = r.read().decode('utf-8')
    print('\nrender-content.js accessible:', r.status == 200)
    print('Contains renderMoneyCard:', 'renderMoneyCard' in content)
except Exception as e:
    print('Error accessing render-content.js:', e)
