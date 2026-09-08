import { CELL_SIZE } from "ascii-blobs";
import SEOHead from "../components/SEOHead";
import SiteNav from "../components/SiteNav";
import NameField from "../components/NameField";
import { APP_VERSION } from "../version";
import "./HomePage.css";

interface HomePageProps {
  onNavigateToResume: () => void;
  onNavigateToMinor: () => void;
  cellPx?: number;
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

const HomePage = ({
  onNavigateToResume,
  onNavigateToMinor,
  cellPx = CELL_SIZE,
}: HomePageProps) => {
  return (
    <>
      <SEOHead
        title="Daan Hessen"
        description="I’m a software development student at the University of Applied Sciences Utrecht, with a background in hospitality and a passion for building things. I like solving problems, learning how things work, and turning ideas into working software. Currently looking for an internship."
        canonical="https://daanhessen.nl"
        structuredData={structuredData}
      />

      <div className="home">

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

        <div className="home__version">v{APP_VERSION}</div>

        <div className="home__scrim" aria-hidden="true" />
        <div className="home__vignette" aria-hidden="true" />

        <div className="home__stage">
          <div className="home__name">
            <NameField cellPx={cellPx} />
            <p className="home__tagline">software developer, hilversum</p>
          </div>

          <p className="home__intro">
            I’m a software development student at the University of Applied
            Sciences Utrecht, with a background in hospitality and a passion for
            building things. I like solving problems, learning how things work,
            and turning ideas into working software.
            <br />
            <br />
            Currently looking for an internship.
          </p>

          <SiteNav
            onNavigateToResume={onNavigateToResume}
            onNavigateToMinor={onNavigateToMinor}
          />
        </div>
      </div>
    </>
  );
};

export default HomePage;
