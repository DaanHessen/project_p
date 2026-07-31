import { useEffect, useRef } from "react";
import { buildGrid, gridRuns, ROWS } from "./nameGrid";
import "./NameGlow.css";

/**
 * The field's reaction to the name.
 *
 * Blending the wordmark onto the background canvas never worked: whether
 * anything lit up depended on whether a blob happened to be drifting past, and
 * most of the time the answer was no. So the reaction is drawn rather than
 * borrowed — our own characters, on the background's own lattice, in its font
 * and its ink colour, composited with 'lighter'. Where the field already has a
 * character our glyph adds to it and it brightens; where the field is empty
 * ours stands in for it. The interaction is visible either way.
 *
 * The corona is brightest against the letterforms and falls off exponentially,
 * with a pulse of light travelling along the mark.
 */

const FONT_STACK =
  '"JetBrains Mono", "SF Mono", "Menlo", "Consolas", monospace';

/** Ink coverage, light to dense. Every glyph is one the field itself uses. */
const RAMP = [
  ".",
  ":",
  "!",
  "~",
  "+",
  "r",
  "c",
  "z",
  "X",
  "0",
  "q",
  "d",
  "M",
  "8",
  "@",
  "$",
];

/** Padding around the mark, in pixels, for the corona to spill into. */
const PAD = 46;
/** Falloff distance from the letterforms, as a share of the mark's height,
 *  clamped so it is never thinner than a cell nor thicker than a filigree.
 *  Fixed pixels would swamp the phone-sized mark and vanish on the desktop
 *  one. */
const REACH_RATIO = 0.24;
const REACH_MAX = 18;
/** Width of the travelling pulse, as a share of the mark, and how long it
 *  takes to cross. */
const PULSE_RATIO = 0.24;
const PERIOD = 7;
/** Brightness with no pulse over it — the corona never goes fully dark. */
const FLOOR = 0.42;
const FRAME_MS = 1000 / 30;

type Cell = { x: number; y: number; distance: number; seed: number };

/** Hash to one stable value per cell, so the twinkle is per-character rather
 *  than a single field-wide throb. */
function hash(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

interface NameGlowProps {
  /** Edge of one background cell, in CSS pixels. Matching this is what makes
   *  the corona land on the field's own grid instead of beside it. */
  cellPx: number;
}

const NameGlow = ({ cellPx }: NameGlowProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const grid = buildGrid();
    const runs = gridRuns(grid);
    const columns = grid[0].length;

    let cells: Cell[] = [];
    let width = 0;
    let height = 0;
    let reach = REACH_MAX;
    let frame = 0;
    let lastDraw = 0;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.textAlign = "center";
      context.textBaseline = "alphabetic";
      context.font = `${Math.round(cellPx * 0.86)}px ${FONT_STACK}`;

      // The mark occupies the box inside the padding; one grid pixel is this
      // wide and this tall.
      const markW = width - PAD * 2;
      const markH = height - PAD * 2;
      const cw = markW / columns;
      const ch = markH / ROWS;
      reach = Math.min(REACH_MAX, Math.max(cellPx * 0.9, markH * REACH_RATIO));

      // Start the corona on the background's lattice: its cells are laid from
      // the viewport origin, so ours have to be too.
      const first = Math.floor(rect.left / cellPx);
      const firstRow = Math.floor(rect.top / cellPx);

      cells = [];
      for (let k = first; k * cellPx - rect.left < width; k++) {
        const x = k * cellPx - rect.left;
        for (let j = firstRow; j * cellPx - rect.top < height; j++) {
          const y = j * cellPx - rect.top;
          // Centre of the cell, in mark-local coordinates.
          const mx = x + cellPx / 2 - PAD;
          const my = y + cellPx / 2 - PAD;

          let best = Infinity;
          for (const run of runs) {
            const dx = Math.max(run.start * cw - mx, 0, mx - run.end * cw);
            const dy = Math.max(run.row * ch - my, 0, my - (run.row + 1) * ch);
            const d = dx === 0 && dy === 0 ? 0 : Math.hypot(dx, dy);
            if (d < best) best = d;
            if (best === 0) break;
          }

          if (best === 0 || best > reach * 2.6) continue;
          cells.push({ x, y, distance: best, seed: hash(k, j) });
        }
      }
    };

    const draw = (time: number) => {
      const seconds = time / 1000;
      // A quarter of the mark, so the pulse is the same gesture at any size.
      const span = Math.max(110, width * PULSE_RATIO);
      const head = ((seconds % PERIOD) / PERIOD) * (width + span * 2) - span;
      const still = reduced.matches;

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      for (const cell of cells) {
        const falloff = Math.exp(-cell.distance / reach);
        const offset = cell.x + cellPx / 2 - head;
        const pulse = still
          ? 0.8
          : FLOOR + (1 - FLOOR) * Math.exp(-(offset * offset) / (2 * span * span));
        const twinkle = still
          ? 1
          : 0.84 + 0.16 * Math.sin(seconds * 1.6 + cell.seed * Math.PI * 2);

        // The seed thins the corona out unevenly, so it reads as field rather
        // than as an outline traced around the letters.
        const intensity = falloff * pulse * twinkle * (0.3 + 0.7 * cell.seed);
        if (intensity < 0.17) continue;

        // Weighted towards the light end of the ramp: only cells right against
        // a letterform earn a dense glyph.
        const step = Math.min(
          RAMP.length - 1,
          Math.floor(Math.pow(intensity, 1.5) * RAMP.length * 1.3),
        );
        // Ink at the dim end, white at the core, so the corona resolves into
        // the field rather than sitting on it as a separate colour.
        const lift = Math.min(1, intensity * 1.4);
        const r = Math.round(150 + 105 * lift);
        const g = Math.round(158 + 97 * lift);
        const b = Math.round(172 + 83 * lift);
        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(1, intensity).toFixed(3)})`;
        context.fillText(
          RAMP[step],
          cell.x + cellPx / 2,
          cell.y + cellPx * 0.54,
        );
      }
    };

    const loop = (time: number) => {
      frame = requestAnimationFrame(loop);
      if (time - lastDraw < FRAME_MS) return;
      lastDraw = time;
      draw(time);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (reduced.matches) {
        draw(0);
        return;
      }
      frame = requestAnimationFrame(loop);
    };

    const restart = () => {
      measure();
      start();
    };

    restart();

    const observer = new ResizeObserver(restart);
    observer.observe(canvas);
    reduced.addEventListener("change", restart);
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(frame);
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      reduced.removeEventListener("change", restart);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [cellPx]);

  return (
    <canvas
      ref={canvasRef}
      className="name-mark__glow"
      aria-hidden="true"
      style={{ ["--pad" as string]: `${PAD}px` }}
    />
  );
};

export default NameGlow;
