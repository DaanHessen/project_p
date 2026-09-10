import { describe, expect, it } from "vitest";
import { routeFromPath } from "./router";

describe("routeFromPath", () => {
  it("maps the root path to home", () => {
    expect(routeFromPath("/")).toBe("home");
  });

  it("maps /cv to the cv route", () => {
    expect(routeFromPath("/cv")).toBe("cv");
  });

  it("ignores a trailing slash on /cv", () => {
    expect(routeFromPath("/cv/")).toBe("cv");
  });

  it("maps /minor to the minor route", () => {
    expect(routeFromPath("/minor")).toBe("minor");
  });

  it("ignores a trailing slash on /minor", () => {
    expect(routeFromPath("/minor/")).toBe("minor");
  });

  it("maps /minor/logboek and /minor/planner to the planner route", () => {
    expect(routeFromPath("/minor/logboek")).toBe("planner");
    expect(routeFromPath("/minor/planner")).toBe("planner");
    expect(routeFromPath("/minor/logboek/")).toBe("planner");
    expect(routeFromPath("/logboek")).toBe("planner");
  });

  it("maps /minor/dagboek and /dagboek to the dagboek route", () => {
    expect(routeFromPath("/minor/dagboek")).toBe("dagboek");
    expect(routeFromPath("/minor/dagboek/")).toBe("dagboek");
    expect(routeFromPath("/dagboek")).toBe("dagboek");
    expect(routeFromPath("/dagboek/")).toBe("dagboek");
  });

  it("falls back to 404 for unknown paths", () => {
    expect(routeFromPath("/resume.html")).toBe("404");
    expect(routeFromPath("/nope")).toBe("404");
  });
});
