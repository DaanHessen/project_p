import type React from "react";
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
    // Long enough to let the type paint first, short enough that the field's
    // reveal still finishes with the rest of the composition.
    const timer = setTimeout(() => setShowBlobs(true), 40);
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
        {/*
          The field's own per-cell reveal is the fade-in. Its last cell starts
          at revealDuration and takes revealFade to finish, so it is fully up at
          the sum — 430ms, plus the 40ms mount delay below, lands it at 470ms:
          exactly when the nav, the last thing to animate, finishes.
        */}
        {showBlobs && (
          <AsciiBlobs animation={{ revealDuration: 200, revealFade: 230 }} />
        )}

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

        {/*
          The scrim sits between the field and the type. Haloing the glyphs
          alone was not enough against a field this dense, so the composition
          gets its own pool of darkness to sit in.
        */}
        <div className="home__scrim" aria-hidden="true" />

        {/*
          One entrance for the whole composition rather than a per-line
          stagger — the parts belong together, so they arrive together.
        */}
        <div className="home__stage">
          <div className="home__name" ref={nameRef}>
            <pre className="home__name-art" style={{ fontSize }}>
              {asciiLines.map((line, index) => (
                <span
                  key={index}
                  className="home__name-line"
                  style={{ "--line": index } as React.CSSProperties}
                >
                  {line}
                </span>
              ))}
            </pre>
            <p className="home__tagline">software developer · utrecht</p>
          </div>

          <p className="home__intro">
            Third-year software development student. I build things end to end —
            a published npm package, a Rust CLI, client sites — and I like the
            problems that need taking apart.
          </p>

          <SiteNav onNavigateToResume={onNavigateToResume} />

          <p className="home__status">
            <span className="home__status-dot" aria-hidden="true" />
            open to internships and junior roles
          </p>
        </div>
      </div>
    </>
  );
};

export default HomePage;
