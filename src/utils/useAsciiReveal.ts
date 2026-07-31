import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Glyphs the name is assembled out of before it resolves. Drawn from the same
 * box-and-block family as the art itself, so the noise reads as the name's own
 * material being shuffled rather than as unrelated characters flying past.
 */
const SCRAMBLE = "█▓▒░╔╗╚╝║═╬╣╠╦╩▄▀▌▐";

/**
 * Fraction of the run the block spends as pure noise before anything resolves.
 * Without it the name starts forming before the eye has registered that there
 * was ever a field to form out of, which is most of the effect.
 */
const NOISE_HOLD = 0.22;
/** How much of the run is spent sweeping left to right, versus per-cell jitter. */
const SWEEP_SHARE = 0.42;
const JITTER_SHARE = 0.26;
/** How long a single cell spends resolving once its turn comes. */
const CELL_FADE = 0.16;

/**
 * When a given cell resolves, as a fraction of the whole run.
 *
 * A pure sweep resolves like a wipe, which is legible but mechanical. Adding
 * per-cell jitter makes the name surface out of the noise in patches instead —
 * the same total duration, but it reads as something developing rather than
 * something being drawn.
 *
 * Exported for testing; `jitter` is the cell's own stable random value.
 */
export function cellStart(
  column: number,
  columns: number,
  jitter: number,
): number {
  const sweep = columns <= 1 ? 0 : (column / (columns - 1)) * SWEEP_SHARE;
  return NOISE_HOLD + sweep + jitter * JITTER_SHARE;
}

/**
 * Resolves an ASCII block out of noise.
 *
 * Returns the lines as they should currently be drawn. Every cell in the
 * bounding box starts as noise — including the ones that end up blank — so the
 * silhouette carves itself out of a solid field.
 */
export default function useAsciiReveal(
  lines: string[],
  durationMs: number,
): string[] {
  const columns = useMemo(
    () => lines.reduce((max, line) => Math.max(max, line.length), 0),
    [lines],
  );

  // One stable jitter per cell, so a cell does not re-roll its turn each frame.
  const jitter = useMemo(
    () =>
      lines.map((line) =>
        Array.from({ length: Math.max(line.length, columns) }, Math.random),
      ),
    [lines, columns],
  );

  const [frame, setFrame] = useState<string[]>(() =>
    lines.map((line) => " ".repeat(line.length)),
  );
  const done = useRef(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFrame(lines);
      done.current = true;
      return;
    }

    const started = performance.now();
    let raf = 0;

    const draw = (now: number) => {
      const elapsed = (now - started) / durationMs;

      const next = lines.map((line, row) => {
        let out = "";
        for (let column = 0; column < line.length; column += 1) {
          const start = cellStart(column, columns, jitter[row][column] ?? 0);
          const progress = (elapsed - start) / CELL_FADE;

          if (progress >= 1) {
            out += line[column];
          } else if (progress <= 0) {
            out += SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0];
          } else {
            // Mid-resolve: increasingly likely to land on the real glyph, so a
            // cell flickers between noise and truth before settling.
            out +=
              Math.random() < progress
                ? line[column]
                : SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0];
          }
        }
        return out;
      });

      setFrame(next);

      if (elapsed >= 1 + CELL_FADE) {
        setFrame(lines);
        done.current = true;
        return;
      }
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [lines, columns, jitter, durationMs]);

  return frame;
}
