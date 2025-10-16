import SEOHead from "../components/SEOHead";
import "./HomePage.css";
import { motion } from "framer-motion";
import { useMemo } from "react";
import useGlobalAnimations from "../utils/useGlobalAnimations";
import useVantaDots from "../utils/useVantaDots";

const HomePage = () => {
  const { contentFadeVariants, transitionSettings } = useGlobalAnimations();

  const asciiArt = `██████╗  █████╗  █████╗ ███╗   ██╗    ██╗  ██╗███████╗███████╗███████╗███████╗███╗   ██╗
██╔══██╗██╔══██╗██╔══██╗████╗  ██║    ██║  ██║██╔════╝██╔════╝██╔════╝██╔════╝████╗  ██║
██║  ██║███████║███████║██╔██╗ ██║    ███████║█████╗  ███████╗███████╗█████╗  ██╔██╗ ██║
██║  ██║██╔══██║██╔══██║██║╚██╗██║    ██╔══██║██╔══╝  ╚════██║╚════██║██╔══╝  ██║╚██╗██║
██████╔╝██║  ██║██║  ██║██║ ╚████║    ██║  ██║███████╗███████║███████║███████╗██║ ╚████║
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝    ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═══╝`;

  const asciiLines = useMemo(() => asciiArt.split("\n"), [asciiArt]);

  const vantaOptions = useMemo(
    () => ({
      color: 0x3b82f6,
      color2: 0x2563eb,
      size: 1.6,
      spacing: 22.0,
      showLines: false,
      backgroundAlpha: 0.0,
      backgroundColor: 0x0a0c14,
      speed: 1.2,
    }),
    []
  );

  const { containerRef, isActive: isVantaActive } = useVantaDots(vantaOptions, {
    respectReducedMotion: false,
  });

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

  return (
    <>
      <SEOHead
        title="Home - Daan Hessen"
        description="23-year-old HBO-ICT student at Hogeschool Utrecht."
        canonical="https://daanhessen.nl"
        structuredData={homePageStructuredData}
      />

      <div
        ref={containerRef}
        className={`page page-one${isVantaActive ? " page-one--vanta" : ""}`}
      >
        <div className="content-container">
          <div className="main-content">
            <div className="ascii-art-section">
              <pre className="ascii-text">
                {asciiLines.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 12 }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                    style={{ display: "block", fontKerning: "none" }}
                  >
                    {line}
                  </motion.div>
                ))}
              </pre>
            </div>

            <motion.div
              className="hero-section"
              variants={contentFadeVariants}
              initial="initial"
              animate="animate"
              transition={{
                ...transitionSettings.content,
                delay: 0.3,
              }}
            ></motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
