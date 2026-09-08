import { useEffect, useRef, useState } from "react";
import { AsciiBlobs, type AsciiBlobsRef } from "ascii-blobs";
import "ascii-blobs/dist/style.css";
import SEOHead from "../components/SEOHead";
import BackButton from "../components/BackButton";
import MinorPlanner from "../components/MinorPlanner";
import { minorData } from "../data/minor";
import "./ResumePage.css";
import "./MinorPage.css";

interface MinorPageProps {
  onNavigateHome: () => void;
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

const MinorPage = ({ onNavigateHome }: MinorPageProps) => {
  const [showBlobs, setShowBlobs] = useState(false);
  const blobs = useRef<AsciiBlobsRef>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowBlobs(true), 40);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SEOHead
        title="Daan Hessen · Minor: Future-proof met AI!"
        description={minorData.meta.description}
        canonical="https://daanhessen.nl/minor"
        structuredData={structuredData}
        noindex
      />

      {showBlobs && (
        <AsciiBlobs
          ref={blobs}
          animation={{ revealDuration: 0, revealFade: 1 }}
        />
      )}

      <div className="minor__scrim" aria-hidden="true" />
      <div className="minor__vignette" aria-hidden="true" />

      <BackButton onNavigateHome={onNavigateHome} badge="/minor" />

      <main className="resume minor">
        <header className="resume__identity">
          <h1 className="resume__name">Minor: Future-proof met AI!</h1>
          <p className="resume__position">
            {minorData.meta.institution} · {minorData.meta.program}
          </p>

          <ul className="resume__contact">
            <li className="resume__contact-place">Utrecht</li>
            <li>{minorData.meta.student}</li>
            <li>{minorData.meta.academicYear}</li>
            <li>
              <a
                className="resume__link"
                href="https://github.com/DaanHessen/project_p"
                target="_blank"
                rel="noopener noreferrer"
              >
                git
              </a>
            </li>
          </ul>

          <p className="resume__about">{minorData.meta.description}</p>

          <ul className="minor__nav">
            <li>
              <a className="resume__link" href="#leeruitkomsten">
                Leeruitkomsten
              </a>
            </li>
            <li>
              <a className="resume__link" href="#sprints">
                Sprints & Bewijzen
              </a>
            </li>
            <li>
              <a className="resume__link" href="#logboek">
                Logboek & User Stories
              </a>
            </li>
            <li>
              <a className="resume__link" href="#code">
                Code & Opzet
              </a>
            </li>
          </ul>
        </header>

        <div className="resume__body">
          {/* 1. Leeruitkomsten */}
          <section id="leeruitkomsten" className="resume__section">
            <h2 className="resume__section-title">Leeruitkomsten</h2>
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
          <section
            id="sprints"
            className="resume__section resume__section--timeline"
          >
            <h2 className="resume__section-title">Sprints & Bewijzen</h2>
            {minorData.sprints.map((sprint) => (
              <article
                className="resume__entry"
                data-current={sprint.status === "In uitvoering"}
                key={sprint.number}
              >
                <div className="resume__meta">
                  <span>Sprint {sprint.number}</span>
                  <span className="resume__meta-place">
                    {sprint.status.toLowerCase()}
                  </span>
                  <span className="resume__meta-place">
                    {sprint.period.replace(/Sprint \d+ · /, "")}
                  </span>
                </div>
                <div>
                  <h3 className="resume__entry-title">{sprint.title}</h3>
                  {sprint.goal && (
                    <p className="resume__entry-org">{sprint.goal}</p>
                  )}

                  {sprint.deliverables.length > 0 && (
                    <div className="minor__deliverables">
                      {sprint.deliverables.map((deliv) => (
                        <div key={deliv.id} className="minor__deliverable-row">
                          <div className="minor__deliverable-head">
                            <h4 className="minor__deliverable-name">
                              {deliv.title}
                            </h4>
                            <span className="minor__deliverable-tags">
                              {deliv.leeruitkomsten.join(", ")}
                            </span>
                          </div>
                          <p className="resume__entry-desc">{deliv.description}</p>
                          <div className="resume__links">
                            {deliv.links.map((link) => (
                              <a
                                key={link.url + link.label}
                                className="resume__link"
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {link.label}
                              </a>
                            ))}
                          </div>
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
            ))}
          </section>

          {/* 3. Integraal Logboek & User Stories */}
          <section id="logboek" className="resume__section">
            <h2 className="resume__section-title">Logboek & User Stories</h2>
            <MinorPlanner data={minorData} />
          </section>

          {/* 4. Code & Opzet */}
          <section id="code" className="resume__section">
            <h2 className="resume__section-title">Code & Opzet</h2>
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
                  </a>{" "}
                  zonder externe dependencies.
                </p>
                <p
                  className="resume__entry-desc"
                  style={{ marginTop: "var(--space-3)" }}
                >
                  De achtergrond draait op de geanimeerde ASCII metaball engine (
                  <code>ascii-blobs</code>).
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
