import "./globals.css";
import HomePage from "./pages/HomePage";
import ResumePage from "./pages/ResumePage";
import MinorPage from "./pages/MinorPage";
import { useRoute } from "./router";

function App() {
  const { route, navigate } = useRoute();

  return (
    <div
      className={`app ${route === "home" ? "app--locked" : "app--flow"}`}
    >
      {/*
        Keying on the route remounts the page, which both replays its own
        entrance and restarts this wrapper's fade. Short on purpose: it covers
        the swap without making navigation feel slow.
      */}
      <div className="app__route" key={route}>
        {route === "cv" ? (
          <ResumePage onNavigateHome={() => navigate("/")} />
        ) : route === "minor" ? (
          <MinorPage onNavigateHome={() => navigate("/")} />
        ) : (
          <HomePage
            onNavigateToResume={() => navigate("/cv")}
            onNavigateToMinor={() => navigate("/minor")}
          />
        )}
      </div>
    </div>
  );
}

export default App;
