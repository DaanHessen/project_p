import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { AsciiBlobs } from "ascii-blobs";
import "ascii-blobs/dist/style.css";
import SEOHead from "../components/SEOHead";
import SiteNav from "../components/SiteNav";
import "./HomePage.css";

interface HomePageProps {
  onNavigateToResume: () => void;
}

const asciiArt = `██████╗  █████╗  █████╗ ███╗   ██╗    ██╗  ██╗███████╗███████╗███████╗███████╗███╗   ██╗
██╔══██╗██╔══██╗██╔══██╗████╗  ██║    ██║  ██║██╔════╝██╔════╝██╔════╝██╔════╝████╗  ██║
██║  ██║███████║███████║██╔██╗ ██║    ███████║█████╗  ███████╗███████╗█████╗  ██╔██╗ ██║
██║  ██║██╔══██║██╔══██║██║╚██╗██║    ██╔══██║██╔══╝  ╚════██║╚════██║██╔══╝  ██║╚██╗██║
██████╔╝██║  ██║██║  ██║██║ ╚████║    ██║  ██║███████╗███████║███████║███████╗██║ ╚████║
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝    ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═══╝`;

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: "Daan Hessen",
    jobTitle: "Software Developer",
    url: "https://daanhessen.nl",
    worksFor: {
      "@type": "EducationalOrganization",
      name: "University of Applied Sciences Utrecht",
    },
  },
};

const HomePage = ({ onNavigateToResume }: HomePageProps) => {
  const [showBlobs, setShowBlobs] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowBlobs(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const asciiLines = useMemo(() => asciiArt.split("\n"), []);
  const maxLineLength = useMemo(
    () => asciiLines.reduce((max, line) => Math.max(max, line.length), 0),
    [asciiLines],
  );

  const nameRef = useRef<HTMLDivElement | null>(null);
  const [fontSize, setFontSize] = useState("clamp(0.4rem, 1.1vw, 0.8rem)");

  useEffect(() => {
    const updateFontSize = () => {
      const container = nameRef.current;
      if (!container || maxLineLength === 0) return;

      const availableWidth = container.clientWidth;
      if (availableWidth <= 0) return;

      if (window.innerWidth <= 768) {
        const sizeByWidth = (availableWidth * 0.92) / maxLineLength;
        setFontSize(`${Math.max(5, sizeByWidth)}px`);
      } else {
        setFontSize("clamp(0.4rem, 1.1vw, 0.8rem)");
      }
    };

    updateFontSize();

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const debouncedUpdate = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateFontSize, 150);
    };

    window.addEventListener("resize", debouncedUpdate);
    window.addEventListener("orientationchange", updateFontSize);

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", debouncedUpdate);
      window.removeEventListener("orientationchange", updateFontSize);
    };
  }, [maxLineLength]);

  return (
    <>
      <SEOHead
        title="Daan Hessen — Software Developer"
        description="Software development student in Utrecht."
        canonical="https://daanhessen.nl"
        structuredData={structuredData}
      />

      <div className="home">
        {showBlobs && <AsciiBlobs />}

        <div className="home__credit">
          <a
            href="https://www.npmjs.com/package/ascii-blobs"
            target="_blank"
            rel="noopener noreferrer"
          >
            ascii-blobs v1.0.4
          </a>
          {" · "}
          <a
            href="https://github.com/DaanHessen/ASCII-blobs"
            target="_blank"
            rel="noopener noreferrer"
          >
            git
          </a>
        </div>

        <div className="home__stage">
          <div className="home__name" ref={nameRef}>
            <pre className="home__name-art" style={{ fontSize }}>
              {asciiLines.map((line, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.22,
                    delay: index * 0.03,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  style={{ display: "block", fontKerning: "none" }}
                >
                  {line}
                </motion.div>
              ))}
            </pre>
            <p className="home__tagline">software developer · utrecht</p>
          </div>

          <SiteNav onNavigateToResume={onNavigateToResume} />
        </div>
      </div>
    </>
  );
};

export default HomePage;
