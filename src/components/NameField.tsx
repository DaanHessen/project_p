import type React from "react";
import { useMemo } from "react";
import NameGlow from "./NameGlow";
import { buildGrid, CELL_W } from "./nameGrid";
import "./NameField.css";

/**
 * The name is solid white and stays that way. What moves is the field around
 * it: NameGlow draws a corona of ASCII on the background's own lattice, which
 * brightens against the letterforms and pulses along the mark. The letters
 * themselves never fade, and nothing here is translucent.
 */

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

interface NameFieldProps {
  /** Edge of one background cell, in CSS pixels, so the corona can share the
   *  field's grid. */
  cellPx: number;
}

const NameField = ({ cellPx }: NameFieldProps) => {
  const { masks, ratio } = useMemo(() => {
    const grid = buildGrid();
    return {
      masks: grid.map(rowMask),
      ratio: (grid[0].length * CELL_W).toFixed(3),
    };
  }, []);

  return (
    <div
      className="name-mark"
      aria-label="Daan Hessen"
      role="img"
      style={{ ["--row-ratio" as string]: ratio }}
    >
      <NameGlow cellPx={cellPx} />
      <div className="name-mark__halo">
        <div className="name-mark__layer">
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
      </div>
    </div>
  );
};

export default NameField;
