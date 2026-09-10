import re

with open("src/pages/NotFoundPage.tsx", "r") as f:
    ts = f.read()

# Remove BackButton import
ts = ts.replace('import { BackButton } from "../components/BackButton";\n', '')

# Remove BackButton component
ts = ts.replace('      <BackButton onNavigateHome={onNavigateHome} />\n', '')

with open("src/pages/NotFoundPage.tsx", "w") as f:
    f.write(ts)
