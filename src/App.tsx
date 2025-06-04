import "./globals.css";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import CVPage from "./pages/CVPage";
import PixelSocialMedia from "./components/PixelSocialMedia";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useScrollNavigation } from "./utils/useScrollNavigation";
import { ThemeProvider } from "./utils/themeContext";

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [homePageKey, setHomePageKey] = useState(0); // Force HomePage re-render
  const [isReady, setIsReady] = useState(false);
  
  // Wait for everything to load before starting animations
  useEffect(() => {
    const handleLoad = () => {
      // Wait a bit more to ensure everything is truly ready
      setTimeout(() => setIsReady(true), 100);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  // Reset HomePage animations when returning to it
  useEffect(() => {
    if (currentPage === 1) {
      setHomePageKey(prev => prev + 1); // Force re-render
    }
  }, [currentPage]);

  // Simple scroll navigation - only for pages 1 and 2
  useScrollNavigation({
    totalPages: 3, // Home, Projects, and CV pages
    currentPage,
    onPageChange: setCurrentPage,
    excludeSelectors: [
      ".pixel-social-container",
      ".cv-content",
      ".cv-container",
    ],
  });

  return (
    <ThemeProvider>
      <div className="app-container">
      {/* Page 1: Homepage */}
      <div 
        className={`page-wrapper ${currentPage === 1 ? 'active' : ''}`}
        style={{ zIndex: currentPage === 1 ? 10 : 1 }}
      >
        <HomePage key={homePageKey} />
      </div>

      {/* Page 2: Projects */}
      <div 
        className={`page-wrapper ${currentPage === 2 ? 'active' : ''}`}
        style={{ zIndex: currentPage === 2 ? 10 : 1 }}
      >
        <ProjectsPage
          currentPage={currentPage}
          onNavigateUp={() => setCurrentPage(1)}
        />
      </div>

      {/* Page 3: CV - Scroll accessible */}
      <div 
        className={`page-wrapper ${currentPage === 3 ? 'active' : ''}`}
        style={{ zIndex: currentPage === 3 ? 10 : 1 }}
      >
        <CVPage 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
        />
      </div>

      {isReady && (
        <>
          {/* Page Indicator - Synchronized with social media */}
          <motion.div
            className="nav-hint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ duration: 0.25, delay: 0.7 }}
          >
            <div className="page-indicator">
              <span className="page-current">{currentPage}</span>
              <span className="page-separator">/</span>
              <span className="page-total">3</span>
            </div>
          </motion.div>

          {/* Pixel social media - Synchronized with page indicator */}
          <PixelSocialMedia
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
    </div>
    </ThemeProvider>
  );
}

export default App;
