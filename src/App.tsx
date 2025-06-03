import "./globals.css";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import CVPage from "./pages/CVPage";
import PixelSocialMedia from "./components/PixelSocialMedia";
import { useState, useEffect } from "react";
import { useScrollNavigation } from "./utils/useScrollNavigation";

function App() {
  const [titleComplete, setTitleComplete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [homePageKey, setHomePageKey] = useState(0); // Force HomePage re-render
  
  // Reset HomePage animations when returning to it
  useEffect(() => {
    if (currentPage === 1) {
      setTitleComplete(false); // Reset title animation
      setHomePageKey(prev => prev + 1); // Force re-render
    }
  }, [currentPage]);

  // Simple scroll navigation - only for pages 1 and 2
  useScrollNavigation({
    totalPages: 2, // Only Home and Projects pages
    currentPage,
    onPageChange: setCurrentPage,
    disabled: currentPage === 3, // Disable when on CV page
    excludeSelectors: [
      ".pixel-social-container",
      ".cv-content",
      ".cv-container",
    ],
  });

  return (
    <div className="app-container">
      {/* Page 1: Homepage */}
      <div 
        className={`page-wrapper ${currentPage === 1 ? 'active' : ''}`}
        style={{ zIndex: currentPage === 1 ? 10 : 1 }}
      >
        <HomePage 
          key={homePageKey} 
          setTitleComplete={setTitleComplete} 
        />
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

      {/* Page 3: CV - Only accessible via social media button */}
      <div 
        className={`page-wrapper ${currentPage === 3 ? 'active' : ''}`}
        style={{ zIndex: currentPage === 3 ? 10 : 1 }}
      >
        <CVPage 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
        />
      </div>

      {/* Render pixel social media only on homepage */}
      {titleComplete && currentPage === 1 && (
        <PixelSocialMedia
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}

export default App;
