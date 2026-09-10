import re

with open("src/globals.css", "r") as f:
    css = f.read()

old_block = r'''html\[data-theme\]\[data-matrix="true"\] \{'''
new_block = r''':root:root[data-matrix="true"] {'''

css = re.sub(old_block, new_block, css)

with open("src/globals.css", "w") as f:
    f.write(css)
