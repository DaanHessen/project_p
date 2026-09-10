import re

with open("src/pages/HomePage.css", "r") as f:
    home_css = f.read()

# Fix home__scrim
scrim_old = r'''\.home__scrim \{
  position: absolute;
  inset: 0;
  pointer-events: none;
  /\*.*?\*/
  background: radial-gradient\(
    ellipse 46rem 24rem at 50% 50%,
    rgba\(var\(--bg-rgb\), 0\.7\) 0%,
    rgba\(var\(--bg-rgb\), 0\.66\) 35%,
    rgba\(var\(--bg-rgb\), 0\.45\) 60%,
    transparent 78%
  \);
\}'''

scrim_new = r'''.home__scrim {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.home__scrim::before,
.home__scrim::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: opacity 0.5s ease;
}

.home__scrim::before {
  /* Dark mode scrim */
  background: radial-gradient(
    ellipse 46rem 24rem at 50% 50%,
    rgba(7, 8, 11, 0.7) 0%,
    rgba(7, 8, 11, 0.66) 35%,
    rgba(7, 8, 11, 0.45) 60%,
    transparent 78%
  );
  opacity: 1;
}

.home__scrim::after {
  /* Light mode scrim */
  background: radial-gradient(
    ellipse 46rem 24rem at 50% 50%,
    rgba(245, 245, 247, 0.7) 0%,
    rgba(245, 245, 247, 0.66) 35%,
    rgba(245, 245, 247, 0.45) 60%,
    transparent 78%
  );
  opacity: 0;
}

html[data-theme="light"] .home__scrim::before { opacity: 0; }
html[data-theme="light"] .home__scrim::after { opacity: 1; }'''

home_css = re.sub(scrim_old, scrim_new, home_css, flags=re.DOTALL)

# Fix home__vignette
vig_old = r'''\.home__vignette \{
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient\(
    ellipse 90% 80% at 50% 50%,
    transparent 40%,
    rgba\(var\(--bg-rgb\), 0\.55\) 100%
  \);
\}'''

vig_new = r'''.home__vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.home__vignette::before,
.home__vignette::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: opacity 0.5s ease;
}

.home__vignette::before {
  background: radial-gradient(
    ellipse 90% 80% at 50% 50%,
    transparent 40%,
    rgba(7, 8, 11, 0.55) 100%
  );
  opacity: 1;
}

.home__vignette::after {
  background: radial-gradient(
    ellipse 90% 80% at 50% 50%,
    transparent 40%,
    rgba(245, 245, 247, 0.55) 100%
  );
  opacity: 0;
}

html[data-theme="light"] .home__vignette::before { opacity: 0; }
html[data-theme="light"] .home__vignette::after { opacity: 1; }'''

home_css = re.sub(vig_old, vig_new, home_css, flags=re.DOTALL)

with open("src/pages/HomePage.css", "w") as f:
    f.write(home_css)
