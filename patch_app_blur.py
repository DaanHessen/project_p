import re

with open("src/App.tsx", "r") as f:
    ts = f.read()

# Replace the variables
old_vars = r'''  const isHome = route === "home" \|\| route === "404";

  return \(
    <div className=\{`app \$\{isHome \? "app--locked" : "app--flow"\}`\}\>
      \{\/\*
        Persistent ASCII background that remains running seamlessly across route transitions.
        On non-home pages, it animates with a strong soft blur and low opacity.
      \*\/\}
      <div
        className=\{`app-ascii-bg \$\{\!isHome \? "app-ascii-bg--blurred" : ""\}`\}'''

new_vars = r'''  const isHome = route === "home";
  const isLocked = route === "home" || route === "404";
  const isBlurred = route !== "home";

  return (
    <div className={`app ${isLocked ? "app--locked" : "app--flow"}`}>
      {/*
        Persistent ASCII background that remains running seamlessly across route transitions.
        On non-home pages, it animates with a strong soft blur and low opacity.
      */}
      <div
        className={`app-ascii-bg ${isBlurred ? "app-ascii-bg--blurred" : ""}`}'''

ts = re.sub(old_vars, new_vars, ts)

with open("src/App.tsx", "w") as f:
    f.write(ts)
