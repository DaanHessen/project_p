import { useEffect, useRef, useState } from "react";
import { AsciiBlobs, CELL_SIZE, type AsciiBlobsRef } from "ascii-blobs";
import "ascii-blobs/dist/style.css";
import "./globals.css";
import HomePage from "./pages/HomePage";
import ResumePage from "./pages/ResumePage";
import MinorPage from "./pages/MinorPage";
import PlannerPage from "./pages/PlannerPage";
import DagboekPage from "./pages/DagboekPage";
import { useRoute } from "./router";

function App() {
  const { route, navigate } = useRoute();
  const [showBlobs, setShowBlobs] = useState(false);
  const [cellPx, setCellPx] = useState(CELL_SIZE);
  const blobs = useRef<AsciiBlobsRef>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowBlobs(true), 40);
    return () => clearTimeout(timer);
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

  const isHome = route === "home";

  return (
    <div className={`app ${isHome ? "app--locked" : "app--flow"}`}>
      {/*
        Persistent ASCII background that remains running seamlessly across route transitions.
        On non-home pages, it animates with a strong soft blur and low opacity.
      */}
      <div
        className={`app-ascii-bg ${!isHome ? "app-ascii-bg--blurred" : ""}`}
        aria-hidden="true"
      >
        {showBlobs && (
          <AsciiBlobs
            ref={blobs}
            animation={{ revealDuration: 0, revealFade: 1 }}
            onReady={() => {
              const stats = blobs.current?.getStats();
              if (stats?.columns) setCellPx(window.innerWidth / stats.columns);
            }}
          />
        )}
      </div>

      {/*
        Keying on the route remounts the page, which both replays its own
        entrance and restarts this wrapper's fade. Short on purpose: it covers
        the swap without making navigation feel slow.
      */}
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
        ) : (
          <HomePage
            cellPx={cellPx}
            onNavigateToResume={() => navigate("/cv")}
            onNavigateToMinor={() => navigate("/minor")}
          />
        )}
      </div>
    </div>
  );
}

export default App;
