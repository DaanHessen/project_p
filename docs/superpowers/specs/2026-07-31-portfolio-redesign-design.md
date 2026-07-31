# Portfolio Redesign — Navigation, CV, Layout, Hosting Migration

Date: 2026-07-31
Status: approved

## Goal

Replace the site's navigation and résumé presentation, tighten the overall
layout into one deliberate composition, and remove Vercel so the build can be
served from a Raspberry Pi.

## Constraints (fixed, not up for redesign)

- The "DAAN HESSEN" ASCII name text stays. Its content and the per-line reveal
  mechanic stay; only the timing constants change.
- The ASCII-blobs background stays exactly as rendered today. No prop changes,
  no theme changes, no wrapper changes.
- The name's *color* may change. The blobs' colors may not.
- The site stays a single locked screen — `overflow: hidden`, no page scroll on
  the landing route.

## Current state

| Concern | Today |
| --- | --- |
| Nav | `src/components/SocialMedia.tsx` (234 lines) + `SocialMedia.css` (316 lines). Fixed bottom bar, 7 inline SVG icons, no text labels. Tooltips positioned by hand with `left: calc((100% / 7) * i + …)`. Custom `requestAnimationFrame` marquee for mobile. |
| Dead code | `src/components/SiteNav.tsx` — untracked, unused, imports a `SiteNav.css` that does not exist. |
| CV | `public/resume.html`, 1176 lines. Standalone static page, vanilla JS `fetch('/resume.json')`, DOM built by string concatenation. "Download PDF" = `window.print()` with no print stylesheet. |
| CV data | `public/resume.json`. `personal` contains only `position` and `about`. The HTML header markup still expects `email` / `phone` / `dob` / `address`, so that block renders empty. |
| Vercel | `@vercel/analytics` dependency; `<Analytics/>` in `App.tsx` behind an idle-load effect; `VERCEL_GIT_COMMIT_SHA` in `vite.config.ts` feeding `__RESUME_VERSION__`; `.vercel` in `.gitignore`. No `vercel.json`. |
| Unused assets | `public/portrait.png`, `tools/portrait.mjs`, `tools/build_portrait.py`, `tools/__pycache__/`, `assets/portrait-source/` (~17 MB of raw JPEGs), `portrait.config.json`, `portrait` npm script. |
| Dead animation code | `src/utils/useGlobalAnimations.ts` is consumed only by an empty `<motion.div className="hero-section">` in `HomePage.tsx` that renders no children. `src/animations.css` contains a `prefers-reduced-motion` block already duplicated verbatim in `globals.css`. |
| Stale SEO | `sitemap.xml` lists `https://daanhessen.nl/resume.html?v=0.0.0`. `og-image.jpg` is referenced from `index.html`, `SEOHead.tsx`, and `HomePage.tsx`, but no such file exists in `public/`. |

## Design system

### Typography

One family: **JetBrains Mono**, weights 400 / 500 / 600, already loaded from
Google Fonts.

Removed: Lora, Space Grotesk (Google), and the four `SF Pixelate` `@font-face`
blocks pointing at `fonts.cdnfonts.com`. Net effect: two fewer Google Fonts
requests and one fewer third-party CDN dependency.

### Color

The blobs' `slate` theme defines `--ascii-ink: rgb(196, 203, 214)`,
`--ascii-ink-shadow: rgb(44, 51, 64)`, `--ascii-bg: #07080b`. The site aligns to
that field instead of fighting it.

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#07080b` | Page background — matches the blobs' own background exactly. |
| `--fg` | `#e8ebf0` | Name, headings. Brighter than the blob ink so it reads as foreground. |
| `--fg-muted` | `#9aa3b2` | Body copy, link labels. |
| `--fg-faint` | `#5a6472` | Rules, meta, the version badge. |
| `--accent` | `#d9a441` | **Reserved for the résumé control only.** Nothing else on the site is colored. |

The blue text-shadow glow on `.ascii-text` is removed — it is the single most
dating detail in the current design. Hierarchy comes from brightness and weight.

The old palette (six accent colors, five shadow tokens, four gradient tokens,
most unused) is deleted from `globals.css`, not merely overridden.

## 1. Navigation

The bottom bar is deleted outright, not restyled. Navigation becomes part of the
centered type composition rather than floating chrome:

```
              ██████╗  █████╗  █████╗ ███╗   ██╗   …
              DAAN HESSEN

              software developer · utrecht

              ┌──────────────────┐
              │  résumé       →  │   ← the only colored element
              └──────────────────┘

              github  linkedin  x  email  ↗
```

- New `src/components/SiteNav.tsx` (replacing the dead stub) plus
  `SiteNav.css`. Semantic `<nav>` → `<ul>` → `<li>` → `<a>`.
- Real text labels. No icons, therefore no tooltips, therefore no hand-computed
  positioning and no marquee.
- The résumé link is visually distinct — the one control with a job to do.
  External links are a single quiet row beneath it.
- Hover and focus are a brightness shift plus the existing global
  `:focus-visible` outline. No transforms, no glows.
- `SocialMedia.tsx` and `SocialMedia.css` are deleted.
- The buymeacoffee link is dropped: a tip jar next to a résumé CTA on a
  job-seeking portfolio works against the CTA.

## 2. Landing animation

In `HomePage.tsx`, the per-line reveal changes only its constants:

- `duration: 0.3` → `0.22`
- `delay: index * 0.05` → `index * 0.03`

Six lines, so total reveal goes from ~0.55 s to ~0.37 s. The easing curve,
the `y: 12` offset, and the stagger structure are unchanged.

## 3. CV

### Delivery

A React route at `/cv`, rendered by `src/pages/ResumePage.tsx`.

- `resume.json` moves from `public/` to `src/data/resume.json` and is imported,
  not fetched — typed at build time, no runtime request, no loading state.
- A `src/data/resume.ts` module declares the TypeScript types for the shape.
- `public/resume.html` is deleted.

### Layout

- Date and location in a left gutter; role, institution, and description in the
  right column.
- Hairline `1px` rules between sections. No cards, no boxes, no shadows.
- Languages render as `Dutch — native`, `English — fluent`,
  `German — conversational`. The numeric `level` percentages and their progress
  bars are dropped: a 65 %-full bar next to "German" is decoration, not
  information. The `level` values stay in the JSON but go unrendered.
- The `skills` array is empty and stays unrendered.
- Projects list name, description, and their links inline.
- Unlike the landing route, `/cv` scrolls — the locked-screen constraint applies
  to the landing composition only.

### Download

`@media print` stylesheet: black on white, `@page { size: A4; margin: 18mm }`,
nav and the download control hidden, links printed with their URLs where useful.
The existing "Download PDF" button keeps calling `window.print()`, which now
produces a clean A4 document via the browser's Save-as-PDF.

No PDF is committed and no headless-browser build step is added; both drift
from or complicate the single source of truth in `resume.json`.

### Access control — decision: no gate

`resume.json` carries no personally identifying information. `personal` holds
only `position` and `about`; email, phone, date of birth, and address were
already stripped (the old HTML still contains markup expecting them, which is
why that header renders half-empty today). What remains — employers, education,
projects — is already public on the linked LinkedIn and GitHub profiles.

A password gate would:

- block the exact audience the CV exists to reach,
- require distributing a shared secret to every recruiter,
- and provide no actual protection, since on a static site the data reaches the
  browser regardless of what the UI asks for first.

If the underlying concern is search engines rather than people, the honest fix
is applied instead:

- `SEOHead` gains a `noindex?: boolean` prop that emits
  `<meta name="robots" content="noindex, follow" />`; `ResumePage` passes it.
- `robots.txt` gains `Disallow: /cv`.
- The stale `/resume.html?v=0.0.0` entry is removed from `sitemap.xml` and is
  not replaced by a `/cv` entry — a noindexed route does not belong in a
  sitemap. The sitemap keeps only `https://daanhessen.nl/`.

## 4. Routing

Hand-rolled, no dependency. `src/router.tsx` exposes a `useRoute()` hook over
`window.location.pathname`:

- Reads the initial path, listens for `popstate`.
- A `navigate(path)` helper calls `history.pushState` and updates state.
- `SiteNav`'s résumé link is an ordinary `<a href="/cv">` with an `onClick` that
  calls `navigate` and prevents default, so middle-click and "open in new tab"
  keep working.
- Two routes: `/` → `HomePage`, `/cv` → `ResumePage`. Anything else falls back
  to `HomePage`.

React Router is not added for two routes. Hash routing is not used because
`/cv` is a URL that gets pasted into applications.

## 5. Hosting migration

### Removed

| Item | Location |
| --- | --- |
| `@vercel/analytics` dependency | `package.json` |
| `<Analytics/>` and its idle-load `useState` / `useEffect` | `src/App.tsx` |
| `VERCEL_GIT_COMMIT_SHA` and the `__RESUME_VERSION__` define | `vite.config.ts` |
| `__RESUME_VERSION__` declaration | `src/vite-env.d.ts` |
| `.vercel` | `.gitignore` |

`__RESUME_VERSION__` existed to cache-bust `/resume.html?v=…`. Once `resume.json`
is bundled through Vite, hashed asset filenames handle that, so the define, its
consumers, and its type declaration all go.

No `vercel.json` exists to remove.

### Added

- `server.mjs` — a dependency-free Node static file server over `dist/`, with
  an SPA history fallback to `index.html` and correct MIME types. Run with
  `npm run serve`.
- `docs/deploy-pi.md` — build and run steps, plus an nginx `try_files` snippet
  for anyone fronting it with a real web server.

The Vite build output remains a plain static `dist/`, servable by anything.

## 6. Deletions

`public/resume.html`, `src/components/SocialMedia.tsx`,
`src/components/SocialMedia.css`, the `SiteNav.tsx` stub (replaced),
`public/portrait.png`, `tools/`, `assets/`, `portrait.config.json`, and the
`portrait` npm script.

`tools/__pycache__/` and `assets/portrait-source/` are untracked, so removing
them is a filesystem delete rather than a git operation.

Also removed: `src/utils/useGlobalAnimations.ts` and the empty
`<motion.div className="hero-section">` it feeds, along with the now-unused
`.hero-section` rules in `HomePage.css`. `src/animations.css` is deleted and its
import dropped from `main.tsx`; its `prefers-reduced-motion` block already
exists verbatim in `globals.css`.

With the hook gone, `framer-motion` is used only by the ASCII name reveal. It
stays — the reveal is an explicit constraint — and so does its `manualChunks`
entry in `vite.config.ts`.

## Out of scope (flagged, not fixed)

`og-image.jpg` is referenced by `index.html`, `SEOHead.tsx`, and
`HomePage.tsx`, but the file does not exist in `public/`, so link previews on
LinkedIn, X, and WhatsApp currently resolve a 404. Producing a real 1200×630
open-graph image is a separate task. This redesign leaves the references as they
are rather than silently dropping social previews.

## Verification

- `npm run type-check` and `npm run lint` pass.
- `npm run build` succeeds and `dist/` contains no reference to `vercel`.
- `npm run serve` serves `/` and `/cv`; a hard refresh on `/cv` returns the app
  rather than a 404.
- `grep -ri vercel` over the repo excluding `node_modules` and `.git` returns
  nothing.
- The landing route does not scroll; `/cv` does.
- Keyboard tab order through the nav is name → résumé → external links, with a
  visible focus ring at each stop.
- The browser print preview of `/cv` shows black-on-white A4 with no nav.
- `grep -r resume.html` over the repo excluding `node_modules` and `.git`
  returns nothing.
- `/cv` serves a `noindex` robots meta tag; `robots.txt` disallows `/cv`;
  `sitemap.xml` lists exactly one URL.
