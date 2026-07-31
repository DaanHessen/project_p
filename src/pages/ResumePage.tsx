import SEOHead from "../components/SEOHead";
import { proficiency, resume } from "../data/resume";
import "./ResumePage.css";

interface ResumePageProps {
  onNavigateHome: () => void;
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: "Daan Hessen",
    jobTitle: resume.personal.position,
    description: resume.personal.about,
    url: "https://daanhessen.nl",
  },
};

const ResumePage = ({ onNavigateHome }: ResumePageProps) => (
  <>
    <SEOHead
      title="Résumé — Daan Hessen"
      description={resume.personal.about}
      canonical="https://daanhessen.nl/cv"
      structuredData={structuredData}
      noindex
    />

    <main className="resume">
      <div className="resume__bar">
        <button type="button" className="resume__back" onClick={onNavigateHome}>
          ← back
        </button>
        <button
          type="button"
          className="resume__print"
          onClick={() => window.print()}
        >
          download ↓
        </button>
      </div>

      <header>
        <h1 className="resume__name">Daan Hessen</h1>
        <p className="resume__position">{resume.personal.position}</p>
        <p className="resume__about">{resume.personal.about}</p>
      </header>

      <section className="resume__section">
        <h2 className="resume__section-title">Experience</h2>
        {resume.experience.map((job) => (
          <article
            className="resume__entry"
            key={`${job.company}-${job.duration}`}
          >
            <div className="resume__meta">
              <span>{job.duration}</span>
              <span className="resume__meta-place">{job.location}</span>
            </div>
            <div>
              <h3 className="resume__entry-title">{job.position}</h3>
              <p className="resume__entry-org">{job.company}</p>
              <p className="resume__entry-desc">{job.description}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="resume__section">
        <h2 className="resume__section-title">Education</h2>
        {resume.education.map((entry) => (
          <article
            className="resume__entry"
            key={`${entry.institution}-${entry.duration}`}
          >
            <div className="resume__meta">
              <span>{entry.duration}</span>
              <span className="resume__meta-place">{entry.location}</span>
            </div>
            <div>
              <h3 className="resume__entry-title">{entry.degree}</h3>
              <p className="resume__entry-org">{entry.institution}</p>
              <p className="resume__entry-desc">{entry.description}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="resume__section">
        <h2 className="resume__section-title">Projects</h2>
        {resume.projects.map((project) => (
          <article className="resume__entry" key={project.name}>
            <div className="resume__meta resume__meta--strong">
              <span>{project.name}</span>
            </div>
            <div>
              <p className="resume__entry-desc">{project.description}</p>
              <div className="resume__links">
                {project.links.map((link) => (
                  <a
                    className="resume__link"
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.text} ↗
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="resume__section">
        <h2 className="resume__section-title">Languages</h2>
        <ul className="resume__languages">
          {resume.languages.map((language) => (
            <li key={language.name}>
              {language.name}{" "}
              <span className="resume__language-level">
                — {proficiency(language.level)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  </>
);

export default ResumePage;
