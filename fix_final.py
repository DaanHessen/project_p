import re

with open("src/globals.css", "r") as f:
    css = f.read()

old = r''':root\[data-theme\]\[data-matrix="true"\] \{'''
new = r''':root[data-matrix="true"],
:root[data-theme="light"][data-matrix="true"] {'''

css = re.sub(old, new, css)

with open("src/globals.css", "w") as f:
    f.write(css)
