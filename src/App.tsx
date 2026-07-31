import "./globals.css";
import HomePage from "./pages/HomePage";
import ResumePage from "./pages/ResumePage";
import { useRoute } from "./router";

function App() {
  const { route, navigate } = useRoute();

  return (
    <div className={`app ${route === "cv" ? "app--flow" : "app--locked"}`}>
      {/*
        Keying on the route remounts the page, which both replays its own
        entrance and restarts this wrapper's fade. Short on purpose: it covers
        the swap without making navigation feel slow.
      */}
      <div className="app__route" key={route}>
        {route === "cv" ? (
          <ResumePage onNavigateHome={() => navigate("/")} />
        ) : (
          <HomePage onNavigateToResume={() => navigate("/cv")} />
        )}
      </div>
    </div>
  );
}

export default App;
