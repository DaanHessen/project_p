import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/*
  Regenerates the two favicon source plates. Not part of the build — the
  committed PNGs in public/ are the artefacts, and this is here so they can be
  reproduced or adjusted rather than re-drawn from memory.

    npx playwright install chromium     # once
    node scripts/generate-favicon.mjs   # writes build/favicon/src-*.png

  Then, with ImageMagick:

    magick build/favicon/src-small.png -resize 16x16 /tmp/i16.png
    magick build/favicon/src-small.png -resize 32x32 /tmp/i32.png
    magick build/favicon/src-large.png -resize 48x48 /tmp/i48.png
    magick /tmp/i16.png /tmp/i32.png /tmp/i48.png public/favicon.ico
    magick build/favicon/src-large.png -resize 96x96   public/favicon-96.png
    magick build/favicon/src-large.png -resize 180x180 public/apple-touch-icon.png
    magick build/favicon/src-large.png -resize 192x192 public/icon-192.png
    magick build/favicon/src-large.png -resize 512x512 public/icon-512.png
*/

const OUT = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "build",
  "favicon",
);
mkdirSync(OUT, { recursive: true });

/*
  The site's D over the ASCII field, as an icon.

  The wordmark's D is a 5x7 bitmap (src/components/nameGrid.ts) whose bowl
  meets its bars corner-to-corner. Across "DAAN HESSEN" the eye closes that
  staircase; alone at 32px it does not — the right stem reads as a bar
  floating beside a bracket. So this keeps the bitmap's proportions (same 5x7
  box, same stem widths, same squared counter) and draws them as one chamfered
  path, with `evenodd` making the counter a real hole so the field shows
  through it.

  Two variants, because one artwork cannot serve 512px and 16px. The small one
  gives the letter more of the tile and thickens its stems, and thins the
  field out, since at 16px a dense texture is just grey.
*/

const S = 512;

// Seeded: a favicon that changes every build is one nobody can diff.
function makeRng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const CHARS = "01/\\|+-*=<>[]{}#$%&?!:;.,~^_abcdefghijklmnopqrstuvwxyz";
const esc = (c) =>
  c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c;

function svg({ cell, glyph, gap, minOpacity, maxOpacity, fontSize }) {
  const rnd = makeRng(20260801);

  const W = 5 * cell;
  const H = 7 * cell;
  const OX = (S - W) / 2;
  const OY = (S - H) / 2;

  const cols = Math.ceil(S / glyph);
  const rows = Math.ceil(S / (glyph * 1.15));

  let ascii = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rnd() < gap) continue;
      const ch = CHARS[Math.floor(rnd() * CHARS.length)];
      const o = (minOpacity + rnd() * (maxOpacity - minOpacity)).toFixed(3);
      ascii +=
        `<text x="${c * glyph + glyph * 0.12}" ` +
        `y="${r * glyph * 1.15 + glyph}" opacity="${o}">${esc(ch)}</text>`;
    }
  }

  const px = (x, y) =>
    `${(OX + x * cell).toFixed(1)} ${(OY + y * cell).toFixed(1)}`;

  const outer =
    `M ${px(0, 0)} L ${px(3.4, 0)} L ${px(5, 1.6)} L ${px(5, 5.4)} ` +
    `L ${px(3.4, 7)} L ${px(0, 7)} Z`;
  const counter =
    `M ${px(1, 1)} L ${px(3, 1)} L ${px(4, 2)} L ${px(4, 5)} ` +
    `L ${px(3, 6)} L ${px(1, 6)} Z`;

  return `<!doctype html><meta charset="utf-8">
<style>
  html,body{margin:0;padding:0;background:transparent}
  svg{display:block}
  text{font-family:"DejaVu Sans Mono","JetBrains Mono",monospace;
       font-size:${fontSize}px;fill:#c4cbd6}
</style>
<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <rect width="${S}" height="${S}" fill="#07080b"/>
  <g>${ascii}</g>
  <path fill="#ffffff" fill-rule="evenodd" d="${outer} ${counter}"/>
</svg>`;
}

const LARGE = svg({
  cell: 50,
  glyph: 26,
  gap: 0.28,
  minOpacity: 0.1,
  maxOpacity: 0.44,
  fontSize: 22,
});

// Bigger letter, sparser and brighter field — both survive the downscale.
const SMALL = svg({
  cell: 62,
  glyph: 52,
  gap: 0.42,
  minOpacity: 0.16,
  maxOpacity: 0.5,
  fontSize: 44,
});

writeFileSync(`${OUT}/favicon-large.html`, LARGE);
writeFileSync(`${OUT}/favicon-small.html`, SMALL);

const browser = await chromium.launch();
for (const [name] of [["large"], ["small"]]) {
  const page = await browser.newPage({
    viewport: { width: S, height: S },
    deviceScaleFactor: 1,
  });
  await page.goto(`file://${OUT}/favicon-${name}.html`);
  await page.waitForTimeout(300);
  await page.locator("svg").screenshot({ path: `${OUT}/src-${name}.png` });
  await page.close();
}
await browser.close();
console.log("wrote src-large.png, src-small.png");
