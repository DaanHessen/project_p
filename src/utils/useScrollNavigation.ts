import { useEffect, useRef } from "react";

interface ScrollNavigationOptions {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  excludeSelectors?: string[];
}

export const useScrollNavigation = ({
  totalPages,
  currentPage,
  onPageChange,
  disabled = false,
  excludeSelectors = [],
}: ScrollNavigationOptions) => {
  const lastScrollTime = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    if (disabled) return;

    const shouldExcludeTarget = (target: Element) => {
      return excludeSelectors.some((selector) => target.closest(selector));
    };

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as Element;
      if (shouldExcludeTarget(target)) return;

      const now = Date.now();
      if (now - lastScrollTime.current < 1000) return; // Match 0.8s transition + buffer

      if (Math.abs(e.deltaY) > 10) {
        e.preventDefault();

        if (e.deltaY > 0 && currentPage < totalPages) {
          // Scroll down = next page
          lastScrollTime.current = now;
          onPageChange(currentPage + 1);
        } else if (e.deltaY < 0 && currentPage > 1) {
          // Scroll up = previous page
          lastScrollTime.current = now;
          onPageChange(currentPage - 1);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as Element;
      if (shouldExcludeTarget(target)) return;

      const now = Date.now();
      if (now - lastScrollTime.current < 1000) return;

      switch (e.key) {
        case "ArrowDown":
        case " ":
          if (currentPage < totalPages) {
            e.preventDefault();
            lastScrollTime.current = now;
            onPageChange(currentPage + 1);
          }
          break;
        case "ArrowUp":
          if (currentPage > 1) {
            e.preventDefault();
            lastScrollTime.current = now;
            onPageChange(currentPage - 1);
          }
          break;
        case "Home":
          e.preventDefault();
          lastScrollTime.current = now;
          onPageChange(1);
          break;
        case "End":
          e.preventDefault();
          lastScrollTime.current = now;
          onPageChange(totalPages);
          break;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as Element;
      if (shouldExcludeTarget(target)) return;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const target = e.changedTouches[0].target as Element;
      if (shouldExcludeTarget(target)) return;

      if (!touchStartY.current) return;

      const now = Date.now();
      if (now - lastScrollTime.current < 1000) return;

      const swipeDistance = touchStartY.current - e.changedTouches[0].clientY;

      if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0 && currentPage < totalPages) {
          // Swipe up = next page
          lastScrollTime.current = now;
          onPageChange(currentPage + 1);
        } else if (swipeDistance < 0 && currentPage > 1) {
          // Swipe down = previous page
          lastScrollTime.current = now;
          onPageChange(currentPage - 1);
        }
      }

      touchStartY.current = 0;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentPage, totalPages, onPageChange, disabled, excludeSelectors]);
};
