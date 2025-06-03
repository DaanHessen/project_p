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
      }, 500); // Simple 500ms transition
    },
    [pageState.currentPage, pageState.isTransitioning],
  );

  // Simple content fade variants for page content
  const contentFadeVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Simple transition settings
  const transitionSettings = {
    content: {
      duration: 0.4,
      ease: "easeOut",
    },
    fast: {
      duration: 0.2,
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
