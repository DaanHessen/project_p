import SEOHead from "../components/SEOHead";
import "./HomePage.css";
import { useMemo } from "react";
import useVantaDots from "../utils/useVantaDots";

const HomePage = () => {

  const asciiArt = `██████╗  █████╗  █████╗ ███╗   ██╗    ██╗  ██╗███████╗███████╗███████╗███████╗███╗   ██╗
██╔══██╗██╔══██╗██╔══██╗████╗  ██║    ██║  ██║██╔════╝██╔════╝██╔════╝██╔════╝████╗  ██║
██║  ██║███████║███████║██╔██╗ ██║    ███████║█████╗  ███████╗███████╗█████╗  ██╔██╗ ██║
██║  ██║██╔══██║██╔══██║██║╚██╗██║    ██╔══██║██╔══╝  ╚════██║╚════██║██╔══╝  ██║╚██╗██║
██████╔╝██║  ██║██║  ██║██║ ╚████║    ██║  ██║███████╗███████║███████║███████╗██║ ╚████║
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝    ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═══╝`;

  const asciiLines = useMemo(() => asciiArt.split("\n"), [asciiArt]);

  const vantaOptions = useMemo(
    () => ({
      color: 0x8bc7ff,
      color2: 0x3b82f6,
      size: 2.2,
      spacing: 3.2,
      showLines: false,
      backgroundAlpha: 0.0,
      backgroundColor: 0x0a0c14,
      speed: 2.4,
      mouseEase: true,
    }),
    [],
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
                  <span key={index} className="ascii-line">
                    {line}
                  </span>
                ))}
              </pre>
            </div>

            <div className="hero-section"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
