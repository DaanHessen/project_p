import "./globals.css";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import PixelSocialMedia from "./components/PixelSocialMedia";
import { useState, useEffect, useRef, useCallback } from "react";

function App() {
  const [titleComplete, setTitleComplete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const lastScrollTime = useRef(0);
  const scrollCooldown = 300; // Reduced cooldown for better responsiveness and coordination
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

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      // Get absolute values for comparison
      const absDeltaX = Math.abs(e.deltaX);
      const absDeltaY = Math.abs(e.deltaY);
      const target = e.target as Element;

      // Check if we're inside a project area
      const isInProjectArea =
        target.closest(".project-card-wrapper") ||
        target.closest(".project-showcase");

      // Check if this is a horizontal gesture (trackpad two-finger swipe left/right)
      if (absDeltaX > absDeltaY * 1.5 && absDeltaX > 20) {
        // Horizontal trackpad gesture detected
        if (isInProjectArea && currentPage === 2) {
          // When in project area on projects page, let ProjectsPage handle it
          // We don't prevent default here to allow ProjectsPage wheel handler to run
          return;
        } else {
          // Outside project area or not on projects page - handle page navigation
          e.preventDefault();
          if (e.deltaX > 0) {
            // Swiped left (go to projects page)
            handlePageNavigation("down");
          } else {
            // Swiped right (go to home page)
            handlePageNavigation("up");
          }
        }
      } else if (absDeltaY > 15) {
        // Traditional vertical scroll or trackpad up/down - always handle page navigation
        e.preventDefault();
        handlePageNavigation(e.deltaY > 0 ? "down" : "up");
      }
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

      // Don't interfere with pixel social media or navigation arrows
      // BUT DO allow page navigation from within project cards when swiping vertically
      if (
        target.closest(".pixel-social-container") ||
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

      // Don't interfere with pixel social media or navigation arrows
      // BUT DO allow page navigation from within project cards when swiping vertically
      if (
        target.closest(".pixel-social-container") ||
        target.closest(".nav-arrow")
      ) {
        return;
      }

      if (!touchStartY.current) return;

      const touch = e.touches[0];
      const deltaY = Math.abs(touch.clientY - touchStartY.current);
      const deltaX = Math.abs(touch.clientX - touchStartX.current);

      // Check if we're inside a project card
      const isInProjectCard = target.closest(".project-card-wrapper");

      if (isInProjectCard) {
        // Inside project card: only handle if it's a clear vertical gesture
        // This allows horizontal swipes to be handled by the project navigation
        if (deltaY > deltaX * 2 && deltaY > 30) {
          isHandlingTouch.current = true;
          e.preventDefault();
        }
      } else {
        // Outside project card: handle vertical gestures normally
        if (deltaY > deltaX && deltaY > 20) {
          isHandlingTouch.current = true;
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const target = e.changedTouches[0].target as Element;

      // Don't interfere with pixel social media or navigation arrows
      // BUT DO allow page navigation from within project cards when swiping vertically
      if (
        target.closest(".pixel-social-container") ||
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

      // Check if we're inside a project card
      const isInProjectCard = target.closest(".project-card-wrapper");

      if (isInProjectCard) {
        // Inside project card: require a more deliberate vertical swipe
        // This prevents conflict with horizontal project navigation
        if (
          Math.abs(swipeDistanceY) > 80 &&
          Math.abs(swipeDistanceY) > swipeDistanceX * 2
        ) {
          if (swipeDistanceY > 0) {
            // Swiped up - go to projects (if on home) or stay
            if (currentPage === 1) {
              handlePageNavigation("down");
            }
          } else {
            // Swiped down - go to home (if on projects) or stay
            if (currentPage === 2) {
              handlePageNavigation("up");
            }
          }
        }
      } else {
        // Outside project card: normal navigation thresholds
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
  }, [handlePageNavigation, currentPage]);

  return (
    <div className="app-container">
      <HomePage currentPage={currentPage} setTitleComplete={setTitleComplete} />

      <ProjectsPage currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Render pixel social media only on homepage */}
      {titleComplete && <PixelSocialMedia currentPage={currentPage} />}
    </div>
  );
}

export default App;
