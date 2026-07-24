import os
import re

admin_dir = r"e:\Project\OWN PROJECT\profile\app\admin"
pages_to_patch = [
    "achievements/page.tsx",
    "projects/page.tsx",
    "skills/page.tsx",
    "timeline/page.tsx",
    "messages/page.tsx"
]

for page in pages_to_patch:
    path = os.path.join(admin_dir, page)
    if not os.path.exists(path):
        continue
    
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace setAchievements(data); with if(Array.isArray(data)) setAchievements(data); else setAchievements([]);
    # We will use regex to find setSomething(data); inside fetchSomething
    
    # Match something like setProjects(data); or setAchievements(data);
    # but only in the context of `const data = await res.json();`
    
    def replacer(match):
        setter = match.group(1)
        return f"if (Array.isArray(data)) {{\n        {setter}(data);\n      }} else {{\n        console.error('API Error:', data);\n        {setter}([]);\n      }}"
    
    new_content = re.sub(r'(set[A-Z][a-zA-Z]+)\(data\);', replacer, content)
    
    if new_content != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Patched {page}")
