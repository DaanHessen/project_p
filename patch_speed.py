import re

def speedup(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Fade out instantly
    content = content.replace('transition: opacity 0.2s ease 0s;', 'transition: opacity 0.05s ease 0s;')
    
    # Delay fade in
    content = content.replace('transition: opacity 0.5s ease 0.4s;', 'transition: opacity 0.5s ease 0.6s;')
    
    with open(file_path, 'w') as f:
        f.write(content)

speedup("src/pages/HomePage.css")
speedup("src/globals.css")
