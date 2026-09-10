import { useEffect, useState } from "react";

export type Theme = "dark" | "light";

export function getInitialTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  const match = document.cookie.match(/(?:^|; )theme=([^;]*)/);
  if (match) {
    return match[1] === "light" ? "light" : "dark";
  }
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }
  return "dark";
}

export function useThemeContext() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    document.cookie = `theme=${theme}; path=/; max-age=31536000`; // 1 year
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, toggleTheme };
}
