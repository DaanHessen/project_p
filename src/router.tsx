import { useCallback, useEffect, useState } from "react";

export type Route = "home" | "cv";

/**
 * Two routes and a fallback. Kept as a pure function so it can be tested
 * without a DOM, and so `useRoute` has nothing to decide at call time.
 */
export function routeFromPath(pathname: string): Route {
  const normalised = pathname.replace(/\/+$/, "");
  return normalised === "/cv" ? "cv" : "home";
}

function currentPath(): string {
  return typeof window === "undefined" ? "/" : window.location.pathname;
}

export function useRoute(): {
  route: Route;
  navigate: (path: string) => void;
} {
  const [route, setRoute] = useState<Route>(() => routeFromPath(currentPath()));

  useEffect(() => {
    const onPopState = () => setRoute(routeFromPath(currentPath()));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = useCallback((path: string) => {
    if (path !== window.location.pathname) {
      window.history.pushState({}, "", path);
    }
    setRoute(routeFromPath(path));
    window.scrollTo(0, 0);
  }, []);

  return { route, navigate };
}
