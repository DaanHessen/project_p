import SEOHead from "../components/SEOHead";
import "./HomePage.css";
import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";
import useGlobalAnimations from "../utils/useGlobalAnimations";

interface HomePageProps {
  setTitleComplete: (complete: boolean) => void;
}

const HomePage = ({ setTitleComplete }: HomePageProps) => {
  const { contentFadeVariants, transitionSettings } = useGlobalAnimations();

  const asciiArt = `██████╗  █████╗  █████╗ ███╗   ██╗    ██╗  ██╗███████╗███████╗███████╗███████╗███╗   ██╗
██╔══██╗██╔══██╗██╔══██╗████╗  ██║    ██║  ██║██╔════╝██╔════╝██╔════╝██╔════╝████╗  ██║
██║  ██║███████║███████║██╔██╗ ██║    ███████║█████╗  ███████╗███████╗█████╗  ██╔██╗ ██║
██║  ██║██╔══██║██╔══██║██║╚██╗██║    ██╔══██║██╔══╝  ╚════██║╚════██║██╔══╝  ██║╚██╗██║
██████╔╝██║  ██║██║  ██║██║ ╚████║    ██║  ██║███████╗███████║███████║███████╗██║ ╚████║
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝    ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═══╝`;

  // Memoize ASCII lines to prevent recalculation
  const asciiLines = useMemo(() => asciiArt.split("\n"), [asciiArt]);

  // SEO structured data
  const homePageStructuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: "Daan Hessen",
      description: "23-year-old HBO-ICT student at Hogeschool Utrecht",
      url: "https://daanhessen.nl",
      image: "https://daanhessen.nl/og-image.jpg",
      jobTitle: "HBO-ICT Student",
      worksFor: {
        "@type": "EducationalOrganization",
        name: "Hogeschool Utrecht",
      },
    },
  };

  useEffect(() => {
    setTitleComplete(true);
  }, [setTitleComplete]);

  return (
    <>
      <SEOHead
        title="Home - Daan Hessen"
        description="23-year-old HBO-ICT student at Hogeschool Utrecht."
        canonical="https://daanhessen.nl"
        structuredData={homePageStructuredData}
      />

      <div className="page page-one">
        <div className="content-container">
          <div className="main-content">
            <motion.div
              className="ascii-art-section"
              variants={contentFadeVariants}
              initial="initial"
              animate="animate"
              transition={transitionSettings.content}
            >
              <pre className="ascii-text">
                {asciiLines.map((line, index) => (
                  <motion.div
                    key={index}
                    variants={contentFadeVariants}
                    initial="initial"
                    animate="animate"
                    transition={{
                      ...transitionSettings.fast,
                      delay: index * 0.05, // Faster stagger
                    }}
                    style={{
                      display: "block",
                      fontKerning: "none",
                    }}
                  >
                    {line}
                  </motion.div>
                ))}
              </pre>
            </motion.div>

            <motion.div
              className="hero-section"
              variants={contentFadeVariants}
              initial="initial"
              animate="animate"
              transition={{
                ...transitionSettings.content,
                delay: 0.3,
              }}
            >
              <motion.div
                className="nav-hint"
                variants={contentFadeVariants}
                initial="initial"
                animate="animate"
                transition={{
                  ...transitionSettings.content,
                  delay: 0.5,
                }}
              >
                <span className="nav-text">Scroll down to see projects</span>
                <motion.div
                  className="nav-arrow"
                  animate={{ y: [0, 5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
