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
  const touchStartTime = useRef(0);
  const maxTouchDuration = 500; // Max time for swipe gesture

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
      // Only prevent scroll if it's a deliberate page navigation gesture
      const target = e.target as Element;
      if (
        target.closest(".social-media-panel") ||
        target.closest(".project-card-wrapper") ||
        target.closest(".nav-arrow")
      ) {
        return;
      }

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

      // Don't interfere with UI elements that need their own touch handling
      if (
        target.closest(".social-media-panel") ||
        target.closest(".project-card-wrapper") ||
        target.closest(".nav-arrow") ||
        target.closest("button") ||
        target.closest("a")
      ) {
        return;
      }

      const touch = e.touches[0];
      touchStartY.current = touch.clientY;
      touchStartX.current = touch.clientX;
      touchStartTime.current = Date.now();
      isHandlingTouch.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as Element;

      // Don't interfere with UI elements
      if (
        target.closest(".social-media-panel") ||
        target.closest(".project-card-wrapper") ||
        target.closest(".nav-arrow") ||
        target.closest("button") ||
        target.closest("a")
      ) {
        return;
      }

      if (!touchStartY.current) return;

      const touch = e.touches[0];
      const deltaY = touch.clientY - touchStartY.current;
      const deltaX = Math.abs(touch.clientX - touchStartX.current);
      const absDeltaY = Math.abs(deltaY);

      // Only prevent if it's a clear vertical swipe for page navigation
      // AND the swipe is significant AND primarily vertical
      if (absDeltaY > 30 && absDeltaY > deltaX * 1.5) {
        const timeDiff = Date.now() - touchStartTime.current;

        // Only handle quick, deliberate gestures
        if (timeDiff < maxTouchDuration) {
          isHandlingTouch.current = true;
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const target = e.changedTouches[0].target as Element;

      // Don't interfere with UI elements
      if (
        target.closest(".social-media-panel") ||
        target.closest(".project-card-wrapper") ||
        target.closest(".nav-arrow") ||
        target.closest("button") ||
        target.closest("a")
      ) {
        touchStartY.current = 0;
        touchStartX.current = 0;
        touchStartTime.current = 0;
        isHandlingTouch.current = false;
        return;
      }

      if (!touchStartY.current || !isHandlingTouch.current) {
        // Reset values
        touchStartY.current = 0;
        touchStartX.current = 0;
        touchStartTime.current = 0;
        isHandlingTouch.current = false;
        return;
      }

      const touch = e.changedTouches[0];
      const swipeDistanceY = touchStartY.current - touch.clientY;
      const swipeDistanceX = Math.abs(touch.clientX - touchStartX.current);
      const timeDiff = Date.now() - touchStartTime.current;

      // Only navigate if:
      // 1. Vertical swipe is dominant and significant
      // 2. Gesture was quick (not a slow drag)
      // 3. Distance is sufficient
      if (
        Math.abs(swipeDistanceY) > minSwipeDistance &&
        Math.abs(swipeDistanceY) > swipeDistanceX * 1.5 &&
        timeDiff < maxTouchDuration
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
      touchStartTime.current = 0;
      isHandlingTouch.current = false;
    };

    // Use passive: false more selectively
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
