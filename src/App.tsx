import "./globals.css";
import HomePage from "./pages/HomePage";
import SocialMedia from "./components/SocialMedia";
import { Analytics } from "@vercel/analytics/next"

function App() {
  return (
    <div className="app-container">
      <HomePage />
      <SocialMedia />
      <Analytics />
    </div>
  );
}

export default App;
