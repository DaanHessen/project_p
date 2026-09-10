import re

with open("src/globals.css", "r") as f:
    glob_css = f.read()

app_flow_old = r'''\.app--flow::after \{
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background: linear-gradient\(
    to bottom,
    var\(--wash-start\),
    var\(--wash-end\)
  \);
\}'''

app_flow_new = r'''.app--flow::before,
.app--flow::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  transition: opacity 0.5s ease;
}

.app--flow::before {
  /* Dark mode wash */
  background: linear-gradient(
    to bottom,
    rgba(7, 8, 11, 0.5),
    rgba(7, 8, 11, 0.72)
  );
  opacity: 1;
}

.app--flow::after {
  /* Light mode wash */
  background: linear-gradient(
    to bottom,
    rgba(245, 245, 247, 0.5),
    rgba(245, 245, 247, 0.72)
  );
  opacity: 0;
}

html[data-theme="light"] .app--flow::before { opacity: 0; }
html[data-theme="light"] .app--flow::after { opacity: 1; }'''

glob_css = re.sub(app_flow_old, app_flow_new, glob_css, flags=re.DOTALL)

with open("src/globals.css", "w") as f:
    f.write(glob_css)
