import { useMemo, useState } from "react";
import SEOHead from "../components/SEOHead";
import BackButton from "../components/BackButton";
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

const StarIcon = () => (
  <svg
    className="resume__stat-icon"
    viewBox="0 0 16 16"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
  </svg>
);

const ForkIcon = () => (
  <svg
    className="resume__stat-icon"
    viewBox="0 0 16 16"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
  </svg>
);

const ResumePage = ({ onNavigateHome }: ResumePageProps) => {
  const curated = useMemo(
    () =>
      resume.projects.flatMap((project) =>
        project.links
          .filter((link) => link.url.includes("github.com"))
          .map((link) => link.url),
      ),
    [],
  );
  const { repos, stats } = useGitHubRepos(curated);

  const [printHint, setPrintHint] = useState(false);

  /*
    Printing is the only way to a PDF here, and it is not uniformly available:
    it is a no-op in Firefox Android and inside app webviews, and on iOS the
    dialog can decline to open at all. Rather than leave a dead button, fall
    back to telling the reader the route their browser does have.
  */
  const handlePrint = () => {
    if (typeof window.print !== "function") {
      setPrintHint(true);
      return;
    }
    try {
      window.print();
    } catch {
      setPrintHint(true);
    }
  };

  return (
    <>
    <SEOHead
      title="Daan Hessen, résumé"
      description={resume.personal.about}
      canonical="https://daanhessen.nl/cv"
      structuredData={structuredData}
      noindex
    />

    <BackButton
      onNavigateHome={onNavigateHome}
      rightAction={
        <div className="resume__topbar-action">
          <button type="button" className="resume__print" onClick={handlePrint}>
            download as PDF
          </button>
          {printHint && (
            <p className="resume__print-hint" role="status">
              This browser will not open a print dialog. On iPhone use Share →
              Print, then pinch the preview to save it as a PDF; in an in-app
              browser, open the page in Safari or Chrome first.
            </p>
          )}
        </div>
      }
    />

    <main className="resume">
      <header className="resume__identity">
        <h1 className="resume__name">Daan Hessen</h1>
        <p className="resume__position">{resume.personal.position}</p>

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

        <ul className="resume__nav">
          <li>
            <a className="resume__link" href="#experience">
              Experience
            </a>
          </li>
          <li>
            <a className="resume__link" href="#education">
              Education
            </a>
          </li>
          <li>
            <a className="resume__link" href="#projects">
              Projects
            </a>
          </li>
          {repos.length > 0 && (
            <li>
              <a className="resume__link" href="#github">
                More on GitHub
              </a>
            </li>
          )}
          {/* Skills disabled for now
          <li>
            <a className="resume__link" href="#skills">
              Skills
            </a>
          </li>
          */}
          <li>
            <a className="resume__link" href="#languages">
              Languages
            </a>
          </li>
        </ul>
      </header>

      <div className="resume__body">

      <section id="experience" className="resume__section resume__section--timeline">
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

      <section id="education" className="resume__section resume__section--timeline">
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

      <section id="projects" className="resume__section">
        <h2 className="resume__section-title">Projects</h2>
        {resume.projects.map((project) => {
          const ghLink = project.links.find(
            (l) => l.type === "github" || l.url.toLowerCase().includes("github.com"),
          );
          const urlKey = ghLink?.url.toLowerCase().replace(/\/+$/, "");
          const repoName = urlKey?.split("/").pop();
          const projectStat =
            (urlKey && stats[urlKey]) ||
            (repoName && stats[repoName]) ||
            stats[project.name.toLowerCase()] ||
            null;

          return (
            <article className="resume__entry" key={project.name}>
              <div className="resume__meta resume__meta--strong">
                <span>{project.name}</span>
              </div>
              <div>
                <p className="resume__entry-desc">{project.description}</p>
                <div className="resume__actions-row">
                  <div className="resume__links">
                    {project.links.map((link) =>
                      link.offline ? (
                        <span
                          className="resume__link resume__link--offline"
                          key={link.url}
                          role="link"
                          aria-disabled="true"
                          tabIndex={0}
                          title="website offline"
                        >
                          {link.text}
                          <span className="resume__link-tooltip" role="tooltip">
                            website offline
                          </span>
                        </span>
                      ) : (
                        <a
                          className="resume__link"
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.text}
                        </a>
                      ),
                    )}
                  </div>
                  <span
                    className="resume__stars"
                    title={
                      projectStat
                        ? `${projectStat.stars} stars, ${projectStat.forks} forks on GitHub`
                        : "Repository is private or not included on GitHub"
                    }
                  >
                    <span className="resume__stat">
                      <StarIcon />
                      <span>{projectStat ? projectStat.stars : "-"}</span>
                    </span>
                    <span className="resume__stat">
                      <ForkIcon />
                      <span>{projectStat ? projectStat.forks : "-"}</span>
                    </span>
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {repos.length > 0 && (
        <section id="github" className="resume__section">
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
                <div className="resume__actions-row">
                  <div className="resume__links">
                    <a
                      className="resume__link"
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                  </div>
                  <span
                    className="resume__stars"
                    title={`${repo.stars} stars, ${repo.forks} forks on GitHub`}
                  >
                    <span className="resume__stat">
                      <StarIcon />
                      <span>{repo.stars}</span>
                    </span>
                    <span className="resume__stat">
                      <ForkIcon />
                      <span>{repo.forks}</span>
                    </span>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      <div className="resume__pair">
      {/* Skills disabled for now
      <section id="skills" className="resume__section">
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
      */}

      <section id="languages" className="resume__section">
        <h2 className="resume__section-title">Languages</h2>
        <dl className="resume__languages">
          {resume.languages.map((language) => (
            <div className="resume__language-row" key={language.name}>
              <dt className="resume__meta">{language.name}</dt>
              <dd>{proficiency(language.level)}</dd>
            </div>
          ))}
        </dl>
      </section>
      </div>
      </div>
      </main>
    </>
  );
};

export default ResumePage;
