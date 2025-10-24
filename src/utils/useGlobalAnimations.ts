const useGlobalAnimations = () => {
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
    contentFadeVariants,
    transitionSettings,
  };
};

export default useGlobalAnimations;
