import re

with open("index.html", "r") as f:
    html = f.read()

# Add font preloading
old_fonts = r'''    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    
    <link
      href="https://fonts.googleapis.com/css2\?family=JetBrains\+Mono:wght@400;500;600&display=swap"
      rel="stylesheet"
    />'''

new_fonts = r'''    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    
    <link 
      rel="preload" 
      as="style" 
      href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" 
    />
    <link
      href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
      rel="stylesheet"
    />'''

html = re.sub(old_fonts, new_fonts, html)

with open("index.html", "w") as f:
    f.write(html)
