import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";

import "./animations.css";

import "./globals.css";

import App from "./App.tsx";
import { registerSW } from 'virtual:pwa-register';

// Register service worker with automatic reload on update
const updateSW = registerSW({
  onNeedRefresh() {
    // Automatically reload when new content is available
    updateSW(true);
  },
  onOfflineReady() {
    console.log('App ready to work offline');
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);
