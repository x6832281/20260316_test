import urllib.request
import re

r = urllib.request.urlopen('http://localhost:8080/')
html = r.read().decode('utf-8')
print('Money cards found:', 'money-card' in html)
links = re.findall(r'href="([^"]+article\.html\?id=money[^"]+)"', html)
print('Money card links:', links[:3])
print('First 3 money card links:')
for link in links[:3]:
    print(f'  {link}')
