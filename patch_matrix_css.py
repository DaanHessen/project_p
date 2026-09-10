import re

with open("src/globals.css", "r") as f:
    css = f.read()

# Remove the gradient overrides for data-matrix
css = re.sub(r'html\[data-matrix="true"\] \.home__scrim::before,.*?opacity: 0 !important;\n\}', '', css, flags=re.DOTALL)

with open("src/globals.css", "w") as f:
    f.write(css)
