import re

with open("src/router.tsx", "r") as f:
    ts = f.read()

old_route = r'''export type Route = "home" | "cv" | "minor" | "planner" | "dagboek";'''
new_route = r'''export type Route = "home" | "cv" | "minor" | "planner" | "dagboek" | "404";'''

ts = ts.replace(old_route, new_route)

old_fallback = r'''  return "home";
}'''
new_fallback = r'''  if (normalised === "" || normalised === "/") return "home";
  return "404";
}'''

ts = ts.replace(old_fallback, new_fallback)

with open("src/router.tsx", "w") as f:
    f.write(ts)
