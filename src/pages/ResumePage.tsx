import { useEffect, useMemo, useRef, useState } from "react";
import SEOHead from "../components/SEOHead";
import { useGitHubRepos } from "../data/github";
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

const ResumePage = ({ onNavigateHome }: ResumePageProps) => {
  // Repos written up by hand below say more than their GitHub blurb would.
  const curated = useMemo(
    () =>
      resume.projects.flatMap((project) =>
        project.links
          .filter((link) => link.url.includes("github.com"))
          .map((link) => link.url),
      ),
    [],
  );
  const repos = useGitHubRepos(curated);

  // The bar only earns a divider once it is actually overlapping content.
  const sentinel = useRef<HTMLDivElement | null>(null);
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { rootMargin: "-1px 0px 0px 0px", threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <>
    <SEOHead
      title="Daan Hessen, résumé"
      description={resume.personal.about}
      canonical="https://daanhessen.nl/cv"
      structuredData={structuredData}
      noindex
    />

    <main className="resume">
      <div ref={sentinel} className="resume__sentinel" aria-hidden="true" />
      <div className="resume__bar" data-stuck={stuck}>
        <button type="button" className="resume__back" onClick={onNavigateHome}>
          ← back
        </button>
        <button
          type="button"
          className="resume__print"
          onClick={() => window.print()}
        >
          download
        </button>
      </div>

      <header className="resume__identity">
        <h1 className="resume__name">Daan Hessen</h1>
        <p className="resume__position">{resume.personal.position}</p>

        {/* A CV with no way to reply is a dead end. */}
        <ul className="resume__contact">
          <li className="resume__contact-place">{resume.personal.location}</li>
          <li>
            <a className="resume__link" href={`mailto:${resume.personal.email}`}>
              {resume.personal.email}
            </a>
          </li>
          <li>
            <a
              className="resume__link"
              href={resume.personal.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/DaanHessen
            </a>
          </li>
          <li>
            <a
              className="resume__link"
              href={resume.personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              linkedin
            </a>
          </li>
        </ul>

        <p className="resume__about">{resume.personal.about}</p>
      </header>

      <div className="resume__body">

      <section className="resume__section resume__section--timeline">
        <h2 className="resume__section-title">Experience</h2>
        {resume.experience.map((job) => (
          <article
            className="resume__entry"
            data-current={job.duration.includes("Present")}
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

      <section className="resume__section resume__section--timeline">
        <h2 className="resume__section-title">Education</h2>
        {resume.education.map((entry) => (
          <article
            className="resume__entry"
            data-current={entry.duration.includes("Present")}
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
                    {link.text}
                  </a>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      {repos.length > 0 && (
        <section className="resume__section">
          <h2 className="resume__section-title">More on GitHub</h2>
          {repos.map((repo) => (
            <article className="resume__entry" key={repo.url}>
              <div className="resume__meta resume__meta--strong">
                <span>{repo.name}</span>
                {repo.language && (
                  <span className="resume__meta-place">{repo.language}</span>
                )}
              </div>
              <div>
                <p className="resume__entry-desc">{repo.description}</p>
                <div className="resume__links">
                  <a
                    className="resume__link"
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                  {repo.stars > 0 && (
                    <span className="resume__stars">
                      {repo.stars} {repo.stars === 1 ? "star" : "stars"}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      <section className="resume__section">
        <h2 className="resume__section-title">Skills</h2>
        <dl className="resume__skills">
          {resume.skills.map((group) => (
            <div className="resume__skill-row" key={group.group}>
              <dt className="resume__meta">{group.group}</dt>
              <dd>{group.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="resume__section">
        <h2 className="resume__section-title">Languages</h2>
        <ul className="resume__languages">
          {resume.languages.map((language) => (
            <li key={language.name}>
              {language.name},{" "}
              <span className="resume__language-level">
                {proficiency(language.level)}
              </span>
            </li>
          ))}
        </ul>
      </section>
      </div>
      </main>
    </>
  );
};

export default ResumePage;
