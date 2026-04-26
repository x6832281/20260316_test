import urllib.request

# Test directory access
try:
    r = urllib.request.urlopen('http://localhost:8080/data/%E6%90%9E%E9%92%B1%E9%A1%B9%E7%9B%AE/')
    html = r.read().decode('utf-8')
    print('Directory accessible:', r.status == 200)
    print('Status code:', r.status)
    
    # Find all MD files
    import re
    links = re.findall(r'href="([^"]+\.md)"', html)
    print('Found', len(links), 'MD files:')
    for link in links[:5]:
        print('  -', link)
    
    # Test first file
    if links:
        first_file = links[0]
        file_url = f'http://localhost:8080/data/%E6%90%9E%E9%92%B1%E9%A1%B9%E7%9B%AE/{first_file}'
        print('\nTesting first file:', file_url)
        r = urllib.request.urlopen(file_url)
        content = r.read().decode('utf-8')
        print('File accessible:', r.status == 200)
        print('First 100 chars:', content[:100])
        
except Exception as e:
    print('Error:', e)
