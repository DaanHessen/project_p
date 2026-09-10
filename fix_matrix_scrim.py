import re

with open("src/globals.css", "r") as f:
    css = f.read()

old_block = r'''html\[data-matrix="true"\] \{
  --bg: #000000;
  --bg-rgb: 0, 0, 0;
  --fg: #00ff41;
  --fg-muted: #008f11;
  --fg-faint: #003b00;
  --accent: #00ff41;
  --rule: #003b00;
\}'''

new_block = r'''html[data-matrix="true"] {
  --bg: #000000;
  --bg-rgb: 0, 0, 0;
  --fg: #00ff41;
  --fg-muted: #008f11;
  --fg-faint: #003b00;
  --accent: #00ff41;
  --rule: #003b00;
  --scrim-0: rgba(0, 0, 0, 0.7);
  --scrim-35: rgba(0, 0, 0, 0.66);
  --scrim-60: rgba(0, 0, 0, 0.45);
  --vig-100: rgba(0, 0, 0, 0.55);
  --wash-start: rgba(0, 0, 0, 0.5);
  --wash-end: rgba(0, 0, 0, 0.72);
}'''

css = re.sub(old_block, new_block, css)

with open("src/globals.css", "w") as f:
    f.write(css)
