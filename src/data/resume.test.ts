import { describe, expect, it } from "vitest";
import { proficiency, resume } from "./resume";

describe("proficiency", () => {
  it("calls a full score native", () => {
    expect(proficiency(100)).toBe("native");
  });

  it("calls a high score fluent", () => {
    expect(proficiency(95)).toBe("fluent");
    expect(proficiency(99)).toBe("fluent");
  });

  it("calls a mid score conversational", () => {
    expect(proficiency(65)).toBe("conversational");
    expect(proficiency(60)).toBe("conversational");
  });

  it("calls a low score basic", () => {
    expect(proficiency(30)).toBe("basic");
  });
});

describe("resume data", () => {
  it("carries no sensitive contact details", () => {
    // The no-gate decision in the spec rests on this staying true. Email is
    // deliberately present — a CV nobody can reply to is useless, and the same
    // address is already a mailto link in the site nav. Phone, date of birth
    // and home address are the ones that would change the calculus.
    const personal = resume.personal as Record<string, unknown>;
    expect(personal.phone).toBeUndefined();
    expect(personal.dob).toBeUndefined();
    expect(personal.address).toBeUndefined();
  });

  it("has a reachable email", () => {
    expect(resume.personal.email).toContain("@");
  });

  it("has entries to render", () => {
    expect(resume.experience.length).toBeGreaterThan(0);
    expect(resume.education.length).toBeGreaterThan(0);
    expect(resume.projects.length).toBeGreaterThan(0);
    expect(resume.languages.length).toBeGreaterThan(0);
  });
});
