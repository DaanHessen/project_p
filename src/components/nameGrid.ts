/**
 * The wordmark as a bitmap. Shared by the mark itself, which turns it into SVG
 * masks, and by the corona, which needs to know where the letterforms are in
 * order to light the field around them.
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
const LETTER_GAP = 2;
const WORD_GAP = 5;

export const ROWS = 7;

/** Pixels are wider than they are tall, which is what the mono grid gave us. */
export const CELL_W = 1.2;

export function buildGrid(): number[][] {
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

export type Run = { row: number; start: number; end: number };

/** Horizontal runs of set pixels, in grid units. A row is a handful of these,
 *  not seventy separate cells, which keeps both the SVG and the distance field
 *  cheap. */
export function gridRuns(grid: number[][]): Run[] {
  const runs: Run[] = [];

  grid.forEach((row, r) => {
    let start = -1;
    for (let c = 0; c <= row.length; c++) {
      if (row[c] && start === -1) start = c;
      if (!row[c] && start !== -1) {
        runs.push({ row: r, start, end: c });
        start = -1;
      }
    }
  });

  return runs;
}
