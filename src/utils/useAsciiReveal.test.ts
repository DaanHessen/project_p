import { describe, expect, it } from "vitest";
import { cellStart } from "./useAsciiReveal";

describe("cellStart", () => {
  it("holds every cell as noise before the first one resolves", () => {
    expect(cellStart(0, 88, 0)).toBeGreaterThan(0.15);
  });

  it("sweeps later for columns further right", () => {
    expect(cellStart(80, 88, 0)).toBeGreaterThan(cellStart(10, 88, 0));
  });

  it("keeps every cell inside the run", () => {
    // Worst case: last column, maximum jitter. Must still leave room for the
    // cell's own fade, or the name never finishes resolving.
    expect(cellStart(87, 88, 1)).toBeLessThanOrEqual(1);
  });

  it("does not divide by zero on a single column", () => {
    expect(cellStart(0, 1, 0)).toBe(0);
  });
});
