import "./globals.css";
import HomePage from "./pages/HomePage";
import SocialMedia from "./components/SocialMedia";
import { Analytics } from "@vercel/analytics/react";
import { useEffect, useState } from "react";

function App() {
  const [loadAnalytics, setLoadAnalytics] = useState(false);

  // Defer analytics loading until after idle
  useEffect(() => {
    const loadAfterIdle = () => setLoadAnalytics(true);
    
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(loadAfterIdle, { timeout: 2000 });
    } else {
      setTimeout(loadAfterIdle, 2000);
    }
  }, []);

  return (
    <div className="app-container">
      <HomePage />
      <SocialMedia />
      {loadAnalytics && <Analytics />}
    </div>
  );
}

export default App;
