import { describe, it, expect } from "vitest";
import { APP_VERSION } from "./version";
import packageJson from "../package.json";

describe("version", () => {
  it("exports a valid semantic version string", () => {
    expect(APP_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("matches package.json version", () => {
    expect(APP_VERSION).toBe(packageJson.version);
  });
});
