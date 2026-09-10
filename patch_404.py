import re

with open("src/App.tsx", "r") as f:
    ts = f.read()

ts = ts.replace('const isHome = route === "home";', 'const isHome = route === "home" || route === "404";')

with open("src/App.tsx", "w") as f:
    f.write(ts)


with open("src/pages/NotFoundPage.tsx", "r") as f:
    ts = f.read()

ts = ts.replace('<p className="not-found__text">signal lost</p>', '<p className="not-found__text">not found</p>')
ts = ts.replace('return to base', 'return to home')

with open("src/pages/NotFoundPage.tsx", "w") as f:
    f.write(ts)
