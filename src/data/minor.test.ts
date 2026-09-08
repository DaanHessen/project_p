import { describe, expect, it } from "vitest";
import { minorData } from "./minor";

describe("minor data integrity", () => {
  it("contains HU metadata", () => {
    expect(minorData.meta.title).toContain("Minor: Future-proof met AI!");
    expect(minorData.meta.institution).toBe("Hogeschool Utrecht");
    expect(minorData.meta.program).toBe("HBO-ICT");
    expect(minorData.meta.student).toBe("Daan Hessen");
  });

  it("covers all 3 official HU learning outcomes", () => {
    expect(minorData.leeruitkomsten).toHaveLength(3);
    const ids = minorData.leeruitkomsten.map((lu) => lu.id);
    expect(ids).toEqual(["LU1", "LU2", "LU3"]);
  });

  it("has sprints with deliverables and valid learning outcomes mapped", () => {
    expect(minorData.sprints.length).toBeGreaterThanOrEqual(5);

    for (const sprint of minorData.sprints) {
      expect(sprint.number).toBeGreaterThan(0);
      expect(sprint.title.length).toBeGreaterThan(0);
      expect(sprint.deliverables.length).toBeGreaterThan(0);

      for (const deliv of sprint.deliverables) {
        expect(deliv.id).toBeDefined();
        expect(deliv.leeruitkomsten.length).toBeGreaterThan(0);
        for (const luId of deliv.leeruitkomsten) {
          expect(["LU1", "LU2", "LU3"]).toContain(luId);
        }
        for (const link of deliv.links) {
          expect(link.label).toBeDefined();
          expect(link.url).toBeDefined();
          expect([
            "onedrive",
            "youtube",
            "github",
            "doc",
            "demo",
            "canvas",
            "other",
          ]).toContain(link.type);
        }
      }
    }
  });

  it("contains the portfolio website user story required by the minor slides", () => {
    const portfolioStory = minorData.userStories.find((us) => us.id === "US-01");
    expect(portfolioStory).toBeDefined();
    expect(portfolioStory?.status).toBe("Done");
    expect(portfolioStory?.acceptanceCriteria.length).toBeGreaterThan(0);
  });
});
