import "./globals.css";
import HomePage from "./pages/HomePage";
import ResumePage from "./pages/ResumePage";
import { useRoute } from "./router";

function App() {
  const { route, navigate } = useRoute();

  return (
    <div className={`app ${route === "cv" ? "app--flow" : "app--locked"}`}>
      {route === "cv" ? (
        <ResumePage onNavigateHome={() => navigate("/")} />
      ) : (
        <HomePage onNavigateToResume={() => navigate("/cv")} />
      )}
    </div>
  );
}

export default App;
