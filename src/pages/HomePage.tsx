import SEOHead from "../components/SEOHead";
import "./HomePage.css";
import { motion } from "framer-motion";
import { useMemo } from "react";
import useGlobalAnimations from "../utils/useGlobalAnimations";

const HomePage = () => {
  const { contentFadeVariants, transitionSettings } = useGlobalAnimations();

  const asciiArt = `██████╗  █████╗  █████╗ ███╗   ██╗    ██╗  ██╗███████╗███████╗███████╗███████╗███╗   ██╗
██╔══██╗██╔══██╗██╔══██╗████╗  ██║    ██║  ██║██╔════╝██╔════╝██╔════╝██╔════╝████╗  ██║
██║  ██║███████║███████║██╔██╗ ██║    ███████║█████╗  ███████╗███████╗█████╗  ██╔██╗ ██║
██║  ██║██╔══██║██╔══██║██║╚██╗██║    ██╔══██║██╔══╝  ╚════██║╚════██║██╔══╝  ██║╚██╗██║
██████╔╝██║  ██║██║  ██║██║ ╚████║    ██║  ██║███████╗███████║███████║███████╗██║ ╚████║
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝    ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═══╝`;

  const asciiLines = useMemo(() => asciiArt.split("\n"), [asciiArt]);

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
                      delay: index * 0.05,
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
            ></motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
