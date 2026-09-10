import re

with open("src/globals.css", "r") as f:
    css = f.read()

# Define the properties
properties = '''@property --bg { syntax: '<color>'; inherits: true; initial-value: #07080b; }
@property --fg { syntax: '<color>'; inherits: true; initial-value: #f5f5f7; }
@property --fg-muted { syntax: '<color>'; inherits: true; initial-value: #a1a1a6; }
@property --fg-faint { syntax: '<color>'; inherits: true; initial-value: #86868b; }
@property --rule { syntax: '<color>'; inherits: true; initial-value: #2a2a2c; }
@property --accent { syntax: '<color>'; inherits: true; initial-value: #d9a441; }
@property --scrim-0 { syntax: '<color>'; inherits: true; initial-value: rgba(7, 8, 11, 0.7); }
@property --scrim-35 { syntax: '<color>'; inherits: true; initial-value: rgba(7, 8, 11, 0.66); }
@property --scrim-60 { syntax: '<color>'; inherits: true; initial-value: rgba(7, 8, 11, 0.45); }
@property --vig-100 { syntax: '<color>'; inherits: true; initial-value: rgba(7, 8, 11, 0.55); }
@property --wash-start { syntax: '<color>'; inherits: true; initial-value: rgba(7, 8, 11, 0.5); }
@property --wash-end { syntax: '<color>'; inherits: true; initial-value: rgba(7, 8, 11, 0.72); }

'''

# Ensure these variables exist in :root
root_vars = r''':root \{
  --bg: #07080b;
  --bg-rgb: 7, 8, 11;
  --fg: #f5f5f7;
  --fg-muted: #a1a1a6;
  --fg-faint: #86868b;
  --rule: #2a2a2c;
  --accent: #d9a441;
  --wash-start: rgba\(7, 8, 11, 0\.5\);
  --wash-end: rgba\(7, 8, 11, 0\.72\);'''

new_root_vars = r''':root {
  --bg: #07080b;
  --bg-rgb: 7, 8, 11;
  --fg: #f5f5f7;
  --fg-muted: #a1a1a6;
  --fg-faint: #86868b;
  --rule: #2a2a2c;
  --accent: #d9a441;
  --wash-start: rgba(7, 8, 11, 0.5);
  --wash-end: rgba(7, 8, 11, 0.72);
  --scrim-0: rgba(7, 8, 11, 0.7);
  --scrim-35: rgba(7, 8, 11, 0.66);
  --scrim-60: rgba(7, 8, 11, 0.45);
  --vig-100: rgba(7, 8, 11, 0.55);
  
  transition: --bg 0.4s ease, --fg 0.4s ease, --fg-muted 0.4s ease, --fg-faint 0.4s ease, --rule 0.4s ease, --accent 0.4s ease, --scrim-0 0.4s ease, --scrim-35 0.4s ease, --scrim-60 0.4s ease, --vig-100 0.4s ease, --wash-start 0.4s ease, --wash-end 0.4s ease, background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease;
'''

css = re.sub(root_vars, new_root_vars, css)
css = properties + css

# Add Light Mode versions
light_vars = r'''html\[data-theme="light"\] \{
  --bg: #f5f5f7;
  --bg-rgb: 245, 245, 247;
  --fg: #1d1d1f;
  --fg-muted: #6e6e73;
  --fg-faint: #a1a1a6;
  --rule: #e8e8ed;
  --accent: #0071e3;
  --wash-start: rgba\(245, 245, 247, 0\.5\);
  --wash-end: rgba\(245, 245, 247, 0\.72\);
\}'''

new_light_vars = r'''html[data-theme="light"] {
  --bg: #f5f5f7;
  --bg-rgb: 245, 245, 247;
  --fg: #1d1d1f;
  --fg-muted: #6e6e73;
  --fg-faint: #a1a1a6;
  --rule: #e8e8ed;
  --accent: #0071e3;
  --wash-start: rgba(245, 245, 247, 0.5);
  --wash-end: rgba(245, 245, 247, 0.72);
  --scrim-0: rgba(245, 245, 247, 0.7);
  --scrim-35: rgba(245, 245, 247, 0.66);
  --scrim-60: rgba(245, 245, 247, 0.45);
  --vig-100: rgba(245, 245, 247, 0.55);
}'''

css = re.sub(light_vars, new_light_vars, css)

with open("src/globals.css", "w") as f:
    f.write(css)
