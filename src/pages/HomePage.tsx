import { useEffect, useRef, useState } from "react";
import { AsciiBlobs, CELL_SIZE, type AsciiBlobsRef } from "ascii-blobs";
import "ascii-blobs/dist/style.css";
import SEOHead from "../components/SEOHead";
import SiteNav from "../components/SiteNav";
import NameField from "../components/NameField";
import "./HomePage.css";

interface HomePageProps {
  onNavigateToResume: () => void;
}

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
  const [cellPx, setCellPx] = useState(CELL_SIZE);
  const blobs = useRef<AsciiBlobsRef>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowBlobs(true), 40);
    return () => clearTimeout(timer);
  }, []);

  /*
    The name's corona draws on the field's grid, so it has to be told how wide
    a cell actually is. The engine is the only thing that knows: it clamps the
    configured size against the viewport, so asking it beats assuming.
  */
  useEffect(() => {
    if (!showBlobs) return;

    const readCell = () => {
      const stats = blobs.current?.getStats();
      if (!stats?.columns) return;
      setCellPx(window.innerWidth / stats.columns);
    };

    readCell();
    window.addEventListener("resize", readCell);
    return () => window.removeEventListener("resize", readCell);
  }, [showBlobs]);

  return (
    <>
      <SEOHead
        title="Daan Hessen"
        description="Software development student in Utrecht."
        canonical="https://daanhessen.nl"
        structuredData={structuredData}
      />

      <div className="home">
        {showBlobs && (
          <AsciiBlobs
            ref={blobs}
            animation={{ revealDuration: 0, revealFade: 1 }}
            onReady={() => {
              const stats = blobs.current?.getStats();
              if (stats?.columns) setCellPx(window.innerWidth / stats.columns);
            }}
          />
        )}

        <div className="home__credit">
          <a
            href="https://www.npmjs.com/package/ascii-blobs"
            target="_blank"
            rel="noopener noreferrer"
          >
            ascii-blobs v2.0.0
          </a>
          {" / "}
          <a
            href="https://github.com/DaanHessen/ASCII-blobs"
            target="_blank"
            rel="noopener noreferrer"
          >
            git
          </a>
        </div>

        <div className="home__scrim" aria-hidden="true" />
        <div className="home__vignette" aria-hidden="true" />

        <div className="home__stage">
          <div className="home__name">
            <NameField cellPx={cellPx} />
            <p className="home__tagline">software developer, hilversum</p>
          </div>

          <p className="home__intro">
            Just a guy studying HBO-ICT at the University of Applied Sciences
            Utrecht. Experience in hospitality, plus a few (passion) projects.
            I like solving problems and learning new things. I write my own
            code, but I use AI to move faster. I am currently looking for an
            internship.
          </p>

          <SiteNav onNavigateToResume={onNavigateToResume} />
        </div>
      </div>
    </>
  );
};

export default HomePage;
