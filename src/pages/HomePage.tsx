import SEOHead from "../components/SEOHead";
import "./HomePage.css";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

interface HomePageProps {
  currentPage: number;
  setTitleComplete: (complete: boolean) => void;
}

const HomePage = ({ currentPage, setTitleComplete }: HomePageProps) => {
  const [typingComplete, setTypingComplete] = useState(false);

  const description = `I'm Daan Hessen, 23 years old, with seven years of experience in the hospitality industry. While I gained valuable skills there, I discovered my true passion lies in technology. Two years ago, I started studying HBO-ICT at Hogeschool Utrecht, driven by my fascination with technology's rapid development and my curiosity about how things work. Currently focused on object-oriented programming through JavaScript, Java, and Python.`;

  const asciiArt = `██████╗  █████╗  █████╗ ███╗   ██╗    ██╗  ██╗███████╗███████╗███████╗███████╗███╗   ██╗
██╔══██╗██╔══██╗██╔══██╗████╗  ██║    ██║  ██║██╔════╝██╔════╝██╔════╝██╔════╝████╗  ██║
██║  ██║███████║███████║██╔██╗ ██║    ███████║█████╗  ███████╗███████╗█████╗  ██╔██╗ ██║
██║  ██║██╔══██║██╔══██║██║╚██╗██║    ██╔══██║██╔══╝  ╚════██║╚════██║██╔══╝  ██║╚██╗██║
██████╔╝██║  ██║██║  ██║██║ ╚████║    ██║  ██║███████╗███████║███████║███████╗██║ ╚████║
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝    ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═══╝`;

  // Memoize ASCII lines to prevent recalculation
  const asciiLines = useMemo(() => asciiArt.split("\n"), [asciiArt]);

  // Simplified animation duration
  const totalAsciiDuration = 1.5; // Fixed duration instead of calculation

  // SEO structured data
  const homePageStructuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: "Daan Hessen",
      description: description,
      url: "https://daanhessen.nl",
      image: "https://daanhessen.nl/og-image.jpg",
      jobTitle: "Full Stack Developer",
      worksFor: {
        "@type": "EducationalOrganization",
        name: "Hogeschool Utrecht",
      },
    },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setTitleComplete(true);
      // Reduced delay before showing description
      setTimeout(() => setTypingComplete(true), totalAsciiDuration * 1000);
    }, 100);
    return () => clearTimeout(timer);
  }, [setTitleComplete, totalAsciiDuration]);

  return (
    <>
      <SEOHead
        title="Daan Hessen - Full Stack Developer & HBO-ICT Student | Portfolio"
        description="Daan Hessen - 23-year-old Full Stack Developer and HBO-ICT student at Hogeschool Utrecht. Specialized in React, TypeScript, JavaScript, Java, and Python. View my portfolio of modern web applications and projects."
        canonical="https://daanhessen.nl"
        structuredData={homePageStructuredData}
      />

      <motion.div
        className={`page page-one page-transition ${currentPage >= 2 ? "page-slide-up" : ""}`}
        initial={false}
        animate={{
          y: currentPage >= 2 ? "-100vh" : "0vh",
          scale: currentPage >= 2 ? 0.95 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 30,
          mass: 0.8,
        }}
      >
        <div className="content-container">
          <div className="main-content">
            <motion.div
              className="ascii-art-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <pre className="ascii-text">
                {asciiLines.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.1,
                      ease: "easeOut",
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
              className="description-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: typingComplete ? 1 : 0,
                y: typingComplete ? 0 : 20,
              }}
              transition={{
                duration: 0.6,
                ease: "easeOut",
              }}
            >
              <p className="description-text">{description}</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default HomePage;
