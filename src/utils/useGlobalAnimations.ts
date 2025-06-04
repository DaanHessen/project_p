import { useState, useCallback } from "react";

interface PageState {
  currentPage: number;
  isTransitioning: boolean;
}

const useGlobalAnimations = () => {
  const [pageState, setPageState] = useState<PageState>({
    currentPage: 1,
    isTransitioning: false,
  });

  const navigateToPage = useCallback(
    (newPage: number) => {
      if (newPage === pageState.currentPage || pageState.isTransitioning) {
        return;
      }

      setPageState({
        currentPage: newPage,
        isTransitioning: true,
      });

      // Reset transitioning state after animation completes
      setTimeout(() => {
        setPageState((prev) => ({
          ...prev,
          isTransitioning: false,
        }));
      }, 300); // Reduced from 500ms to 300ms
    },
    [pageState.currentPage, pageState.isTransitioning],
  );

  // Simple content fade variants for page content
  const contentFadeVariants = {
    initial: { opacity: 0, y: 0 }, // Removed y offset to prevent shifts
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 0 }, // Removed y offset to prevent shifts
  };

  // Reduced transition settings
  const transitionSettings = {
    content: {
      duration: 0.3, // Reduced from 0.4 to 0.3
      ease: "easeOut",
    },
    fast: {
      duration: 0.15, // Reduced from 0.2 to 0.15
      ease: "easeOut",
    },
    page: {
      duration: 0.4,
      ease: "easeOut",
    },
  };

  return {
    currentPage: pageState.currentPage,
    isTransitioning: pageState.isTransitioning,
    navigateToPage,
    contentFadeVariants,
    transitionSettings,
  };
};

export default useGlobalAnimations;
