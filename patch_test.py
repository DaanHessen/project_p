import re

with open("src/router.test.ts", "r") as f:
    ts = f.read()

old_fallback = r'''  it("falls back to home for unknown paths", () => {
    expect(routeFromPath("/resume.html")).toBe("home");
    expect(routeFromPath("/nope")).toBe("home");
  });'''

new_fallback = r'''  it("falls back to 404 for unknown paths", () => {
    expect(routeFromPath("/resume.html")).toBe("404");
    expect(routeFromPath("/nope")).toBe("404");
  });'''

ts = ts.replace(old_fallback, new_fallback)

with open("src/router.test.ts", "w") as f:
    f.write(ts)
