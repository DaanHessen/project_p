import { useEffect, useState } from "react";
import { AsciiBlobs } from "ascii-blobs";
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

  useEffect(() => {
    const timer = setTimeout(() => setShowBlobs(true), 40);
    return () => clearTimeout(timer);
  }, []);

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
          <AsciiBlobs animation={{ revealDuration: 0, revealFade: 1 }} />
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

        <div className="home__stage">
          <div className="home__name">
            <NameField />
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
