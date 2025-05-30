import React, { useState, useEffect, useRef, useCallback } from "react";
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
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [previewLoaded, setPreviewLoaded] = useState<{
    [key: number]: boolean;
  }>({});
  const [showOpenButton, setShowOpenButton] = useState<{
    [key: number]: boolean;
  }>({});
  const iframeRefs = useRef<{ [key: number]: HTMLIFrameElement | null }>({});
  const lastScrollTime = useRef(0);
  const scrollCooldown = 300;
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isHandlingTouch = useRef(false);

  // Load projects on component mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projectsData = await fetchProjects();
        setProjects(projectsData);

        // Preload all project previews
        projectsData.forEach((project, index) => {
          if (project.link && project.link.startsWith("http")) {
            // Create a hidden iframe to preload the content
            const iframe = document.createElement("iframe");
            iframe.src = project.link;
            iframe.style.display = "none";
            iframe.onload = () => {
              setPreviewLoaded((prev) => ({ ...prev, [index]: true }));
              document.body.removeChild(iframe);
            };
            iframe.onerror = () => {
              console.warn(`Failed to preload project: ${project.name}`);
              document.body.removeChild(iframe);
            };
            document.body.appendChild(iframe);
          }
        });
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentPage === 2) {
      loadProjects();
    }
  }, [currentPage]);

  // Navigation functions
  const navigateToProject = useCallback(
    (direction: "next" | "prev") => {
      const now = Date.now();
      if (now - lastScrollTime.current < scrollCooldown) return;

      lastScrollTime.current = now;

      if (direction === "next" && currentProjectIndex < projects.length - 1) {
        setCurrentProjectIndex((prev) => prev + 1);
      } else if (direction === "prev" && currentProjectIndex > 0) {
        setCurrentProjectIndex((prev) => prev - 1);
      }
    },
    [currentProjectIndex, projects.length],
  );

  // Wheel event handler for project navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (currentPage !== 2) return;

      const target = e.target as Element;
      const isInProjectArea =
        target.closest(".project-showcase") ||
        target.closest(".project-card-wrapper");

      if (isInProjectArea) {
        const absDeltaX = Math.abs(e.deltaX);
        const absDeltaY = Math.abs(e.deltaY);

        // Handle horizontal scrolling for project navigation
        if (absDeltaX > absDeltaY * 1.5 && absDeltaX > 25) {
          e.preventDefault();
          e.stopPropagation();

          if (e.deltaX > 0) {
            navigateToProject("next");
          } else {
            navigateToProject("prev");
          }
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentPage, navigateToProject]);

  // Touch event handlers for mobile navigation
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (currentPage !== 2) return;

      const target = e.target as Element;
      const isInProjectArea =
        target.closest(".project-showcase") ||
        target.closest(".project-card-wrapper");

      if (isInProjectArea) {
        const touch = e.touches[0];
        touchStartX.current = touch.clientX;
        touchStartY.current = touch.clientY;
        isHandlingTouch.current = false;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (currentPage !== 2 || !touchStartX.current) return;

      const target = e.target as Element;
      const isInProjectArea =
        target.closest(".project-showcase") ||
        target.closest(".project-card-wrapper");

      if (isInProjectArea) {
        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - touchStartX.current);
        const deltaY = Math.abs(touch.clientY - touchStartY.current);

        if (deltaX > deltaY * 1.5 && deltaX > 30) {
          isHandlingTouch.current = true;
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (currentPage !== 2 || !isHandlingTouch.current) {
        touchStartX.current = 0;
        touchStartY.current = 0;
        isHandlingTouch.current = false;
        return;
      }

      const touch = e.changedTouches[0];
      const swipeDistanceX = touchStartX.current - touch.clientX;
      const swipeDistanceY = Math.abs(touch.clientY - touchStartY.current);

      if (
        Math.abs(swipeDistanceX) > 50 &&
        Math.abs(swipeDistanceX) > swipeDistanceY
      ) {
        if (swipeDistanceX > 0) {
          navigateToProject("next");
        } else {
          navigateToProject("prev");
        }
      }

      touchStartX.current = 0;
      touchStartY.current = 0;
      isHandlingTouch.current = false;
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentPage, navigateToProject]);

  // Handle iframe loading
  const handleIframeLoad = (projectIndex: number) => {
    setPreviewLoaded((prev) => ({ ...prev, [projectIndex]: true }));
  };

  // Handle project opening
  const openProject = (link: string) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  // Parse technologies string
  const parseTechnologies = (techString: string): string[] => {
    return techString
      .split(",")
      .map((tech) => tech.trim())
      .filter((tech) => tech.length > 0);
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
              {loading ? "Loading..." : `${projects.length} projects`}
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

          {/* Projects Showcase */}
          {!loading && projects.length > 0 && (
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
                      <div
                        className="project-preview"
                        onMouseEnter={() =>
                          setShowOpenButton((prev) => ({
                            ...prev,
                            [currentProjectIndex]: true,
                          }))
                        }
                        onMouseLeave={() =>
                          setShowOpenButton((prev) => ({
                            ...prev,
                            [currentProjectIndex]: false,
                          }))
                        }
                      >
                        {projects[currentProjectIndex].link &&
                        projects[currentProjectIndex].link.startsWith(
                          "http",
                        ) ? (
                          <>
                            <iframe
                              ref={(el) =>
                                (iframeRefs.current[currentProjectIndex] = el)
                              }
                              src={projects[currentProjectIndex].link}
                              title={`Preview of ${projects[currentProjectIndex].name}`}
                              className={`project-iframe ${previewLoaded[currentProjectIndex] ? "loaded" : ""}`}
                              onLoad={() =>
                                handleIframeLoad(currentProjectIndex)
                              }
                              sandbox="allow-same-origin allow-scripts allow-forms"
                            />
                            {!previewLoaded[currentProjectIndex] && (
                              <div className="iframe-loading">
                                <div className="loading-spinner"></div>
                                <p>Loading preview...</p>
                              </div>
                            )}
                            {showOpenButton[currentProjectIndex] && (
                              <motion.button
                                className="open-project-btn"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={() =>
                                  openProject(
                                    projects[currentProjectIndex].link,
                                  )
                                }
                              >
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                                </svg>
                                Open Website
                              </motion.button>
                            )}
                          </>
                        ) : (
                          <div className="no-preview">
                            <div className="no-preview-icon">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
                              </svg>
                            </div>
                            <p>Preview not available</p>
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
                            Status: {projects[currentProjectIndex].status || 'Unknown'}
                          </span>
                          {projects[currentProjectIndex].link && (
                            <button
                              className="project-link-btn"
                              onClick={() =>
                                openProject(projects[currentProjectIndex].link)
                              }
                            >
                              Visit Project
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                              </svg>
                            </button>
                          )}
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
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
                    </svg>
                  </button>

                  <div className="project-indicators">
                    {projects.map((_, index) => (
                      <button
                        key={index}
                        className={`indicator ${index === currentProjectIndex ? "active" : ""}`}
                        onClick={() => setCurrentProjectIndex(index)}
                      />
                    ))}
                  </div>

                  <button
                    className={`nav-arrow nav-next ${currentProjectIndex === projects.length - 1 ? "disabled" : ""}`}
                    onClick={() => navigateToProject("next")}
                    disabled={currentProjectIndex === projects.length - 1}
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
          {!loading && projects.length === 0 && (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="empty-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6Z" />
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
