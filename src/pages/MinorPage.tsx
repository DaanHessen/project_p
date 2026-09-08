import { useEffect, useMemo, useState } from "react";
import SEOHead from "../components/SEOHead";
import BackButton from "../components/BackButton";
import { minorData } from "../data/minor";
import "./ResumePage.css";
import "./MinorPage.css";

interface MinorPageProps {
  onNavigateHome: () => void;
  onNavigateToPlanner?: () => void;
  onNavigateToDagboek?: () => void;
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Minor: Future-proof met AI!",
  description: minorData.meta.description,
  provider: {
    "@type": "EducationalOrganization",
    name: "Hogeschool Utrecht",
  },
  author: {
    "@type": "Person",
    name: "Daan Hessen",
    url: "https://daanhessen.nl",
  },
};

const MinorPage = ({
  onNavigateHome,
  onNavigateToPlanner,
  onNavigateToDagboek,
}: MinorPageProps) => {
  const [activeSection, setActiveSection] = useState<string>("leeruitkomsten");

  const navItems = useMemo(
    () => [
      { id: "leeruitkomsten", label: "leeruitkomsten" },
      { id: "sprints", label: "sprints & bewijzen" },
      { id: "logboek", label: "logboek & user stories" },
      { id: "code", label: "code & opzet" },
    ],
    [],
  );

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.id);

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY + 140;
          for (let i = sectionIds.length - 1; i >= 0; i--) {
            const el = document.getElementById(sectionIds[i]);
            if (el && el.offsetTop <= scrollPos) {
              setActiveSection((prev) =>
                prev === sectionIds[i] ? prev : sectionIds[i],
              );
              ticking = false;
              return;
            }
          }
          if (window.scrollY < 100 && sectionIds.length > 0) {
            setActiveSection((prev) =>
              prev === sectionIds[0] ? prev : sectionIds[0],
            );
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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

  return (
    <>
      <SEOHead
        title="Daan Hessen · Minor: Future-proof met AI!"
        description={minorData.meta.description}
        canonical="https://daanhessen.nl/minor"
        structuredData={structuredData}
        noindex
      />

      <BackButton
        onNavigateHome={onNavigateHome}
        rightAction={
          <div className="minor__topbar-action">
            {onNavigateToDagboek && (
              <button
                type="button"
                className="resume__btn"
                onClick={onNavigateToDagboek}
              >
                digitaal dagboek →
              </button>
            )}
            {onNavigateToPlanner && (
              <button
                type="button"
                className="resume__btn"
                onClick={onNavigateToPlanner}
              >
                planner & logboek →
              </button>
            )}
          </div>
        }
      />

      <main className="resume minor">
        <header className="resume__identity">
          <div className="minor__identity-header">
            <h1 className="resume__name">Minor: Future-proof met AI!</h1>
            <p className="resume__position">
              {minorData.meta.institution} · {minorData.meta.program}
            </p>
          </div>

          <dl className="minor__meta-details">
            <div className="minor__meta-row">
              <dt className="minor__meta-label">student</dt>
              <dd className="minor__meta-value">{minorData.meta.student}</dd>
            </div>
            <div className="minor__meta-row">
              <dt className="minor__meta-label">locatie</dt>
              <dd className="minor__meta-value">Utrecht</dd>
            </div>
            <div className="minor__meta-row">
              <dt className="minor__meta-label">studiejaar</dt>
              <dd className="minor__meta-value">{minorData.meta.academicYear}</dd>
            </div>
            <div className="minor__meta-row">
              <dt className="minor__meta-label">omvang</dt>
              <dd className="minor__meta-value">30 EC · 5 leeruitkomsten</dd>
            </div>
            <div className="minor__meta-row">
              <dt className="minor__meta-label">structuur</dt>
              <dd className="minor__meta-value">8 sprints · 20 weken</dd>
            </div>
          </dl>

          <p className="resume__about">{minorData.meta.description}</p>

          <div className="minor__sidebar-section">
            <span className="minor__sidebar-title">inhoud</span>
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
          </div>

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
          {/* 1. Leeruitkomsten */}
          <section id="leeruitkomsten" className="resume__section">
            <div className="resume__section-header">
              <h2 className="resume__section-title">leeruitkomsten (v2.0)</h2>
              <span className="resume__section-count">5 uitkomsten</span>
            </div>

            {minorData.leeruitkomsten.map((lu) => (
              <article className="resume__entry" key={lu.id}>
                <div className="resume__meta resume__meta--strong">
                  <span>{lu.code}</span>
                  <span className="resume__meta-place">
                    min. {lu.minEvaluations}× voldaan
                  </span>
                  <span className="resume__meta-place">
                    {lu.status.toLowerCase()}
                  </span>
                </div>
                <div>
                  <h3 className="resume__entry-title">{lu.title}</h3>
                  <p className="resume__entry-desc">{lu.fullDescription}</p>
                </div>
              </article>
            ))}
          </section>

          {/* 2. Sprints & Bewijzen */}
          <section id="sprints" className="resume__section">
            <div className="resume__section-header">
              <h2 className="resume__section-title">sprints & bewijzen</h2>
              <span className="resume__section-count">
                {minorData.sprints.length} sprints
              </span>
            </div>

            {minorData.sprints.map((sprint) => {
              const cleanPeriod = sprint.period.replace(/^Sprint \d+\s*·\s*/i, "");
              const isPlanned = sprint.deliverables.length === 0;

              if (isPlanned) {
                return (
                  <article
                    className="resume__entry minor__entry--planned"
                    key={sprint.number}
                  >
                    <div className="resume__meta">
                      <span>Sprint {sprint.number}</span>
                      <span className="minor__status-badge">
                        {sprint.status.toLowerCase()}
                      </span>
                    </div>
                    <div className="minor__planned-body">
                      <span className="minor__planned-period">{cleanPeriod}</span>
                      <span className="minor__planned-hint">
                        bewijzen en deliverables volgen in deze sprintperiode
                      </span>
                    </div>
                  </article>
                );
              }

              return (
                <article className="resume__entry" key={sprint.number}>
                  <div className="resume__meta resume__meta--strong">
                    <span>Sprint {sprint.number}</span>
                    <span className="resume__meta-place">{cleanPeriod}</span>
                    <span
                      className="minor__status-badge"
                      data-status={sprint.status}
                    >
                      {sprint.status.toLowerCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="resume__entry-title">{sprint.title}</h3>

                    {sprint.deliverables.length > 0 && (
                      <div className="minor__deliverables">
                        {sprint.deliverables.map((deliv) => (
                          <div
                            className="minor__deliverable"
                            key={deliv.id + deliv.title}
                          >
                            <div className="minor__deliverable-header">
                              <span className="minor__deliverable-title">
                                {deliv.title}
                              </span>
                              <div className="minor__deliverable-tags">
                                {deliv.leeruitkomsten.map((lu) => (
                                  <span key={lu} className="minor__lu-tag">
                                    {lu}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <p className="resume__entry-desc">
                              {deliv.description}
                            </p>
                            {deliv.links.length > 0 && (
                              <div className="resume__links">
                                {deliv.links.map((link) => (
                                  <a
                                    key={link.url + link.label}
                                    className="resume__link"
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {link.label} ↗
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {sprint.reflection && (
                      <p className="minor__reflection">
                        <span className="minor__reflection-label">
                          reflectie ·{" "}
                        </span>
                        {sprint.reflection}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </section>

          {/* 3. Logboek & User Stories */}
          <section id="logboek" className="resume__section">
            <h2 className="resume__section-title">logboek & user stories</h2>

            <div className="minor__subheading">user stories</div>

            {minorData.userStories.map((story) => (
              <article className="resume__entry" key={story.id}>
                <div className="resume__meta resume__meta--strong">
                  <span>{story.id}</span>
                  <span className="resume__meta-place">
                    Sprint {story.sprint}
                  </span>
                  <span
                    className="minor__status-badge"
                    data-status={story.status.toLowerCase()}
                  >
                    {story.status.toLowerCase()}
                  </span>
                </div>
                <div>
                  <h3 className="resume__entry-title">{story.title}</h3>
                  <p className="resume__entry-desc">
                    Als {story.asA}, wil ik {story.iWant}, zodat{" "}
                    {story.soThat.replace(/\.+$/, "")}.
                  </p>
                  {story.acceptanceCriteria && story.acceptanceCriteria.length > 0 && (
                    <ul className="minor__criteria-list">
                      {story.acceptanceCriteria.map((crit, idx) => (
                        <li key={idx}>
                          <span
                            className="minor__criteria-bullet"
                            aria-hidden="true"
                          >
                            ›
                          </span>
                          <span>{crit}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}

            <div
              className="minor__subheading"
              style={{ marginTop: "var(--space-6)" }}
            >
              logboek items
            </div>

            {minorData.logEntries.map((log) => (
              <article className="resume__entry" key={log.id}>
                <div className="resume__meta resume__meta--strong">
                  <span>{log.id}</span>
                  <span className="resume__meta-place">{log.date}</span>
                  <span className="resume__meta-place">
                    Sprint {log.sprint}
                  </span>
                </div>
                <div>
                  <h3 className="resume__entry-title">{log.title}</h3>
                  <p className="resume__entry-desc">{log.description}</p>
                  {log.links && log.links.length > 0 && (
                    <div className="resume__links">
                      {log.links.map((link) => (
                        <a
                          key={link.url + link.label}
                          className="resume__link"
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.label} ↗
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </section>

          {/* 4. Code & Opzet */}
          <section id="code" className="resume__section">
            <h2 className="resume__section-title">code & opzet</h2>
            <article className="resume__entry">
              <div className="resume__meta resume__meta--strong">
                <span>Architectuur</span>
              </div>
              <div>
                <p className="resume__entry-desc">
                  Deze pagina is gebouwd binnen de bestaande React 18 / Vite
                  portfolio codebase. Alle teksten en data voor de minor staan
                  centraal in{" "}
                  <a
                    className="resume__link"
                    href="https://github.com/DaanHessen/project_p/blob/main/src/data/minor.ts"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    src/data/minor.ts
                  </a>
                  . Client-side routing verloopt via{" "}
                  <a
                    className="resume__link"
                    href="https://github.com/DaanHessen/project_p/blob/main/src/router.tsx"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    src/router.tsx
                  </a>
                  .
                </p>
                <p
                  className="resume__entry-desc"
                  style={{ marginTop: "var(--space-3)" }}
                >
                  De achtergrond van de pagina&apos;s draait op de geanimeerde ASCII
                  metaball engine (<code>ascii-blobs</code>). Voor dagelijkse
                  notities en reflecties is daarnaast het{" "}
                  {onNavigateToDagboek ? (
                    <button
                      type="button"
                      className="resume__link"
                      onClick={onNavigateToDagboek}
                      style={{
                        background: "none",
                        border: "none",
                        font: "inherit",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      digitale dagboek
                    </button>
                  ) : (
                    <span>digitale dagboek</span>
                  )}{" "}
                  beschikbaar.
                </p>
              </div>
            </article>
          </section>
        </div>
      </main>
    </>
  );
};

export default MinorPage;
