import re

with open("src/App.tsx", "r") as f:
    ts = f.read()

ts = ts.replace('  const isHome = route === "home";\n', '')

with open("src/App.tsx", "w") as f:
    f.write(ts)
