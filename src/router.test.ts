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

  it("falls back to home for unknown paths", () => {
    expect(routeFromPath("/resume.html")).toBe("home");
    expect(routeFromPath("/nope")).toBe("home");
  });
});
