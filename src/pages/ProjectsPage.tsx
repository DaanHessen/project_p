import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchProjects, Project } from "../utils/database";
import SEOHead from "../components/SEOHead";
import "./ProjectsPage.css";

interface ProjectsPageProps {
  currentPage: number;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ currentPage }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  // Load projects when page becomes active
  useEffect(() => {
    if (currentPage === 2) {
      loadProjects();
    }
  }, [currentPage]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const projectsData = await fetchProjects();

      if (Array.isArray(projectsData) && projectsData.length > 0) {
        setProjects(projectsData);
      } else {
        setError("No projects found");
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  // Navigation functions
  const navigateToProject = useCallback(
    (direction: "next" | "prev") => {
      if (direction === "next" && currentProjectIndex < projects.length - 1) {
        setCurrentProjectIndex((prev) => prev + 1);
      } else if (direction === "prev" && currentProjectIndex > 0) {
        setCurrentProjectIndex((prev) => prev - 1);
      }
    },
    [currentProjectIndex, projects.length],
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (currentPage !== 2) return;

      if (e.key === "ArrowLeft") {
        navigateToProject("prev");
      } else if (e.key === "ArrowRight") {
        navigateToProject("next");
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentPage, navigateToProject]);

  // Open project in new tab
  const openProject = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  // Parse technologies string
  const parseTechnologies = (techString: string): string[] => {
    if (!techString) return [];
    return techString
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech.length > 0);
  };

  // Format date
  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Check if URL is safe for iframe (avoid self-reference and known issues)
  const isSafeForIframe = (url: string): boolean => {
    if (!url) return false;

    // Don't embed the current site
    const currentDomain = window.location.hostname;
    if (url.includes(currentDomain)) {
      return false;
    }

    // Don't embed known problematic domains
    const problematicDomains = ["daanhessen.nl", "localhost"];
    return !problematicDomains.some((domain) => url.includes(domain));
  };

  // SEO structured data
  const projectsPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects - Daan Hessen",
    description: "Portfolio of web development projects by Daan Hessen",
    url: "https://daanhessen.nl/projects",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: projects.map((project, index) => ({
        "@type": "CreativeWork",
        position: index + 1,
        name: project.name,
        description: project.description,
        url: project.link,
        creator: {
          "@type": "Person",
          name: "Daan Hessen",
        },
      })),
    },
  };

  // Don't render if not on projects page
  if (currentPage !== 2) {
    return null;
  }

  return (
    <>
      <SEOHead
        title="Projects - Daan Hessen | Full Stack Developer Portfolio"
        description="Explore the portfolio of web development projects by Daan Hessen, featuring modern web applications built with React, TypeScript, and other cutting-edge technologies."
        canonical="https://daanhessen.nl/projects"
        structuredData={projectsPageStructuredData}
      />

      <motion.div
        className="page page-two projects-page"
        initial={{ transform: "translateY(100vh)" }}
        animate={{ transform: "translateY(0)" }}
        exit={{ transform: "translateY(100vh)" }}
        transition={{
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        <div className="projects-content">
          {/* Header */}
          <motion.div
            className="projects-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h1 className="projects-title">Projects</h1>
            <p className="projects-subtitle">
              {loading
                ? "Loading..."
                : error
                  ? "Error loading projects"
                  : `${projects.length} project${projects.length !== 1 ? "s" : ""}`}
            </p>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div
              className="loading-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="loading-spinner"></div>
              <p>Loading projects...</p>
            </motion.div>
          )}

          {/* Error State */}
          {!loading && error && (
            <motion.div
              className="error-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="error-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
                </svg>
              </div>
              <h2>Failed to Load Projects</h2>
              <p>{error}</p>
              <button className="retry-btn" onClick={loadProjects}>
                Retry
              </button>
            </motion.div>
          )}

          {/* Projects Showcase */}
          {!loading && !error && projects.length > 0 && (
            <div className="project-showcase">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentProjectIndex}
                  className="project-card-wrapper"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {projects[currentProjectIndex] && (
                    <div className="project-card">
                      {/* Project Preview */}
                      <div className="project-preview">
                        {isSafeForIframe(projects[currentProjectIndex].link) ? (
                          <div className="iframe-container">
                            <iframe
                              src={projects[currentProjectIndex].link}
                              title={`Preview of ${projects[currentProjectIndex].name}`}
                              className="project-iframe"
                              sandbox="allow-same-origin allow-scripts allow-forms"
                              loading="lazy"
                            />
                            <div
                              className="iframe-overlay"
                              onClick={() =>
                                openProject(projects[currentProjectIndex].link)
                              }
                            >
                              <div className="overlay-content">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                                </svg>
                                <span>View Live Site</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="no-preview">
                            <div className="no-preview-icon">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                              </svg>
                            </div>
                            <h3>{projects[currentProjectIndex].name}</h3>
                            <p>Click to view this project</p>
                            <button
                              className="preview-fallback-btn"
                              onClick={() =>
                                openProject(projects[currentProjectIndex].link)
                              }
                            >
                              View Project
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Project Info */}
                      <div className="project-info">
                        <div className="project-header">
                          <h2 className="project-name">
                            {projects[currentProjectIndex].name}
                          </h2>
                        </div>

                        <p className="project-description">
                          {projects[currentProjectIndex].description}
                        </p>

                        {/* Technologies */}
                        {projects[currentProjectIndex].technologies && (
                          <div className="project-technologies">
                            <h3>Technologies</h3>
                            <div className="tech-tags">
                              {parseTechnologies(
                                projects[currentProjectIndex].technologies,
                              ).map((tech, index) => (
                                <span key={index} className="tech-tag">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Project Meta */}
                        <div className="project-meta">
                          <span className="project-date">
                            Added{" "}
                            {formatDate(
                              projects[currentProjectIndex].dateadded,
                            )}
                          </span>
                          <div className="project-actions">
                            {projects[currentProjectIndex].link && (
                              <button
                                className="project-link-btn primary"
                                onClick={() =>
                                  openProject(
                                    projects[currentProjectIndex].link,
                                  )
                                }
                              >
                                View Live Site
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                                </svg>
                              </button>
                            )}
                            {projects[currentProjectIndex].github_url && (
                              <button
                                className="project-link-btn secondary"
                                onClick={() =>
                                  openProject(
                                    projects[currentProjectIndex].github_url!,
                                  )
                                }
                              >
                                View Code
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              {projects.length > 1 && (
                <div className="project-navigation">
                  <button
                    className={`nav-arrow nav-prev ${currentProjectIndex === 0 ? "disabled" : ""}`}
                    onClick={() => navigateToProject("prev")}
                    disabled={currentProjectIndex === 0}
                    aria-label="Previous project"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
                    </svg>
                  </button>

                  <div className="project-indicators">
                    {projects.map((project, index) => (
                      <button
                        key={project.id}
                        className={`indicator ${index === currentProjectIndex ? "active" : ""}`}
                        onClick={() => setCurrentProjectIndex(index)}
                        aria-label={`Go to project ${index + 1}: ${project.name}`}
                      />
                    ))}
                  </div>

                  <button
                    className={`nav-arrow nav-next ${currentProjectIndex === projects.length - 1 ? "disabled" : ""}`}
                    onClick={() => navigateToProject("next")}
                    disabled={currentProjectIndex === projects.length - 1}
                    aria-label="Next project"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && projects.length === 0 && (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
                </svg>
              </div>
              <h2>No Projects Found</h2>
              <p>
                Projects will appear here once they're added to the database.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default ProjectsPage;
