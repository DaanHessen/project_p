import "./globals.css";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import CVPage from "./pages/CVPage";
import PixelSocialMedia from "./components/PixelSocialMedia";
import { useState, useEffect, useRef, useCallback } from "react";

function App() {
  const [titleComplete, setTitleComplete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const lastScrollTime = useRef(0);
  const scrollCooldown = 300;
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const minSwipeDistance = 50;
  const isHandlingTouch = useRef(false);

  // Navigation function for 3 pages
  const handlePageNavigation = useCallback(
    (direction: "up" | "down") => {
      const now = Date.now();
      if (now - lastScrollTime.current < scrollCooldown) {
        return;
      }

      lastScrollTime.current = now;

      console.log(`📱 Page Navigation: ${direction} from page ${currentPage}`);

      if (direction === "down") {
        if (currentPage === 1) {
          console.log("✅ Navigating to projects page (2)");
          setCurrentPage(2);
        }
      } else if (direction === "up") {
        if (currentPage === 2) {
          console.log("✅ Navigating to home page (1)");
          setCurrentPage(1);
        } else if (currentPage === 3) {
          console.log("✅ Navigating to home page (1) from CV");
          setCurrentPage(1);
        }
      }
    },
    [currentPage, scrollCooldown],
  );

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      // Don't handle scroll on CV page - let it scroll naturally
      if (currentPage === 3) {
        return;
      }

      // Get absolute values for comparison
      const absDeltaX = Math.abs(e.deltaX);
      const absDeltaY = Math.abs(e.deltaY);

      // Check if this is a horizontal gesture (trackpad two-finger swipe left/right)
      if (absDeltaX > absDeltaY * 1.5 && absDeltaX > 20) {
        // Horizontal trackpad gesture detected
        e.preventDefault();
        if (e.deltaX > 0) {
          // Swiped left (go down)
          handlePageNavigation("down");
        } else {
          // Swiped right (go up)
          handlePageNavigation("up");
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
      // Don't handle touch on CV page - let it scroll naturally
      if (currentPage === 3) {
        return;
      }

      const target = e.target as Element;

      // Don't interfere with pixel social media
      if (target.closest(".pixel-social-container")) {
        return;
      }

      const touch = e.touches[0];
      touchStartY.current = touch.clientY;
      touchStartX.current = touch.clientX;
      isHandlingTouch.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Don't handle touch on CV page - let it scroll naturally
      if (currentPage === 3) {
        return;
      }

      const target = e.target as Element;

      // Don't interfere with pixel social media
      if (target.closest(".pixel-social-container")) {
        return;
      }

      if (!touchStartY.current) return;

      const touch = e.touches[0];
      const deltaY = Math.abs(touch.clientY - touchStartY.current);
      const deltaX = Math.abs(touch.clientX - touchStartX.current);

      // Handle vertical gestures
      if (deltaY > deltaX && deltaY > 20) {
        isHandlingTouch.current = true;
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      // Don't handle touch on CV page - let it scroll naturally
      if (currentPage === 3) {
        return;
      }

      const target = e.changedTouches[0].target as Element;

      // Don't interfere with pixel social media
      if (target.closest(".pixel-social-container")) {
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

      // Normal navigation thresholds
      if (
        Math.abs(swipeDistanceY) > minSwipeDistance &&
        Math.abs(swipeDistanceY) > swipeDistanceX
      ) {
        if (swipeDistanceY > 0) {
          // Swiped up - go down
          handlePageNavigation("down");
        } else {
          // Swiped down - go up
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
  }, [handlePageNavigation, currentPage]);

  return (
    <div className="app-container">
      <HomePage currentPage={currentPage} setTitleComplete={setTitleComplete} />

      <ProjectsPage currentPage={currentPage} />

      <CVPage currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Render pixel social media only on homepage */}
      {titleComplete && (
        <PixelSocialMedia
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}

export default App;
