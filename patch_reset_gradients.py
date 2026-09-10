import re

with open("src/pages/HomePage.css", "r") as f:
    css = f.read()

# Reset home__scrim
scrim_block = r'''\.home__scrim \{
  position: absolute;
  inset: 0;
  pointer-events: none;
\}

\.home__scrim::before,
\.home__scrim::after \{.*?html\[data-theme="light"\] \.home__scrim::after \{ 
  opacity: 1; 
  transition: opacity 0\.5s ease 0\.8s;
\}'''

scrim_new = r'''.home__scrim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse 46rem 24rem at 50% 50%,
    var(--scrim-0) 0%,
    var(--scrim-35) 35%,
    var(--scrim-60) 60%,
    transparent 78%
  );
}'''

css = re.sub(scrim_block, scrim_new, css, flags=re.DOTALL)

# Reset home__vignette
vig_block = r'''\.home__vignette \{
  position: absolute;
  inset: 0;
  pointer-events: none;
\}

\.home__vignette::before,
\.home__vignette::after \{.*?html\[data-theme="light"\] \.home__vignette::after \{ 
  opacity: 1; 
  transition: opacity 0\.5s ease 0\.8s;
\}'''

vig_new = r'''.home__vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse 90% 80% at 50% 50%,
    transparent 40%,
    var(--vig-100) 100%
  );
}'''

css = re.sub(vig_block, vig_new, css, flags=re.DOTALL)

with open("src/pages/HomePage.css", "w") as f:
    f.write(css)

with open("src/globals.css", "r") as f:
    css = f.read()

app_flow = r'''\.app--flow::before,
\.app--flow::after \{.*?html\[data-theme="light"\] \.app--flow::after \{ 
  opacity: 1; 
  transition: opacity 0\.5s ease 0\.8s;
\}'''

app_flow_new = r'''.app--flow::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background: linear-gradient(
    to bottom,
    var(--wash-start),
    var(--wash-end)
  );
}'''

css = re.sub(app_flow, app_flow_new, css, flags=re.DOTALL)

# Remove the global transition block
trans_block = r'''/\* Smooth theme transitions \*/
\*, \*::before, \*::after \{.*?transition-timing-function: ease;
\}'''
css = re.sub(trans_block, '', css, flags=re.DOTALL)

# Remove the data-matrix overrides
matrix_overrides = r'''/\* Force dark gradients when in Matrix mode.*?opacity 0\.05s ease 0s !important;
\}'''
css = re.sub(matrix_overrides, '', css, flags=re.DOTALL)

with open("src/globals.css", "w") as f:
    f.write(css)
