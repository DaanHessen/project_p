import SEOHead from "../components/SEOHead";
import "./HomePage.css";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import useGlobalAnimations from "../utils/useGlobalAnimations";
import AsciiScreensaver from "../components/AsciiScreensaver";

const HomePage = () => {
  const { contentFadeVariants, transitionSettings } = useGlobalAnimations();
  
  const asciiArt = `██████╗  █████╗  █████╗ ███╗   ██╗    ██╗  ██╗███████╗███████╗███████╗███████╗███╗   ██╗
██╔══██╗██╔══██╗██╔══██╗████╗  ██║    ██║  ██║██╔════╝██╔════╝██╔════╝██╔════╝████╗  ██║
██║  ██║███████║███████║██╔██╗ ██║    ███████║█████╗  ███████╗███████╗█████╗  ██╔██╗ ██║
██║  ██║██╔══██║██╔══██║██║╚██╗██║    ██╔══██║██╔══╝  ╚════██║╚════██║██╔══╝  ██║╚██╗██║
██████╔╝██║  ██║██║  ██║██║ ╚████║    ██║  ██║███████╗███████║███████║███████╗██║ ╚████║
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝    ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═══╝`;

  const asciiLines = useMemo(() => asciiArt.split("\n"), [asciiArt]);
  const maxLineLength = useMemo(
    () => asciiLines.reduce((max, line) => Math.max(max, line.length), 0),
    [asciiLines],
  );

  const asciiContainerRef = useRef<HTMLDivElement | null>(null);
  const [asciiFontSize, setAsciiFontSize] = useState<string>('clamp(0.4rem, 1.1vw, 0.8rem)');

  useEffect(() => {
    const updateFontSize = () => {
      const container = asciiContainerRef.current;
      if (!container || maxLineLength === 0) {
        return;
      }

      const availableWidth = container.clientWidth;
      if (availableWidth <= 0) {
        return;
      }

      // Only apply dynamic sizing on mobile/small screens
      if (window.innerWidth <= 768) {
        const minFont = 6.4; // px — ensures readability on very small screens
        const sizeByWidth = (availableWidth * 0.95) / maxLineLength;
        const clampedSize = Math.max(minFont, sizeByWidth);
        setAsciiFontSize(`${clampedSize}px`);
      } else {
        // On desktop, use the CSS clamp for natural sizing
        setAsciiFontSize('clamp(0.4rem, 1.1vw, 0.8rem)');
      }
    };

    updateFontSize();

    const container = asciiContainerRef.current;

    let resizeObserver: ResizeObserver | undefined;
    if (container && typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => updateFontSize());
      resizeObserver.observe(container);
    }

    window.addEventListener("resize", updateFontSize);
    window.addEventListener("orientationchange", updateFontSize);

    return () => {
      window.removeEventListener("resize", updateFontSize);
      window.removeEventListener("orientationchange", updateFontSize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [maxLineLength]);

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
        <AsciiScreensaver />
        <div className="content-container">
          <div className="main-content">
            <div className="ascii-art-section" ref={asciiContainerRef}>
              <pre className="ascii-text" style={{ fontSize: asciiFontSize }}>
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
