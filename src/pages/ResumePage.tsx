import { useEffect, useMemo, useState } from "react";
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

/*
  Star and fork counts are metadata about the repository, so they sit in the
  meta column with the name rather than floating at the far right of the entry
  where they lined up with nothing.
*/
const RepoStats = ({
  stats,
}: {
  stats: { stars: number; forks: number } | null;
}) => (
  <span
    className="resume__stars"
    title={
      stats
        ? `${stats.stars} stars, ${stats.forks} forks on GitHub`
        : "Repository is private or not on GitHub"
    }
  >
    <span className="resume__stat">
      <StarIcon />
      <span>{stats ? stats.stars : "–"}</span>
    </span>
    <span className="resume__stat">
      <ForkIcon />
      <span>{stats ? stats.forks : "–"}</span>
    </span>
  </span>
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
  const [activeSection, setActiveSection] = useState<string>("experience");

  const navItems = useMemo(() => {
    const items = [
      { id: "experience", label: "experience" },
      { id: "education", label: "education" },
      { id: "projects", label: "projects" },
    ];
    if (repos.length > 0) {
      items.push({ id: "github", label: "more on github" });
    }
    items.push({ id: "technologies", label: "technologies" });
    items.push({ id: "languages", label: "languages" });
    return items;
  }, [repos.length]);

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting);
        if (intersecting.length > 0) {
          intersecting.sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) -
              Math.abs(b.boundingClientRect.top),
          );
          const targetId = intersecting[0].target.id;
          setActiveSection((prev) => (prev === targetId ? prev : targetId));
        }
      },
      {
        rootMargin: "-10% 0px -65% 0px",
        threshold: [0, 0.25],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [navItems]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
      setActiveSection(id);
    }
  };

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
          <div>
            <h1 className="resume__name">Daan Hessen</h1>
            <p className="resume__position">{resume.personal.position}</p>
          </div>

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

          <nav className="resume__nav" aria-label="Sections">
            {navItems.map((item) => (
              <a
                key={item.id}
                className={`resume__nav-link ${
                  activeSection === item.id ? "resume__nav-link--active" : ""
                }`}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="resume__quick-nav" aria-label="Jump to section">
            {navItems.map((item) => (
              <a
                key={item.id}
                className={`resume__quick-link ${
                  activeSection === item.id ? "resume__quick-link--active" : ""
                }`}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </header>

        <div className="resume__body">
          {/* Experience */}
          <section id="experience" className="resume__section">
            <h2 className="resume__section-title">experience</h2>
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

          {/* Education */}
          <section id="education" className="resume__section">
            <h2 className="resume__section-title">education</h2>
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

          {/* Projects */}
          <section id="projects" className="resume__section">
            <h2 className="resume__section-title">projects</h2>
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
                    <RepoStats stats={projectStat} />
                  </div>
                  <div>
                    <p className="resume__entry-desc">{project.description}</p>
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
                  </div>
                </article>
              );
            })}
          </section>

          {/* More on GitHub */}
          {repos.length > 0 && (
            <section id="github" className="resume__section">
              <h2 className="resume__section-title">more on github</h2>
              {repos.map((repo) => (
                <article className="resume__entry" key={repo.url}>
                  <div className="resume__meta resume__meta--strong">
                    <span>{repo.name}</span>
                    {repo.language && (
                      <span className="resume__meta-place">{repo.language}</span>
                    )}
                    <RepoStats stats={repo} />
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
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}

          {/* Technologies & Tools (What I've worked with) */}
          <section id="technologies" className="resume__section">
            <h2 className="resume__section-title">
              technologies & tools i&apos;ve worked with
            </h2>
            <dl className="resume__definitions">
              {resume.skills.map((group) => (
                <div className="resume__entry" key={group.group}>
                  <dt className="resume__meta">{group.group}</dt>
                  <dd className="resume__def-value">{group.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Languages */}
          <section id="languages" className="resume__section">
            <h2 className="resume__section-title">languages</h2>
            <dl className="resume__definitions">
              <div className="resume__entry">
                <dt className="resume__meta">spoken</dt>
                <dd className="resume__def-value">
                  <ul className="resume__language-list">
                    {resume.languages.map((language) => (
                      <li className="resume__language" key={language.name}>
                        {language.name}
                        <span className="resume__language-level">
                          {proficiency(language.level)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </main>
    </>
  );
};

export default ResumePage;
