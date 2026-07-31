# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the site's bottom-bar navigation and standalone résumé page with a single-composition landing screen and an in-app `/cv` route, and strip Vercel so the static build runs on a Raspberry Pi.

**Architecture:** A Vite + React 18 SPA with two routes driven by a ~40-line hand-rolled history router — no routing dependency. The landing route is a locked, non-scrolling viewport composed of the existing ASCII-blobs background, the ASCII name, and text navigation. The `/cv` route scrolls and renders a build-time-imported `resume.json` through typed React components, with a print stylesheet standing in for a PDF export. A dependency-free Node server with SPA history fallback serves `dist/`.

**Tech Stack:** Vite 5, React 18, TypeScript 5 (strict), framer-motion (ASCII reveal only), `ascii-blobs` (linked sibling checkout), react-helmet-async, Vitest (added by Task 2), plain CSS with custom properties.

**Spec:** `docs/superpowers/specs/2026-07-31-portfolio-redesign-design.md`

## Global Constraints

- **Do not modify the ASCII-blobs background.** No prop changes, no theme changes, no wrapper changes. `<AsciiBlobs />` is rendered exactly as it is today. The sibling checkout at `../ASCII-blobs` must not be edited.
- **Do not modify the ASCII name art string** in `HomePage.tsx`. Its content is fixed. Only its color and its reveal timing constants change.
- **Do not modify the reveal animation's structure** — the per-line `motion.div`, the `y: 12` offset, and the `[0.25, 0.1, 0.25, 1]` easing all stay. Only `duration` and the `delay` multiplier change, to `0.22` and `0.03`.
- **The landing route must not scroll.** The `/cv` route must scroll.
- **Single typeface:** `"JetBrains Mono"` at weights 400, 500, 600. No other font family is loaded anywhere in the project.
- **Color tokens are exactly these five plus one rule color.** No other colors are introduced:
  - `--bg: #07080b`
  - `--fg: #e8ebf0`
  - `--fg-muted: #9aa3b2`
  - `--fg-faint: #5a6472`
  - `--accent: #d9a441`
  - `--rule: rgba(154, 163, 178, 0.14)`
- **`--accent` is used for the résumé control and nothing else.** No other element on the site may reference it.
- **No new runtime dependencies.** Vitest is added as a devDependency only.
- TypeScript is `strict` with `noUnusedLocals` and `noUnusedParameters`. Dead imports and unused parameters fail `npm run type-check`.
- Every task ends with `npm run type-check` and `npm run lint` passing.

---

## File Structure

| File | Responsibility | Task |
| --- | --- | --- |
| `src/globals.css` | Design tokens, reset, route-level layout containers. Rewritten. | 1 |
| `index.html` | Font loading, base meta. Modified. | 1 |
| `src/animations.css` | Deleted (duplicate of a `globals.css` block). | 1 |
| `src/router.tsx` | `Route` type, `routeFromPath`, `useRoute`. Created. | 2 |
| `src/router.test.ts` | Unit tests for `routeFromPath`. Created. | 2 |
| `src/data/resume.json` | Résumé source data. Moved from `public/`. | 3 |
| `src/data/resume.ts` | Résumé types, typed export, `proficiency()`. Created. | 3 |
| `src/data/resume.test.ts` | Unit tests for `proficiency()`. Created. | 3 |
| `src/pages/ResumePage.tsx` | `/cv` route markup. Created. | 4 |
| `src/pages/ResumePage.css` | `/cv` screen and print styles. Created. | 4 |
| `src/components/SiteNav.tsx` | Résumé control + external link row. Replaced. | 5 |
| `src/components/SiteNav.css` | Nav styles. Created. | 5 |
| `src/components/SocialMedia.tsx` / `.css` | Deleted. | 5 |
| `src/pages/HomePage.tsx` / `.css` | Landing composition. Modified. | 6 |
| `src/App.tsx` | Route switch, nav wiring. Rewritten. | 6 |
| `src/components/SEOHead.tsx` | Gains `noindex` prop. Modified. | 7 |
| `public/robots.txt`, `public/sitemap.xml` | SEO corrections. Modified. | 7 |
| `server.mjs` | Static server with SPA fallback. Created. | 8 |
| `docs/deploy-pi.md` | Build and run instructions. Created. | 8 |
| `vite.config.ts`, `package.json`, `src/vite-env.d.ts`, `.gitignore` | Vercel removal. Modified. | 8 |

---

### Task 1: Design tokens and typography

Rewrite the stylesheet foundation before any component work, so every later task builds on the final tokens.

**Files:**
- Modify: `src/globals.css` (full rewrite)
- Modify: `index.html:76-91` (font links), `index.html:136-140` (inline `<style>`)
- Modify: `src/main.tsx:5`
- Delete: `src/animations.css`

**Interfaces:**
- Consumes: nothing.
- Produces: CSS custom properties `--bg`, `--fg`, `--fg-muted`, `--fg-faint`, `--accent`, `--rule`, `--font-mono`, `--space-1` … `--space-8`, `--measure`. Layout classes `.app`, `.app--locked`, `.app--flow`.

- [ ] **Step 1: Replace the font links in `index.html`**

Delete these three `<link>` elements (they load Lora, Space Grotesk, and JetBrains Mono):

```html
    <link 
      href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap" 
      rel="stylesheet"
    />
    <link 
      href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" 
      rel="stylesheet"
    />
    <link 
      href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" 
      rel="stylesheet"
    />
```

Replace with a single link:

```html
    <link
      href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
```

- [ ] **Step 2: Fix the inline background in `index.html`**

Replace the `<style>` block near the end of `<head>`:

```html
    <style>
      body {
        background-color: #000;
      }
    </style>
```

with:

```html
    <style>
      body {
        background-color: #07080b;
      }
    </style>
```

This is the pre-CSS paint color and must match `--bg`, or the page flashes a different black on load.

- [ ] **Step 3: Update the theme-color meta**

In `index.html`, change:

```html
    <meta name="theme-color" content="#3b82f6" />
    <meta name="msapplication-TileColor" content="#3b82f6" />
```

to:

```html
    <meta name="theme-color" content="#07080b" />
    <meta name="msapplication-TileColor" content="#07080b" />
```

- [ ] **Step 4: Rewrite `src/globals.css`**

Replace the entire file with:

```css
/* Design tokens ---------------------------------------------------------- */

:root {
  --bg: #07080b;
  --fg: #e8ebf0;
  --fg-muted: #9aa3b2;
  --fg-faint: #5a6472;
  --accent: #d9a441;
  --rule: rgba(154, 163, 178, 0.14);

  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo,
    "Courier New", monospace;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 3rem;
  --space-8: 4.5rem;

  --measure: 68ch;

  color-scheme: dark;
}

/* Reset ------------------------------------------------------------------ */

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  overflow-x: hidden;
  background: var(--bg);
  -webkit-text-size-adjust: 100%;
}

body {
  background: var(--bg);
  color: var(--fg-muted);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.7;
  letter-spacing: 0.01em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: transparent;
}

#root {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--bg);
}

a {
  color: inherit;
  text-decoration: none;
}

ul {
  list-style: none;
}

::selection {
  background: var(--fg);
  color: var(--bg);
}

:focus-visible {
  outline: 1px solid var(--accent);
  outline-offset: 3px;
}

/* Route containers ------------------------------------------------------- */
/*
  The landing route is a locked viewport; /cv scrolls. Scrolling is decided
  here rather than on body, so one route can lock without trapping the other.
*/

.app {
  background: var(--bg);
}

.app--locked {
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
}

.app--flow {
  min-height: 100vh;
  min-height: 100dvh;
}

/* Motion ----------------------------------------------------------------- */

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Note what is deliberately gone: the `SF Pixelate` `@font-face` blocks (third-party CDN), the six accent colors, the shadow and gradient tokens, the radius scale, the `scrollbar-width: none` hiding, the `user-select: none` on body, the viewport-width-keyed `animation-duration` overrides, and the `.ascii-blobs banner` hiding rules.

- [ ] **Step 5: Remove the `animations.css` import**

In `src/main.tsx`, delete this line and the blank line after it:

```tsx
import "./animations.css";
```

- [ ] **Step 6: Delete the file**

```bash
git rm src/animations.css
```

- [ ] **Step 7: Verify the build still compiles**

Run: `npm run type-check && npm run build`
Expected: both succeed. The page will look broken at this point — `HomePage.css` and `SocialMedia.css` still reference deleted tokens like `--bg-primary` and `--accent-primary`, which resolve to nothing. Later tasks replace them. Do not patch those files here.

- [ ] **Step 8: Commit**

```bash
git add index.html src/globals.css src/main.tsx
git rm --cached src/animations.css 2>/dev/null || true
git commit -m "refactor(style): replace palette and type stack with single-family mono tokens"
```

---

### Task 2: Router

**Files:**
- Create: `src/router.tsx`
- Create: `src/router.test.ts`
- Modify: `vite.config.ts` (add a `test` block)
- Modify: `package.json` (add `vitest` devDependency and a `test` script)

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `export type Route = "home" | "cv"`
  - `export function routeFromPath(pathname: string): Route`
  - `export function useRoute(): { route: Route; navigate: (path: string) => void }`

- [ ] **Step 1: Install Vitest**

```bash
npm install --save-dev vitest
```

Vitest is the only test dependency added. `routeFromPath` is a pure string function, so tests run in the default `node` environment — no jsdom, no testing-library.

- [ ] **Step 2: Add the test script**

In `package.json`, add to `"scripts"`:

```json
    "test": "vitest run",
```

- [ ] **Step 3: Configure Vitest**

In `vite.config.ts`, add a `test` block as a top-level key of the `defineConfig` object (alongside `build`, `css`, `server`), and add the triple-slash reference as the file's first line:

```ts
/// <reference types="vitest" />
```

```ts
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
```

- [ ] **Step 4: Write the failing test**

Create `src/router.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { routeFromPath } from "./router";

describe("routeFromPath", () => {
  it("maps the root path to home", () => {
    expect(routeFromPath("/")).toBe("home");
  });

  it("maps /cv to the cv route", () => {
    expect(routeFromPath("/cv")).toBe("cv");
  });

  it("ignores a trailing slash on /cv", () => {
    expect(routeFromPath("/cv/")).toBe("cv");
  });

  it("falls back to home for unknown paths", () => {
    expect(routeFromPath("/resume.html")).toBe("home");
    expect(routeFromPath("/nope")).toBe("home");
  });
});
```

- [ ] **Step 5: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./router"`.

- [ ] **Step 6: Write the router**

Create `src/router.tsx`:

```tsx
import { useCallback, useEffect, useState } from "react";

export type Route = "home" | "cv";

/**
 * Two routes and a fallback. Kept as a pure function so it can be tested
 * without a DOM, and so `useRoute` has nothing to decide at call time.
 */
export function routeFromPath(pathname: string): Route {
  const normalised = pathname.replace(/\/+$/, "");
  return normalised === "/cv" ? "cv" : "home";
}

function currentPath(): string {
  return typeof window === "undefined" ? "/" : window.location.pathname;
}

export function useRoute(): {
  route: Route;
  navigate: (path: string) => void;
} {
  const [route, setRoute] = useState<Route>(() =>
    routeFromPath(currentPath()),
  );

  useEffect(() => {
    const onPopState = () => setRoute(routeFromPath(currentPath()));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback((path: string) => {
    if (path !== window.location.pathname) {
      window.history.pushState({}, "", path);
    }
    setRoute(routeFromPath(path));
    window.scrollTo(0, 0);
  }, []);

  return { route, navigate };
}
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS, 4 tests.

- [ ] **Step 8: Verify types and lint**

Run: `npm run type-check && npm run lint`
Expected: both clean.

- [ ] **Step 9: Commit**

```bash
git add src/router.tsx src/router.test.ts vite.config.ts package.json package-lock.json
git commit -m "feat(router): add dependency-free history router for / and /cv"
```

---

### Task 3: Résumé data module

**Files:**
- Move: `public/resume.json` → `src/data/resume.json`
- Create: `src/data/resume.ts`
- Create: `src/data/resume.test.ts`
- Modify: `tsconfig.app.json` (add `resolveJsonModule`)

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `export interface ExperienceEntry { company: string; location: string; duration: string; position: string; description: string }`
  - `export interface EducationEntry { institution: string; location: string; duration: string; degree: string; description: string }`
  - `export interface ProjectLink { type: string; text: string; url: string }`
  - `export interface ProjectEntry { name: string; description: string; links: ProjectLink[] }`
  - `export interface LanguageEntry { name: string; level: number }`
  - `export interface Resume { personal: { position: string; about: string }; experience: ExperienceEntry[]; education: EducationEntry[]; skills: string[]; languages: LanguageEntry[]; projects: ProjectEntry[] }`
  - `export const resume: Resume`
  - `export function proficiency(level: number): string`

- [ ] **Step 1: Move the data file**

```bash
mkdir -p src/data
git mv public/resume.json src/data/resume.json
```

- [ ] **Step 2: Enable JSON imports**

In `tsconfig.app.json`, add to `"compilerOptions"` (after `"moduleDetection": "force",`):

```json
    "resolveJsonModule": true,
```

- [ ] **Step 3: Write the failing test**

Create `src/data/resume.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { proficiency, resume } from "./resume";

describe("proficiency", () => {
  it("calls a full score native", () => {
    expect(proficiency(100)).toBe("native");
  });

  it("calls a high score fluent", () => {
    expect(proficiency(95)).toBe("fluent");
    expect(proficiency(99)).toBe("fluent");
  });

  it("calls a mid score conversational", () => {
    expect(proficiency(65)).toBe("conversational");
    expect(proficiency(60)).toBe("conversational");
  });

  it("calls a low score basic", () => {
    expect(proficiency(30)).toBe("basic");
  });
});

describe("resume data", () => {
  it("carries no contact details", () => {
    // The gate decision in the spec rests on this staying true.
    const personal = resume.personal as Record<string, unknown>;
    expect(personal.email).toBeUndefined();
    expect(personal.phone).toBeUndefined();
    expect(personal.dob).toBeUndefined();
    expect(personal.address).toBeUndefined();
  });

  it("has entries to render", () => {
    expect(resume.experience.length).toBeGreaterThan(0);
    expect(resume.education.length).toBeGreaterThan(0);
    expect(resume.projects.length).toBeGreaterThan(0);
    expect(resume.languages.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./resume"`.

- [ ] **Step 5: Write the data module**

Create `src/data/resume.ts`:

```ts
import raw from "./resume.json";

export interface ExperienceEntry {
  company: string;
  location: string;
  duration: string;
  position: string;
  description: string;
}

export interface EducationEntry {
  institution: string;
  location: string;
  duration: string;
  degree: string;
  description: string;
}

export interface ProjectLink {
  type: string;
  text: string;
  url: string;
}

export interface ProjectEntry {
  name: string;
  description: string;
  links: ProjectLink[];
}

export interface LanguageEntry {
  name: string;
  level: number;
}

export interface Resume {
  personal: {
    position: string;
    about: string;
  };
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  languages: LanguageEntry[];
  projects: ProjectEntry[];
}

export const resume = raw as Resume;

/**
 * The JSON stores language ability as a percentage, which is a precision the
 * data does not have. Rendering it as a bar implies a measurement nobody took,
 * so it collapses to a word instead.
 */
export function proficiency(level: number): string {
  if (level >= 100) return "native";
  if (level >= 90) return "fluent";
  if (level >= 55) return "conversational";
  return "basic";
}
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS, 10 tests total across both test files.

- [ ] **Step 7: Verify types**

Run: `npm run type-check`
Expected: clean. If it reports that `resume.json` cannot be resolved, `resolveJsonModule` was not added in Step 2.

- [ ] **Step 8: Commit**

```bash
git add src/data tsconfig.app.json
git commit -m "feat(resume): move resume data into src and type it"
```

---

### Task 4: `/cv` route

**Files:**
- Create: `src/pages/ResumePage.tsx`
- Create: `src/pages/ResumePage.css`
- Delete: `public/resume.html`

**Interfaces:**
- Consumes: `resume`, `proficiency`, and the entry types from `src/data/resume` (Task 3). `SEOHead` from `src/components/SEOHead` — note this task uses only its existing props; the `noindex` prop arrives in Task 7.
- Produces: `export default function ResumePage(props: { onNavigateHome: () => void }): JSX.Element`

The `onNavigateHome` prop is supplied by `App` in Task 6.

- [ ] **Step 1: Write `src/pages/ResumePage.css`**

```css
.resume {
  max-width: 46rem;
  margin: 0 auto;
  padding: var(--space-8) var(--space-5) var(--space-8);
}

/* Header ----------------------------------------------------------------- */

.resume__bar {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
}

.resume__back,
.resume__print {
  font-size: 0.8125rem;
  color: var(--fg-faint);
  background: none;
  border: 0;
  font-family: inherit;
  cursor: pointer;
  transition: color 0.15s ease;
}

.resume__back:hover,
.resume__print:hover {
  color: var(--fg);
}

.resume__name {
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--fg);
  line-height: 1.2;
}

.resume__position {
  margin-top: var(--space-2);
  color: var(--fg-muted);
}

.resume__about {
  margin-top: var(--space-5);
  max-width: var(--measure);
  color: var(--fg-muted);
}

/* Sections --------------------------------------------------------------- */

.resume__section {
  margin-top: var(--space-8);
}

.resume__section-title {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--fg-faint);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--rule);
}

/* Entries ---------------------------------------------------------------- */
/*
  Two columns: a fixed meta gutter for dates and place, and a flexible column
  for the thing itself. On narrow screens the gutter stacks above rather than
  squeezing, which keeps the dates readable.
*/

.resume__entry {
  display: grid;
  grid-template-columns: 11rem 1fr;
  gap: var(--space-5);
  padding: var(--space-5) 0;
  border-bottom: 1px solid var(--rule);
}

.resume__entry:last-child {
  border-bottom: 0;
}

.resume__meta {
  color: var(--fg-faint);
  font-size: 0.8125rem;
  line-height: 1.6;
}

.resume__meta-place {
  display: block;
}

.resume__entry-title {
  color: var(--fg);
  font-weight: 500;
}

.resume__entry-org {
  color: var(--fg-muted);
}

.resume__entry-desc {
  margin-top: var(--space-3);
  max-width: var(--measure);
}

/* Languages -------------------------------------------------------------- */

.resume__languages {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2) var(--space-6);
  padding-top: var(--space-5);
}

.resume__language-level {
  color: var(--fg-faint);
}

/* Project links ---------------------------------------------------------- */

.resume__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  margin-top: var(--space-3);
}

.resume__link {
  color: var(--fg-muted);
  border-bottom: 1px solid var(--rule);
  padding-bottom: 1px;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.resume__link:hover {
  color: var(--fg);
  border-bottom-color: var(--fg-faint);
}

/* Narrow ----------------------------------------------------------------- */

@media (max-width: 40rem) {
  .resume {
    padding: var(--space-6) var(--space-4);
  }

  .resume__entry {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }

  .resume__meta {
    display: flex;
    gap: var(--space-3);
  }

  .resume__meta-place::before {
    content: "·";
    margin-right: var(--space-3);
  }
}

/* Print ------------------------------------------------------------------ */
/*
  This is the download. "Save as PDF" from the browser print dialog must land
  on a clean A4 document, so everything screen-specific inverts or disappears.
*/

@page {
  size: A4;
  margin: 18mm;
}

@media print {
  html,
  body,
  #root,
  .app,
  .app--flow {
    background: #fff !important;
    color: #000 !important;
    height: auto !important;
    min-height: 0 !important;
    overflow: visible !important;
  }

  .resume__bar,
  .resume__back,
  .resume__print {
    display: none !important;
  }

  .resume {
    max-width: none;
    margin: 0;
    padding: 0;
    font-size: 10pt;
    line-height: 1.45;
    color: #000;
  }

  .resume__name,
  .resume__entry-title {
    color: #000;
  }

  .resume__position,
  .resume__about,
  .resume__entry-org,
  .resume__entry-desc,
  .resume__meta,
  .resume__section-title,
  .resume__language-level,
  .resume__link {
    color: #1a1a1a;
  }

  .resume__section-title,
  .resume__entry {
    border-color: #c8c8c8;
  }

  .resume__section {
    margin-top: 8mm;
    break-inside: avoid;
  }

  .resume__entry {
    break-inside: avoid;
    padding: 3mm 0;
  }

  .resume__link {
    border-bottom: 0;
    text-decoration: underline;
  }

  /* Printed links are dead without their target. */
  .resume__link::after {
    content: " (" attr(href) ")";
    font-size: 8pt;
    color: #555;
  }
}
```

- [ ] **Step 2: Write `src/pages/ResumePage.tsx`**

```tsx
import SEOHead from "../components/SEOHead";
import { proficiency, resume } from "../data/resume";
import "./ResumePage.css";

interface ResumePageProps {
  onNavigateHome: () => void;
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: "Daan Hessen",
    jobTitle: resume.personal.position,
    description: resume.personal.about,
    url: "https://daanhessen.nl",
  },
};

const ResumePage = ({ onNavigateHome }: ResumePageProps) => (
  <>
    <SEOHead
      title="Résumé — Daan Hessen"
      description={resume.personal.about}
      canonical="https://daanhessen.nl/cv"
      structuredData={structuredData}
    />

    <main className="resume">
      <div className="resume__bar">
        <button
          type="button"
          className="resume__back"
          onClick={onNavigateHome}
        >
          ← back
        </button>
        <button
          type="button"
          className="resume__print"
          onClick={() => window.print()}
        >
          download ↓
        </button>
      </div>

      <header>
        <h1 className="resume__name">Daan Hessen</h1>
        <p className="resume__position">{resume.personal.position}</p>
        <p className="resume__about">{resume.personal.about}</p>
      </header>

      <section className="resume__section">
        <h2 className="resume__section-title">Experience</h2>
        {resume.experience.map((job) => (
          <article
            className="resume__entry"
            key={`${job.company}-${job.duration}`}
          >
            <div className="resume__meta">
              <span>{job.duration}</span>
              <span className="resume__meta-place">{job.location}</span>
            </div>
            <div>
              <h3 className="resume__entry-title">{job.position}</h3>
              <p className="resume__entry-org">{job.company}</p>
              <p className="resume__entry-desc">{job.description}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="resume__section">
        <h2 className="resume__section-title">Education</h2>
        {resume.education.map((entry) => (
          <article
            className="resume__entry"
            key={`${entry.institution}-${entry.duration}`}
          >
            <div className="resume__meta">
              <span>{entry.duration}</span>
              <span className="resume__meta-place">{entry.location}</span>
            </div>
            <div>
              <h3 className="resume__entry-title">{entry.degree}</h3>
              <p className="resume__entry-org">{entry.institution}</p>
              <p className="resume__entry-desc">{entry.description}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="resume__section">
        <h2 className="resume__section-title">Projects</h2>
        {resume.projects.map((project) => (
          <article className="resume__entry" key={project.name}>
            <div className="resume__meta">
              <span>{project.name}</span>
            </div>
            <div>
              <p className="resume__entry-desc">{project.description}</p>
              <div className="resume__links">
                {project.links.map((link) => (
                  <a
                    className="resume__link"
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.text} ↗
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="resume__section">
        <h2 className="resume__section-title">Languages</h2>
        <ul className="resume__languages">
          {resume.languages.map((language) => (
            <li key={language.name}>
              {language.name}{" "}
              <span className="resume__language-level">
                — {proficiency(language.level)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  </>
);

export default ResumePage;
```

Note: `resume.skills` is deliberately not rendered — the array is empty.

- [ ] **Step 3: Delete the old résumé page**

```bash
git rm public/resume.html
```

All 1176 lines of it. Its data source already moved in Task 3, and nothing links to it after Task 5.

- [ ] **Step 4: Verify types and lint**

Run: `npm run type-check && npm run lint`
Expected: clean. The component is not mounted yet, which is fine — Task 6 wires it up.

- [ ] **Step 5: Commit**

```bash
git add src/pages/ResumePage.tsx src/pages/ResumePage.css
git commit -m "feat(cv): replace static resume.html with a typed /cv route"
```

---

### Task 5: Navigation

**Files:**
- Modify: `src/components/SiteNav.tsx` (replace the existing unused stub entirely)
- Create: `src/components/SiteNav.css`
- Delete: `src/components/SocialMedia.tsx`, `src/components/SocialMedia.css`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `export default function SiteNav(props: { onNavigateToResume: () => void }): JSX.Element`

- [ ] **Step 1: Write `src/components/SiteNav.css`**

```css
.site-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
}

/*
  The résumé link is the only control on the page with a job to do, so it is
  the only element that carries the accent. Everything else is a text link.
*/

.site-nav__resume {
  display: inline-flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-5);
  border: 1px solid var(--accent);
  color: var(--accent);
  font-size: 0.875rem;
  letter-spacing: 0.04em;
  transition:
    background-color 0.18s ease,
    color 0.18s ease;
}

.site-nav__resume:hover,
.site-nav__resume:focus-visible {
  background: var(--accent);
  color: var(--bg);
}

.site-nav__arrow {
  transition: transform 0.18s ease;
}

.site-nav__resume:hover .site-nav__arrow {
  transform: translateX(2px);
}

.site-nav__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-2) var(--space-5);
}

.site-nav__link {
  color: var(--fg-faint);
  font-size: 0.8125rem;
  letter-spacing: 0.02em;
  transition: color 0.15s ease;
}

.site-nav__link:hover,
.site-nav__link:focus-visible {
  color: var(--fg);
}

@media (max-width: 30rem) {
  .site-nav {
    gap: var(--space-5);
  }

  .site-nav__links {
    gap: var(--space-2) var(--space-4);
  }
}
```

- [ ] **Step 2: Replace `src/components/SiteNav.tsx`**

Overwrite the whole file:

```tsx
import type { MouseEvent } from "react";
import "./SiteNav.css";

interface SiteNavProps {
  onNavigateToResume: () => void;
}

const links = [
  { label: "github", href: "https://github.com/DaanHessen" },
  {
    label: "linkedin",
    href: "https://www.linkedin.com/in/daan-hessen-552789236/",
  },
  { label: "x", href: "https://x.com/Ge_Daan0" },
  { label: "instagram", href: "https://www.instagram.com/daanhessen_/" },
  { label: "email", href: "mailto:daanh2002@gmail.com" },
];

const SiteNav = ({ onNavigateToResume }: SiteNavProps) => {
  /*
    A real href, intercepted. Modified clicks fall through so middle-click and
    "open in new tab" keep working, which a button-based nav would break.
  */
  const handleResumeClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    onNavigateToResume();
  };

  return (
    <nav className="site-nav" aria-label="Primary">
      <a className="site-nav__resume" href="/cv" onClick={handleResumeClick}>
        <span>résumé</span>
        <span className="site-nav__arrow" aria-hidden="true">
          →
        </span>
      </a>

      <ul className="site-nav__links">
        {links.map((link) => (
          <li key={link.label}>
            <a
              className="site-nav__link"
              href={link.href}
              {...(link.href.startsWith("mailto:")
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SiteNav;
```

The buymeacoffee link from the old bar is intentionally not carried over.

- [ ] **Step 3: Delete the old bar**

```bash
git rm src/components/SocialMedia.tsx src/components/SocialMedia.css
```

- [ ] **Step 4: Verify the deletion broke exactly one import**

Run: `npm run type-check`
Expected: FAIL, with an error in `src/App.tsx` about the missing `./components/SocialMedia` module. That is the only expected error; Task 6 fixes it. If any other file errors, something else imported `SocialMedia` and needs handling.

- [ ] **Step 5: Commit**

```bash
git add src/components/SiteNav.tsx src/components/SiteNav.css
git commit -m "feat(nav): replace bottom icon bar with typographic nav"
```

---

### Task 6: Landing composition and route wiring

**Files:**
- Modify: `src/App.tsx` (rewrite)
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/HomePage.css` (rewrite)
- Delete: `src/utils/useGlobalAnimations.ts`

**Interfaces:**
- Consumes: `useRoute` from `src/router` (Task 2), `ResumePage` (Task 4), `SiteNav` (Task 5).
- Produces: `HomePage` takes `{ onNavigateToResume: () => void }`.

- [ ] **Step 1: Rewrite `src/App.tsx`**

```tsx
import "./globals.css";
import HomePage from "./pages/HomePage";
import ResumePage from "./pages/ResumePage";
import { useRoute } from "./router";

function App() {
  const { route, navigate } = useRoute();

  return (
    <div className={`app ${route === "cv" ? "app--flow" : "app--locked"}`}>
      {route === "cv" ? (
        <ResumePage onNavigateHome={() => navigate("/")} />
      ) : (
        <HomePage onNavigateToResume={() => navigate("/cv")} />
      )}
    </div>
  );
}

export default App;
```

The `@vercel/analytics` import and its idle-load effect are gone; Task 8 removes the dependency itself.

- [ ] **Step 2: Rewrite `src/pages/HomePage.css`**

```css
.home {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.home__stage {
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-7);
  padding: var(--space-6) var(--space-4);
  text-align: center;
}

/* Name ------------------------------------------------------------------- */

.home__name {
  width: 100%;
  overflow: hidden;
  user-select: none;
}

.home__name-art {
  margin: 0;
  font-family: var(--font-mono);
  font-size: clamp(0.4rem, 1.1vw, 0.8rem);
  line-height: 1;
  color: var(--fg);
  white-space: pre;
  text-align: center;
  font-kerning: none;
  -webkit-font-smoothing: antialiased;
}

.home__tagline {
  margin-top: var(--space-5);
  color: var(--fg-faint);
  font-size: 0.8125rem;
  letter-spacing: 0.16em;
  text-transform: lowercase;
}

/* Blobs credit ----------------------------------------------------------- */

.home__credit {
  position: fixed;
  top: var(--space-4);
  right: var(--space-4);
  z-index: 3;
  font-size: 0.6875rem;
  color: var(--fg-faint);
  letter-spacing: 0.02em;
}

.home__credit a {
  transition: color 0.15s ease;
}

.home__credit a:hover {
  color: var(--fg-muted);
}

@media (max-width: 30rem) {
  .home__stage {
    gap: var(--space-6);
    padding: var(--space-5) var(--space-3);
  }

  .home__credit {
    font-size: 0.625rem;
    top: var(--space-3);
    right: var(--space-3);
  }

  .home__tagline {
    letter-spacing: 0.1em;
  }
}
```

Note the removals: the `#3b82f6` text-shadow glow on the name, the blue radial `::before` wash, the `slideDownFromTop` keyframes, the `.hero-section` rules, and the four stacked `translateZ(0)` / `backface-visibility` hacks.

- [ ] **Step 3: Rewrite `src/pages/HomePage.tsx`**

Keep the ASCII string and the responsive font-size measurement exactly as they are — only the surrounding structure, class names, and animation constants change.

```tsx
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { AsciiBlobs } from "ascii-blobs";
import "ascii-blobs/dist/style.css";
import SEOHead from "../components/SEOHead";
import SiteNav from "../components/SiteNav";
import "./HomePage.css";

interface HomePageProps {
  onNavigateToResume: () => void;
}

const asciiArt = `██████╗  █████╗  █████╗ ███╗   ██╗    ██╗  ██╗███████╗███████╗███████╗███████╗███╗   ██╗
██╔══██╗██╔══██╗██╔══██╗████╗  ██║    ██║  ██║██╔════╝██╔════╝██╔════╝██╔════╝████╗  ██║
██║  ██║███████║███████║██╔██╗ ██║    ███████║█████╗  ███████╗███████╗█████╗  ██╔██╗ ██║
██║  ██║██╔══██║██╔══██║██║╚██╗██║    ██╔══██║██╔══╝  ╚════██║╚════██║██╔══╝  ██║╚██╗██║
██████╔╝██║  ██║██║  ██║██║ ╚████║    ██║  ██║███████╗███████║███████║███████╗██║ ╚████║
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝    ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═══╝`;

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: "Daan Hessen",
    jobTitle: "Software Developer",
    url: "https://daanhessen.nl",
    worksFor: {
      "@type": "EducationalOrganization",
      name: "University of Applied Sciences Utrecht",
    },
  },
};

const HomePage = ({ onNavigateToResume }: HomePageProps) => {
  const [showBlobs, setShowBlobs] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowBlobs(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const asciiLines = useMemo(() => asciiArt.split("\n"), []);
  const maxLineLength = useMemo(
    () => asciiLines.reduce((max, line) => Math.max(max, line.length), 0),
    [asciiLines],
  );

  const nameRef = useRef<HTMLDivElement | null>(null);
  const [fontSize, setFontSize] = useState("clamp(0.4rem, 1.1vw, 0.8rem)");

  useEffect(() => {
    const updateFontSize = () => {
      const container = nameRef.current;
      if (!container || maxLineLength === 0) return;

      const availableWidth = container.clientWidth;
      if (availableWidth <= 0) return;

      if (window.innerWidth <= 768) {
        const sizeByWidth = (availableWidth * 0.92) / maxLineLength;
        setFontSize(`${Math.max(5, sizeByWidth)}px`);
      } else {
        setFontSize("clamp(0.4rem, 1.1vw, 0.8rem)");
      }
    };

    updateFontSize();

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const debouncedUpdate = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateFontSize, 150);
    };

    window.addEventListener("resize", debouncedUpdate);
    window.addEventListener("orientationchange", updateFontSize);

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", debouncedUpdate);
      window.removeEventListener("orientationchange", updateFontSize);
    };
  }, [maxLineLength]);

  return (
    <>
      <SEOHead
        title="Daan Hessen — Software Developer"
        description="Software development student in Utrecht."
        canonical="https://daanhessen.nl"
        structuredData={structuredData}
      />

      <div className="home">
        {showBlobs && <AsciiBlobs />}

        <div className="home__credit">
          <a
            href="https://www.npmjs.com/package/ascii-blobs"
            target="_blank"
            rel="noopener noreferrer"
          >
            ascii-blobs v1.0.3
          </a>
          {" · "}
          <a
            href="https://github.com/DaanHessen/ASCII-blobs"
            target="_blank"
            rel="noopener noreferrer"
          >
            git
          </a>
        </div>

        <div className="home__stage">
          <div className="home__name" ref={nameRef}>
            <pre className="home__name-art" style={{ fontSize }}>
              {asciiLines.map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.22,
                    delay: index * 0.03,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  style={{ display: "block", fontKerning: "none" }}
                >
                  {line}
                </motion.div>
              ))}
            </pre>
            <p className="home__tagline">software developer · utrecht</p>
          </div>

          <SiteNav onNavigateToResume={onNavigateToResume} />
        </div>
      </div>
    </>
  );
};

export default HomePage;
```

- [ ] **Step 4: Delete the dead animation hook**

```bash
git rm src/utils/useGlobalAnimations.ts
rmdir src/utils 2>/dev/null || true
```

- [ ] **Step 5: Verify**

Run: `npm run type-check && npm run lint && npm test && npm run build`
Expected: all four succeed.

- [ ] **Step 6: Check it in a browser**

Run: `npm run dev`

Confirm by eye:
- The landing screen does not scroll — no scrollbar, mouse wheel does nothing.
- The ASCII name reveals noticeably faster than before and is off-white, not blue, with no glow.
- The blobs background looks unchanged from before this work.
- The résumé control is the only colored element on screen.
- Clicking `résumé` moves to `/cv` without a page reload; `/cv` scrolls.
- `←  back` returns to `/`; the browser back button also works from `/cv`.
- Middle-clicking `résumé` opens `/cv` in a new tab.
- Tab order is: credit links → résumé → github → linkedin → x → instagram → email, with a visible focus ring on each.

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/pages/HomePage.tsx src/pages/HomePage.css
git commit -m "feat(home): rebuild landing as single composition and wire routes"
```

---

### Task 7: SEO corrections

**Files:**
- Modify: `src/components/SEOHead.tsx`
- Modify: `src/pages/ResumePage.tsx`
- Modify: `public/robots.txt`
- Modify: `public/sitemap.xml`

**Interfaces:**
- Consumes: `SEOHead` (existing), `ResumePage` (Task 4).
- Produces: `SEOHeadProps` gains `noindex?: boolean`.

- [ ] **Step 1: Add the `noindex` prop to `SEOHead`**

In `src/components/SEOHead.tsx`, add to the `SEOHeadProps` interface:

```tsx
  noindex?: boolean;
```

Add `noindex = false,` to the destructured parameters, and add this inside `<Helmet>` immediately after the `<meta name="description" …>` line:

```tsx
      {noindex && <meta name="robots" content="noindex, follow" />}
```

- [ ] **Step 2: Pass it from the résumé route**

In `src/pages/ResumePage.tsx`, add `noindex` to the `<SEOHead>` element:

```tsx
    <SEOHead
      title="Résumé — Daan Hessen"
      description={resume.personal.about}
      canonical="https://daanhessen.nl/cv"
      structuredData={structuredData}
      noindex
    />
```

- [ ] **Step 3: Disallow `/cv` in `public/robots.txt`**

Change the opening block from:

```
User-agent: *
Allow: /
```

to:

```
User-agent: *
Allow: /
Disallow: /cv
```

Leave the rest of the file unchanged.

- [ ] **Step 4: Drop the stale résumé URL from `public/sitemap.xml`**

Replace the whole file with:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

  <url>
    <loc>https://daanhessen.nl/</loc>
    <lastmod>2026-07-31</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>

</urlset>
```

`/cv` is not added: it is noindexed, and a noindexed URL does not belong in a sitemap.

- [ ] **Step 5: Verify**

Run: `npm run type-check && npm run lint && npm run dev`

In the browser at `/cv`, open devtools and confirm `<meta name="robots" content="noindex, follow">` is present in `<head>`. Confirm it is **absent** on `/`.

- [ ] **Step 6: Commit**

```bash
git add src/components/SEOHead.tsx src/pages/ResumePage.tsx public/robots.txt public/sitemap.xml
git commit -m "feat(seo): noindex the cv route and drop the stale resume sitemap entry"
```

---

### Task 8: Remove Vercel, add a Pi-servable setup

**Files:**
- Modify: `package.json`, `vite.config.ts`, `src/vite-env.d.ts`, `.gitignore`
- Create: `server.mjs`, `docs/deploy-pi.md`

**Interfaces:**
- Consumes: nothing.
- Produces: `npm run serve` starts a static server over `dist/` with SPA fallback.

- [ ] **Step 1: Remove the Vercel dependency**

```bash
npm uninstall @vercel/analytics
```

`src/App.tsx` already stopped importing it in Task 6, so nothing else needs changing there.

- [ ] **Step 2: Remove the Vercel build variable from `vite.config.ts`**

Delete these lines:

```ts
const resumeVersion =
  process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ??
  process.env.npm_package_version ??
  Date.now().toString();
```

and delete the whole `define` block:

```ts
  define: {
    __RESUME_VERSION__: JSON.stringify(resumeVersion),
  },
```

`__RESUME_VERSION__` existed to cache-bust `/resume.html?v=…`. With `resume.json` bundled, Vite's hashed filenames handle that.

- [ ] **Step 3: Remove the type declaration**

In `src/vite-env.d.ts`, delete:

```ts
declare const __RESUME_VERSION__: string;
```

- [ ] **Step 4: Remove `.vercel` from `.gitignore`**

Delete the `.vercel` line.

- [ ] **Step 5: Confirm nothing references Vercel**

Run:

```bash
grep -rin vercel . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist
```

Expected: no output. `package-lock.json` counts — if it still lists `@vercel/analytics`, Step 1 did not complete.

- [ ] **Step 6: Write `server.mjs`**

```js
/**
 * Static server for the built site with a history fallback, so a hard refresh
 * on /cv serves the app instead of a 404. No dependencies, so the Pi needs
 * nothing but Node.
 */
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.env.STATIC_ROOT ?? "dist");
const port = Number(process.env.PORT ?? 4173);
const host = process.env.HOST ?? "0.0.0.0";

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

async function resolveFile(urlPath) {
  // normalize() collapses any ../ before it can escape the root.
  const candidate = join(root, normalize(urlPath));
  if (!candidate.startsWith(root)) return null;

  try {
    const info = await stat(candidate);
    if (info.isFile()) return candidate;
  } catch {
    // fall through to the SPA fallback
  }
  return null;
}

const server = createServer(async (req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  const file = (await resolveFile(urlPath)) ?? join(root, "index.html");
  const ext = extname(file);

  res.setHeader("Content-Type", types[ext] ?? "application/octet-stream");
  res.setHeader(
    "Cache-Control",
    file.endsWith("index.html")
      ? "no-cache"
      : "public, max-age=31536000, immutable",
  );

  createReadStream(file)
    .on("error", () => {
      res.statusCode = 404;
      res.end("Not found");
    })
    .pipe(res);
});

server.listen(port, host, () => {
  console.log(`serving ${root} on http://${host}:${port}`);
});
```

- [ ] **Step 7: Add the serve script**

In `package.json`, add to `"scripts"`:

```json
    "serve": "node server.mjs",
```

- [ ] **Step 8: Verify the served build**

```bash
npm run build
npm run serve
```

In another terminal:

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/cv
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/robots.txt
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/nope
```

Expected: `200` for all four. `/cv` and `/nope` return `index.html` via the fallback. Also open `http://localhost:4173/cv` in a browser and hard-refresh — the résumé must render, not a 404.

Then stop the server.

- [ ] **Step 9: Write `docs/deploy-pi.md`**

````markdown
# Deploying to the Raspberry Pi

The site is a static Vite build. Nothing in it is host-specific.

## Build

```bash
npm ci
npm run build
```

Output lands in `dist/`. Copy that directory to the Pi, or build on the Pi
directly — the build needs the sibling `../ASCII-blobs` checkout only if you
want to develop against it; the published `ascii-blobs` package is used
otherwise.

## Serve with Node

```bash
npm run serve
```

Listens on `0.0.0.0:4173`. Override with `PORT` and `HOST`; point it at a
different directory with `STATIC_ROOT`.

As a systemd unit at `/etc/systemd/system/portfolio.service`:

```ini
[Unit]
Description=daanhessen.nl
After=network.target

[Service]
WorkingDirectory=/srv/portfolio
ExecStart=/usr/bin/node server.mjs
Environment=PORT=4173
Restart=always
User=daan

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable --now portfolio
```

## Serve with nginx instead

If nginx is already fronting the Pi, skip `server.mjs` and point a site at
`dist/`. The `try_files` line is what makes `/cv` survive a hard refresh:

```nginx
server {
    listen 80;
    server_name daanhessen.nl;
    root /srv/portfolio/dist;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|woff2|png|svg|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Any static host works as long as unknown paths fall back to `index.html`.
Without that rule, `/cv` 404s on refresh.
````

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json vite.config.ts src/vite-env.d.ts .gitignore server.mjs docs/deploy-pi.md
git commit -m "chore(deploy): remove Vercel and add a generic static server for the Pi"
```

---

### Task 9: Cleanup and final verification

**Files:**
- Delete: `public/portrait.png`, `tools/`, `assets/`, `portrait.config.json`
- Modify: `package.json` (drop the `portrait` script)

**Interfaces:**
- Consumes: everything above.
- Produces: nothing.

- [ ] **Step 1: Confirm nothing references the portrait**

Run:

```bash
grep -rin portrait src index.html public --exclude-dir=node_modules
```

Expected: no output. If anything appears, resolve it before deleting.

- [ ] **Step 2: Delete the portrait assets**

```bash
git rm public/portrait.png 2>/dev/null || rm -f public/portrait.png
rm -rf tools assets portrait.config.json
```

`tools/`, `assets/`, and `portrait.config.json` are untracked, so `rm` is correct for them. `assets/portrait-source/` holds ~17 MB of raw JPEGs.

- [ ] **Step 3: Drop the `portrait` npm script**

In `package.json`, delete this line from `"scripts"`:

```json
    "portrait": "node tools/portrait.mjs",
```

- [ ] **Step 4: Confirm the old résumé page is fully gone**

Run:

```bash
grep -rin "resume.html\|__RESUME_VERSION__\|SocialMedia\|useGlobalAnimations" . \
  --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist --exclude-dir=docs
```

Expected: no output.

- [ ] **Step 5: Full verification pass**

```bash
npm run type-check
npm run lint
npm test
npm run build
```

Expected: all clean. Then:

```bash
grep -rin vercel . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=dist --exclude-dir=docs
```

Expected: no output.

- [ ] **Step 6: Final browser check**

```bash
npm run build && npm run serve
```

At `http://localhost:4173`:
- Landing does not scroll; `/cv` does.
- The name is off-white with no glow; the reveal is faster than the old ~0.55 s.
- The blobs look exactly as they did before this work.
- The résumé control is the only colored thing on the landing screen.
- On `/cv`, open the browser print preview: black text on white, A4, no nav bar, no back or download control, project links show their URLs, and entries do not split across page breaks mid-block.
- Resize to a phone width: the ASCII name still fits, the nav links wrap, and the résumé's date gutter stacks above each entry rather than squeezing.

- [ ] **Step 7: Commit**

```bash
git add package.json
git commit -m "chore: drop unused portrait tooling and source images"
```

---

## Self-Review

**Spec coverage**

| Spec section | Task |
| --- | --- |
| Typography — single family | 1 |
| Color tokens, glow removal | 1, 6 |
| Nav redesign, `SocialMedia` deletion, no coffee link | 5 |
| Animation timing 0.22 / 0.03 | 6 |
| CV as React route, `resume.json` into `src/data` | 3, 4 |
| CV layout: gutter, rules, language words not bars | 4 |
| Print stylesheet / download | 4 |
| No access gate; `noindex` + robots + sitemap instead | 7 |
| Hand-rolled router, no dependency | 2 |
| Vercel removal (dep, App, define, vite-env, gitignore) | 6, 8 |
| `server.mjs` + `docs/deploy-pi.md` | 8 |
| Deletions: resume.html, portrait, tools, assets, hook, animations.css | 1, 4, 5, 6, 9 |
| Verification checklist | 6, 8, 9 |

**Type consistency**

- `SiteNav` prop is `onNavigateToResume` in Tasks 5 and 6 — consistent.
- `ResumePage` prop is `onNavigateHome` in Tasks 4 and 6 — consistent.
- `useRoute` returns `{ route, navigate }` in Tasks 2 and 6 — consistent.
- `proficiency` thresholds in Task 3's implementation (`>= 100`, `>= 90`, `>= 55`) satisfy every assertion in its test (100 → native, 95 and 99 → fluent, 60 and 65 → conversational, 30 → basic) and produce native / fluent / conversational for the actual data values 100 / 95 / 65.

**Known ordering hazards**

- Task 1 leaves the site visually broken until Task 6. `HomePage.css` and
  `SocialMedia.css` still reference deleted tokens in between. This is
  expected; do not patch them out of order.
- Task 5, Step 4 deliberately expects a type-check failure — one, in
  `App.tsx`. Task 6 resolves it.
- Vercel removal must not run before Task 5, because `SocialMedia.tsx`
  consumes `__RESUME_VERSION__`. Task 8's position after Task 5 is load-bearing.
