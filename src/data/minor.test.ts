import { describe, expect, it } from "vitest";
import { minorData } from "./minor";

describe("minor data integrity", () => {
  it("contains HU metadata", () => {
    expect(minorData.meta.title).toContain("Minor: Future-proof met AI!");
    expect(minorData.meta.institution).toBe("Hogeschool Utrecht");
    expect(minorData.meta.program).toBe("HBO-ICT");
    expect(minorData.meta.student).toBe("Daan Hessen");
  });

  it("covers all 5 official HU learning outcomes from Future-proof met AI! v2.0", () => {
    expect(minorData.leeruitkomsten).toHaveLength(5);
    const ids = minorData.leeruitkomsten.map((lu) => lu.id);
    expect(ids).toEqual(["LU1", "LU2", "LU3", "LU4", "LU5"]);
  });

  it("has 8 sprints covering the 20-week minor structure", () => {
    expect(minorData.sprints).toHaveLength(8);

    const sprint1 = minorData.sprints.find((s) => s.number === 1);
    expect(sprint1).toBeDefined();
    expect(sprint1?.deliverables.length).toBeGreaterThan(0);

    for (const sprint of minorData.sprints) {
      expect(sprint.number).toBeGreaterThan(0);
      expect(sprint.title.length).toBeGreaterThan(0);

      for (const deliv of sprint.deliverables) {
        expect(deliv.id).toBeDefined();
        expect(deliv.leeruitkomsten.length).toBeGreaterThan(0);
        for (const luId of deliv.leeruitkomsten) {
          expect(["LU1", "LU2", "LU3", "LU4", "LU5"]).toContain(luId);
        }
        for (const link of deliv.links) {
          expect(link.label).toBeDefined();
          expect(link.url).toBeDefined();
        }
      }
    }
  });

  it("contains the portfolio website user story required by the minor slides", () => {
    const portfolioStory = minorData.userStories.find((us) => us.id === "US-01");
    expect(portfolioStory).toBeDefined();
    expect(portfolioStory?.status).toBe("Done");
  });
});
