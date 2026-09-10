import re

with open("src/globals.css", "r") as f:
    css = f.read()

# Fix :root transition block to remove scrims, vig, and wash
old_trans = r'''transition: --bg 0\.4s ease, --fg 0\.4s ease, --fg-muted 0\.4s ease, --fg-faint 0\.4s ease, --rule 0\.4s ease, --accent 0\.4s ease, --scrim-0 0\.4s ease, --scrim-35 0\.4s ease, --scrim-60 0\.4s ease, --vig-100 0\.4s ease, --wash-start 0\.4s ease, --wash-end 0\.4s ease, background-color 0\.4s ease, color 0\.4s ease, border-color 0\.4s ease;'''
new_trans = r'''transition: --bg 0.4s ease, --fg 0.4s ease, --fg-muted 0.4s ease, --fg-faint 0.4s ease, --rule 0.4s ease, --accent 0.4s ease, background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease;'''

css = re.sub(old_trans, new_trans, css)

with open("src/globals.css", "w") as f:
    f.write(css)
