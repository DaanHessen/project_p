import { Suspense, lazy, useEffect, useRef, useState } from "react";
import type { AsciiBlobsRef } from "ascii-blobs";
import "ascii-blobs/dist/style.css";
import "./globals.css";
import HomePage from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { useRoute } from "./router";

import { ThemeToggle } from "./components/ThemeToggle";
import { useThemeContext } from "./useTheme";

// CELL_SIZE is 13 — inlining avoids an eager ascii-blobs module parse at startup
const CELL_SIZE_DEFAULT = 13;

const LazyAsciiBlobs = lazy(() => import("ascii-blobs").then(m => ({ default: m.AsciiBlobs })));
const ResumePage = lazy(() => import("./pages/ResumePage"));
const MinorPage = lazy(() => import("./pages/MinorPage"));
const PlannerPage = lazy(() => import("./pages/PlannerPage"));
const DagboekPage = lazy(() => import("./pages/DagboekPage"));

function App() {
  const { route, navigate } = useRoute();
  const { theme, toggleTheme } = useThemeContext();
  const [showBlobs, setShowBlobs] = useState(false);
  const [cellPx, setCellPx] = useState(CELL_SIZE_DEFAULT);
  const blobs = useRef<AsciiBlobsRef>(null);

  useEffect(() => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => setShowBlobs(true), { timeout: 1000 });
    } else {
      setTimeout(() => setShowBlobs(true), 200);
    }
  }, []);

  useEffect(() => {
    if (!showBlobs) return;

    const readCell = () => {
      const stats = blobs.current?.getStats();
      if (!stats?.columns) return;
      setCellPx(window.innerWidth / stats.columns);
    };

    readCell();
    window.addEventListener("resize", readCell);
    return () => window.removeEventListener("resize", readCell);
  }, [showBlobs]);

  // When theme changes, AsciiBlobs doesn't automatically redraw unless we force it or pass the colors prop.
  // Passing the colors prop directly will allow it to update dynamically.
  const [isMatrix, setIsMatrix] = useState(false);
  const [matrixQuote, setMatrixQuote] = useState("");
  
  useEffect(() => {
    const handleToggle = () => {
      setIsMatrix((prev) => {
        if (!prev) {
          setMatrixQuote("Wake up, Neo...");
          setTimeout(() => setMatrixQuote(""), 3000);
        }
        return !prev;
      });
    };

    let buffer = "";
    const handleKeyDown = (e: KeyboardEvent) => {
      buffer = (buffer + e.key).slice(-6);
      if (buffer.toLowerCase() === "matrix") {
        handleToggle();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("toggleMatrix", handleToggle);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("toggleMatrix", handleToggle);
    };
  }, []);

  useEffect(() => {
    if (isMatrix) {
      document.documentElement.setAttribute("data-matrix", "true");
    } else {
      document.documentElement.removeAttribute("data-matrix");
    }
  }, [isMatrix]);

  const asciiColors = {
    background: isMatrix ? "#000000" : theme === "light" ? "#f5f5f7" : "#07080b",
    primary: isMatrix ? "#00ff41" : theme === "light" ? "#1d1d1f" : "#c4cbd6",
    inkShadow: isMatrix ? "#003b00" : theme === "light" ? "#86868b" : "#5a6472",
  };

  const isLocked = route === "home" || route === "404";
  const isBlurred = route !== "home";

  return (
    <div className={`app ${isLocked ? "app--locked" : "app--flow"}`}>
      {/*
        Persistent ASCII background that remains running seamlessly across route transitions.
        On non-home pages, it animates with a strong soft blur and low opacity.
      */}
      <div
        className={`app-ascii-bg ${isBlurred ? "app-ascii-bg--blurred" : ""}`}
        aria-hidden="true"
      >
        {showBlobs && (
          <Suspense fallback={null}>
            <LazyAsciiBlobs
              ref={blobs}
              colors={asciiColors}
              animation={{ revealDuration: 0, revealFade: 1 }}
              performance={isBlurred ? { targetFPS: 20 } : undefined}
              onReady={() => {
                const stats = blobs.current?.getStats();
                if (stats?.columns) setCellPx(window.innerWidth / stats.columns);
              }}
            />
          </Suspense>
        )}
      </div>

      {/*
        Keying on the route remounts the page, which both replays its own
        entrance and restarts this wrapper's fade. Short on purpose: it covers
        the swap without making navigation feel slow.
      */}
      <Suspense fallback={null}>
        <div className="app__route" key={route}>
          {route === "cv" ? (
            <ResumePage onNavigateHome={() => navigate("/")} />
          ) : route === "minor" ? (
            <MinorPage
              onNavigateHome={() => navigate("/")}
              onNavigateToPlanner={() => navigate("/minor/logboek")}
              onNavigateToDagboek={() => navigate("/minor/dagboek")}
            />
          ) : route === "dagboek" ? (
            <DagboekPage onNavigateBack={() => navigate("/minor")} />
          ) : route === "planner" ? (
            <PlannerPage onNavigateBack={() => navigate("/minor")} />
          ) : route === "404" ? (
            <NotFoundPage onNavigateHome={() => navigate("/")} />
          ) : (
            <HomePage
              cellPx={cellPx}
              onNavigateToResume={() => navigate("/cv")}
              onNavigateToMinor={() => navigate("/minor")}
            />
          )}
        </div>
      </Suspense>

      <ThemeToggle theme={theme} toggle={toggleTheme} />

      {matrixQuote && (
        <div className="matrix-toast">
          {matrixQuote}
        </div>
      )}
    </div>
  );
}

export default App;
