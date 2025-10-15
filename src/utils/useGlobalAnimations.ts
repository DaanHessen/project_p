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
  // Using hardware-accelerated properties only (opacity and transform)
  const contentFadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  // Optimized transition settings for smooth animations
  const transitionSettings = {
    content: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1], // Custom cubic bezier for smoother animation
    },
    fast: {
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1],
    },
    page: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
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
