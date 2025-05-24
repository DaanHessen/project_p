import "./globals.css";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import SocialMediaPanel from "./components/SocialMediaPanel";
import { useState, useEffect, useRef, useCallback } from "react";

function App() {
  const [titleComplete, setTitleComplete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const lastScrollTime = useRef(0);
  const scrollCooldown = 500; // Reduced cooldown for better responsiveness
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const minSwipeDistance = 50; // More deliberate gestures
  const isHandlingTouch = useRef(false);

  // Memoized navigation function to prevent recreating on every render
  const handlePageNavigation = useCallback(
    (direction: "up" | "down") => {
      const now = Date.now();
      if (now - lastScrollTime.current < scrollCooldown) {
        return;
      }

      lastScrollTime.current = now;

      if (direction === "down" && currentPage === 1) {
        setCurrentPage(2);
      } else if (direction === "up" && currentPage === 2) {
        setCurrentPage(1);
      }
    },
    [currentPage, scrollCooldown],
  );

  const handleArrowClick = useCallback(() => {
    if (currentPage === 1) {
      setCurrentPage(2);
    } else {
      setCurrentPage(1);
    }
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      e.preventDefault();
      handlePageNavigation(e.deltaY > 0 ? "down" : "up");
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        handlePageNavigation("down");
      } else if (e.key === "ArrowUp" || e.key === "Escape") {
        e.preventDefault();
        handlePageNavigation("up");
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as Element;

      // Don't interfere with social media panel or project navigation
      if (
        target.closest(".social-media-panel") ||
        target.closest(".project-card-wrapper") ||
        target.closest(".nav-arrow")
      ) {
        return;
      }

      const touch = e.touches[0];
      touchStartY.current = touch.clientY;
      touchStartX.current = touch.clientX;
      isHandlingTouch.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as Element;

      // Don't interfere with UI elements
      if (
        target.closest(".social-media-panel") ||
        target.closest(".project-card-wrapper") ||
        target.closest(".nav-arrow")
      ) {
        return;
      }

      if (!touchStartY.current) return;

      const touch = e.touches[0];
      const deltaY = Math.abs(touch.clientY - touchStartY.current);
      const deltaX = Math.abs(touch.clientX - touchStartX.current);

      // Mark as handling if it's primarily vertical and significant
      if (deltaY > deltaX && deltaY > 20) {
        isHandlingTouch.current = true;
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const target = e.changedTouches[0].target as Element;

      // Don't interfere with UI elements
      if (
        target.closest(".social-media-panel") ||
        target.closest(".project-card-wrapper") ||
        target.closest(".nav-arrow")
      ) {
        return;
      }

      if (!touchStartY.current || !isHandlingTouch.current) {
        // Reset values
        touchStartY.current = 0;
        touchStartX.current = 0;
        isHandlingTouch.current = false;
        return;
      }

      const touch = e.changedTouches[0];
      const swipeDistanceY = touchStartY.current - touch.clientY;
      const swipeDistanceX = Math.abs(touch.clientX - touchStartX.current);

      // Only navigate if vertical swipe is dominant and significant
      if (
        Math.abs(swipeDistanceY) > minSwipeDistance &&
        Math.abs(swipeDistanceY) > swipeDistanceX
      ) {
        if (swipeDistanceY > 0) {
          // Swiped up - go to projects
          handlePageNavigation("down");
        } else {
          // Swiped down - go to home
          handlePageNavigation("up");
        }
      }

      // Reset values
      touchStartY.current = 0;
      touchStartX.current = 0;
      isHandlingTouch.current = false;
    };

    // Use passive: false only where needed for preventDefault
    window.addEventListener("wheel", handleScroll, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handlePageNavigation]);

  return (
    <div className="app-container">
      <HomePage currentPage={currentPage} setTitleComplete={setTitleComplete} />

      <ProjectsPage currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Always render social media panel */}
      {titleComplete && (
        <SocialMediaPanel
          currentPage={currentPage}
          onArrowClick={handleArrowClick}
        />
      )}
    </div>
  );
}

export default App;
