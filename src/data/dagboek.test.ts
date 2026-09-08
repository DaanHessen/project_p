import { describe, expect, it } from "vitest";
import {
  QUOTES,
  calculateStreak,
  formatDutchDate,
  formatDayRelative,
  getDailyQuote,
  hasEntryContent,
} from "./dagboek";

describe("dagboek data and helpers", () => {
  it("contains all 13 quotes from the minor assignment", () => {
    expect(QUOTES).toHaveLength(13);
    for (const q of QUOTES) {
      expect(q.spreuk.length).toBeGreaterThan(0);
      expect(q.auteur.length).toBeGreaterThan(0);
      expect(q.thema.length).toBeGreaterThan(0);
    }
  });

  it("produces deterministic daily quote and rotates with offset", () => {
    const q1 = getDailyQuote("2026-09-08", 0);
    const q2 = getDailyQuote("2026-09-08", 0);
    const qOffset = getDailyQuote("2026-09-08", 1);

    expect(q1.spreuk).toBe(q2.spreuk);
    expect(qOffset).toBeDefined();
  });

  it("detects whether an entry has content", () => {
    expect(
      hasEntryContent({
        date: "2026-09-08",
        mood: 0,
        yesterday_done: "",
        yesterday_learned: "",
        today_planned: "",
      })
    ).toBe(false);

    expect(
      hasEntryContent({
        date: "2026-09-08",
        mood: 4,
        yesterday_done: "",
        yesterday_learned: "",
        today_planned: "",
      })
    ).toBe(true);

    expect(
      hasEntryContent({
        date: "2026-09-08",
        mood: 0,
        yesterday_done: "Code geschreven",
        yesterday_learned: "",
        today_planned: "",
      })
    ).toBe(true);
  });

  it("calculates streak correctly", () => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    const entries = {
      [today]: {
        date: today,
        mood: 4,
        yesterday_done: "Done",
        yesterday_learned: "Learned",
        today_planned: "Plan",
      },
      [yesterday]: {
        date: yesterday,
        mood: 5,
        yesterday_done: "Done",
        yesterday_learned: "Learned",
        today_planned: "Plan",
      },
    };

    expect(calculateStreak(entries)).toBe(2);
  });

  it("formats dates in Dutch", () => {
    const formatted = formatDutchDate("2026-09-08");
    expect(formatted.toLowerCase()).toContain("september");
    expect(formatted).toContain("2026");
  });

  it("formats relative days (vandaag, gisteren, eergisteren)", () => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const dayBefore = new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0];

    expect(formatDayRelative(today)).toBe("vandaag");
    expect(formatDayRelative(yesterday)).toBe("gisteren");
    expect(formatDayRelative(dayBefore)).toBe("eergisteren");
  });
});
