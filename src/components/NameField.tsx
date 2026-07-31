import { useMemo } from "react";
import "./NameField.css";

/**
 * The name as a bright region of the field behind it: block glyphs painted
 * with a screen blend, so the ASCII noise keeps showing through the letters
 * instead of being covered by them. A dim base layer underneath keeps the
 * wordmark legible where the field happens to be empty.
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
const SCALE_X = 2;

function buildLines(): string[] {
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

  // Mono cells are taller than wide, so every column is doubled.
  return rows
    .map((row) => row.flatMap((v) => Array(SCALE_X).fill(v)))
    .map((row) => row.map((v) => (v ? "█" : " ")).join(""));
}

const NameField = () => {
  const lines = useMemo(() => buildLines(), []);

  const layer = (variant: string) => (
    <pre className={`name-glow__layer name-glow__layer--${variant}`}>
      {lines.map((line, index) => (
        <span
          key={index}
          className="name-glow__row"
          style={{ ["--line" as string]: index }}
        >
          {line}
        </span>
      ))}
    </pre>
  );

  return (
    <div className="name-glow" aria-label="Daan Hessen" role="img">
      {layer("base")}
      {layer("light")}
    </div>
  );
};

export default NameField;
