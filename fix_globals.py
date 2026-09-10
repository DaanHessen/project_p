import re

with open("src/globals.css", "r") as f:
    css = f.read()

# Fix :root block
root_block = re.search(r':root \{.*?\n\}', css, re.DOTALL).group(0)

# Replace wash-start and wash-end in root
new_root_block = root_block.replace(
    '''  --wash-start: rgba(var(--bg-rgb), 0.5);
  --wash-end: rgba(var(--bg-rgb), 0.72);''',
    '''  --wash-start: rgba(7, 8, 11, 0.5);
  --wash-end: rgba(7, 8, 11, 0.72);
  --scrim-0: rgba(7, 8, 11, 0.7);
  --scrim-35: rgba(7, 8, 11, 0.66);
  --scrim-60: rgba(7, 8, 11, 0.45);
  --vig-100: rgba(7, 8, 11, 0.55);
  
  transition: --bg 0.4s ease, --fg 0.4s ease, --fg-muted 0.4s ease, --fg-faint 0.4s ease, --rule 0.4s ease, --accent 0.4s ease, --scrim-0 0.4s ease, --scrim-35 0.4s ease, --scrim-60 0.4s ease, --vig-100 0.4s ease, --wash-start 0.4s ease, --wash-end 0.4s ease, background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease;'''
)

css = css.replace(root_block, new_root_block)

# Fix Light block
light_block = re.search(r':root\[data-theme=\'light\'\] \{.*?\n\}', css, re.DOTALL).group(0)

new_light_block = light_block.replace(
    '''  --wash-start: rgba(var(--bg-rgb), 0.5);
  --wash-end: rgba(var(--bg-rgb), 0.72);''',
    '''  --wash-start: rgba(245, 245, 247, 0.5);
  --wash-end: rgba(245, 245, 247, 0.72);
  --scrim-0: rgba(245, 245, 247, 0.7);
  --scrim-35: rgba(245, 245, 247, 0.66);
  --scrim-60: rgba(245, 245, 247, 0.45);
  --vig-100: rgba(245, 245, 247, 0.55);'''
)

css = css.replace(light_block, new_light_block)

with open("src/globals.css", "w") as f:
    f.write(css)
