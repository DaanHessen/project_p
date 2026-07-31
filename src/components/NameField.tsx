import type React from "react";
import { useMemo } from "react";
import "./NameField.css";

/**
 * The name as a bright region of the field behind it: the letterforms are cut
 * out as a mask, a dim base keeps them legible over an empty patch of field,
 * and a screen-blend layer lifts whatever ASCII sits behind them.
 *
 * The mark is geometry, not text. Block characters (U+2588) are absent from
 * the JetBrains Mono subsets Google serves, so they fall back to whatever the
 * platform picks — a face whose advance width is 0.6em on this desktop and is
 * not on Android, which tore the grid apart. Rectangles have no metrics to
 * disagree about.
 */

const GLYPHS: Record<string, string[]> = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  N: ["10001", "11001", "11001", "10101", "10011", "10011", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
};

const TEXT = "DAAN HESSEN";
const ROWS = 7;
const LETTER_GAP = 2;
const WORD_GAP = 5;

/** Pixels are wider than they are tall, which is what the mono grid gave us. */
const CELL_W = 1.2;

function buildGrid(): number[][] {
  const rows: number[][] = Array.from({ length: ROWS }, () => []);
  const push = (row: number, value: number, times: number) => {
    for (let i = 0; i < times; i++) rows[row].push(value);
  };

  [...TEXT].forEach((char, index) => {
    if (index > 0 && char !== " " && TEXT[index - 1] !== " ") {
      for (let r = 0; r < ROWS; r++) push(r, 0, LETTER_GAP);
    }
    if (char === " ") {
      for (let r = 0; r < ROWS; r++) push(r, 0, WORD_GAP);
      return;
    }
    const glyph = GLYPHS[char];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < 5; c++) push(r, Number(glyph[r][c]), 1);
    }
  });

  return rows;
}

/** One SVG per row, so the rows can still stagger in independently. */
function rowMask(row: number[]): string {
  const width = row.length * CELL_W;
  const rects: string[] = [];

  let start = -1;
  for (let c = 0; c <= row.length; c++) {
    if (row[c] && start === -1) start = c;
    if (!row[c] && start !== -1) {
      // Runs are merged so a row is a handful of rects, not seventy.
      rects.push(
        `<rect x="${(start * CELL_W).toFixed(2)}" y="0" width="${(
          (c - start) * CELL_W
        ).toFixed(2)}" height="1"/>`,
      );
      start = -1;
    }
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width.toFixed(2)} 1"` +
    ` preserveAspectRatio="none" fill="#fff">${rects.join("")}</svg>`;

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const NameField = () => {
  const { masks, ratio } = useMemo(() => {
    const grid = buildGrid();
    return {
      masks: grid.map(rowMask),
      ratio: (grid[0].length * CELL_W).toFixed(3),
    };
  }, []);

  const layer = (variant: string) => (
    <div className={`name-mark__layer name-mark__layer--${variant}`}>
      {masks.map((mask, index) => (
        <div
          key={index}
          className="name-mark__row"
          style={
            {
              "--mask": mask,
              "--line": index,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );

  return (
    <div
      className="name-mark"
      aria-label="Daan Hessen"
      role="img"
      style={{ ["--row-ratio" as string]: ratio }}
    >
      <div className="name-mark__halo">{layer("base")}</div>
      {layer("light")}
    </div>
  );
};

export default NameField;
