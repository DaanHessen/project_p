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

  it("falls back to home for unknown paths", () => {
    expect(routeFromPath("/resume.html")).toBe("home");
    expect(routeFromPath("/nope")).toBe("home");
  });
});
