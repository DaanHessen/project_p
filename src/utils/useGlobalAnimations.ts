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

      setTimeout(() => {
        setPageState((prev) => ({
          ...prev,
          isTransitioning: false,
        }));
      }, 300);
    },
    [pageState.currentPage, pageState.isTransitioning],
  );

  const contentFadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const transitionSettings = {
    content: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
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
