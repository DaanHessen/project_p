import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import useGlobalAnimations from "../utils/useGlobalAnimations";
import { useState, useEffect } from "react";
import { fetchProjects, type Project } from "../utils/database";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./ProjectsPage.css";

interface ProjectsPageProps {
  currentPage: number;
}

// Project item skeleton that exactly matches real project item structure
const ProjectItemSkeleton = ({ index }: { index: number }) => (
  <motion.div
    className="project-item skeleton-item"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05, duration: 0.2 }}
  >
    <div className="project-item-content">
      <h3 className="project-item-title">
        <Skeleton height={20} width="75%" />
      </h3>
      <p className="project-item-oneliner">
        <Skeleton height={14} width="95%" style={{ marginBottom: "2px" }} />
        <Skeleton height={14} width="70%" />
      </p>
    </div>
    <div className="project-status-circle">
      <Skeleton circle height={12} width={12} />
    </div>
  </motion.div>
);

// Project detail skeleton that exactly matches real project detail structure
const ProjectDetailSkeleton = () => (
  <div className="project-detail-content">
    {/* Project Info */}
    <div className="project-info">
      <div className="project-info-header">
        <h2 className="project-detail-title">
          <Skeleton height={36} width="65%" />
        </h2>
        <div className="project-status-display">
          <div className="project-status-circle large">
            <Skeleton circle height={16} width={16} />
          </div>
          <span className="project-status-text">
            <Skeleton height={14} width={90} />
          </span>
        </div>
      </div>

      <div className="project-detail-description">
        <Skeleton count={3} height={18} style={{ marginBottom: "8px" }} />
      </div>

      <div className="project-detail-tags">
        <h4>
          <Skeleton height={18} width={150} />
        </h4>
        <div className="tags-container">
          <Skeleton
            height={32}
            width={85}
            borderRadius={16}
            style={{ marginRight: "8px" }}
          />
          <Skeleton
            height={32}
            width={95}
            borderRadius={16}
            style={{ marginRight: "8px" }}
          />
          <Skeleton
            height={32}
            width={75}
            borderRadius={16}
            style={{ marginRight: "8px" }}
          />
          <Skeleton height={32} width={110} borderRadius={16} />
        </div>
      </div>
    </div>

    {/* Live Preview Skeleton */}
    <div className="project-preview">
      <div className="preview-header">
        <h3>
          <Skeleton height={22} width={110} />
        </h3>
        <div className="browser-dots">
          <div className="dot red">
            <Skeleton circle height={12} width={12} />
          </div>
          <div className="dot yellow">
            <Skeleton circle height={12} width={12} />
          </div>
          <div className="dot green">
            <Skeleton circle height={12} width={12} />
          </div>
        </div>
      </div>
      <div className="preview-container">
        <Skeleton height={400} />
      </div>
    </div>
  </div>
);

const ProjectsPage: React.FC<ProjectsPageProps> = ({ currentPage }) => {
  const { contentFadeVariants, transitionSettings } = useGlobalAnimations();

  const shouldShow = currentPage === 2;
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false); // Track if we've loaded data before
  const [previewHovered, setPreviewHovered] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      if (shouldShow && !hasLoadedOnce) { // Only load if we haven't loaded before
        setIsLoading(true);
        try {
          const projectData = await fetchProjects();
          
          // Sort projects to put BASE at the top, then the rest in original order
          const sortedProjects = projectData.sort((a, b) => {
            if (a.Name.toUpperCase() === "BASE") return -1; // BASE goes first
            if (b.Name.toUpperCase() === "BASE") return 1;  // BASE goes first
            return 0; // Keep original order for others
          });
          
          setProjects(sortedProjects);
          
          // Find BASE project as default, fallback to first project
          const baseProject = sortedProjects.find(p => p.Name.toUpperCase() === "BASE") || sortedProjects[0];
          if (baseProject) {
            setSelectedProject(baseProject);
          }
          
          setHasLoadedOnce(true); // Mark as loaded
        } catch (error) {
          console.error("Error loading projects:", error);
        } finally {
          // Shorter loading time since skeletons now only show during initial load
          setTimeout(() => {
            setIsLoading(false);
          }, 300);
        }
      }
    };

    loadProjects();
  }, [shouldShow, hasLoadedOnce]); // Clean dependencies

  // Separate effect to handle project selection when data is available
  useEffect(() => {
    if (shouldShow && hasLoadedOnce && !selectedProject && projects.length > 0) {
      // If we've loaded data before but no project is selected, select BASE again
      const baseProject = projects.find(p => p.Name.toUpperCase() === "BASE") || projects[0];
      setSelectedProject(baseProject);
    }
  }, [shouldShow, hasLoadedOnce, selectedProject, projects]);

  const handleProjectSelect = (project: Project) => {
    if (selectedProject?.id !== project.id) {
      setSelectedProject(project);
      setPreviewHovered(false);
    }
  };

  const handleVisitWebsite = () => {
    if (selectedProject?.Link) {
      window.open(selectedProject.Link, "_blank");
    }
  };

  const handleViewSource = (type: "frontend" | "backend") => {
    if (!selectedProject) return;

    const link =
      type === "frontend" ? selectedProject.GithubFE : selectedProject.GithubBE;

    if (link) {
      window.open(link, "_blank");
    }
  };

  const getSourceCodeLinks = (project: Project) => {
    return {
      frontend: project.GithubFE,
      backend: project.GithubBE,
    };
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "in development":
      case "development":
      case "in progress":
        return "#f59e0b"; // Yellow
      case "completed":
      case "live":
      case "production":
        return "#10b981"; // Green
      case "planned":
      case "concept":
        return "#6366f1"; // Blue
      case "maintenance":
        return "#8b5cf6"; // Purple
      case "archived":
      case "deprecated":
        return "#6b7280"; // Gray
      default:
        return "#ef4444"; // Red for anything else
    }
  };

  if (!shouldShow) return null;

  return (
    <SkeletonTheme
      baseColor="rgba(255, 255, 255, 0.1)"
      highlightColor="rgba(255, 255, 255, 0.2)"
      duration={2}
    >
      <motion.div
        className="page-wrapper active"
        variants={contentFadeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transitionSettings.page}
      >
        <div className="projects-page page">
          <div className="projects-layout">
            {/* Projects Sidebar */}
            <motion.div
              className="projects-sidebar"
              variants={contentFadeVariants}
              initial="initial"
              animate={shouldShow ? "animate" : "exit"}
              exit="exit"
              transition={{
                ...transitionSettings.content,
                delay: 0.1,
                duration: 0.4,
              }}
            >
              {/* Projects Header */}
              <div className="projects-header">
                <h1 className="projects-title">PROJECTS</h1>
                <p className="projects-subtitle">
                  My development portfolio and latest work
                </p>
              </div>

              {/* Projects List */}
              <div className="projects-list">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="skeleton-list"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {Array.from({ length: 6 }).map((_, index) => (
                        <ProjectItemSkeleton
                          key={`skeleton-${index}`}
                          index={index}
                        />
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="projects-list"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {projects.map((project, index) => (
                        <motion.div
                          key={project.id}
                          className={`project-item ${selectedProject?.id === project.id ? "active" : ""}`}
                          onClick={() => handleProjectSelect(project)}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.2 }}
                          whileHover={{ x: 4 }}
                        >
                          <div className="project-item-content">
                            <h3 className="project-item-title">
                              {project.Name}
                            </h3>
                            <p className="project-item-oneliner">
                              {project.OneLiner || project.Description}
                            </p>
                          </div>
                          <div
                            className="project-status-circle"
                            style={{
                              backgroundColor: getStatusColor(project.Status),
                            }}
                            title={project.Status}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Scroll to Top Button */}
              <div className="projects-footer">
                <button
                  className="scroll-to-top-button"
                  onClick={() => {
                    const projectsList =
                      document.querySelector(".projects-list");
                    if (projectsList) {
                      projectsList.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  aria-label="Scroll to top"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l8 8-1.41 1.41L12 4.83l-6.59 6.58L4 10l8-8z" />
                  </svg>
                  Back to Top
                </button>
              </div>
            </motion.div>

            {/* Project Detail View */}
            <motion.div
              className="project-detail"
              variants={contentFadeVariants}
              initial="initial"
              animate={shouldShow ? "animate" : "exit"}
              exit="exit"
              transition={{
                ...transitionSettings.content,
                delay: 0,
                duration: 0.3,
              }}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="detail-skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProjectDetailSkeleton />
                  </motion.div>
                ) : selectedProject ? (
                  <motion.div
                    key={`detail-${selectedProject.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="project-detail-content">
                      {/* Project Info */}
                      <div className="project-info">
                        <div className="project-info-header">
                          <h2 className="project-detail-title">
                            {selectedProject.Name}
                          </h2>
                          <div className="project-status-display">
                            <div
                              className="project-status-circle large"
                              style={{
                                backgroundColor: getStatusColor(
                                  selectedProject.Status,
                                ),
                              }}
                            />
                            <span className="project-status-text">
                              {selectedProject.Status}
                            </span>
                          </div>
                        </div>

                        <div className="project-detail-description">
                          {selectedProject.Description}
                        </div>

                        {selectedProject.Technologies && (
                          <div className="project-detail-tags">
                            <h4>Technologies Used:</h4>
                            <div className="tags-container">
                              {selectedProject.Technologies.split(",").map(
                                (tech, techIndex) => (
                                  <span
                                    key={techIndex}
                                    className="project-tag large"
                                  >
                                    {tech.trim()}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Live Preview */}
                      <div className="project-preview">
                        <div className="preview-header">
                          <h3>Live Preview</h3>
                          <div className="browser-dots">
                            <div className="dot red"></div>
                            <div className="dot yellow"></div>
                            <div className="dot green"></div>
                          </div>
                        </div>
                        <div
                          className="preview-container"
                          onMouseEnter={() => setPreviewHovered(true)}
                          onMouseLeave={() => setPreviewHovered(false)}
                        >
                          {selectedProject.Link ? (
                            <iframe
                              src={selectedProject.Link}
                              title={`${selectedProject.Name} Preview`}
                              className="preview-iframe"
                              loading="lazy"
                              sandbox="allow-scripts allow-same-origin"
                            />
                          ) : (
                            <div className="no-preview-available">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                              </svg>
                              <p>Preview not available</p>
                            </div>
                          )}

                          <AnimatePresence>
                            {previewHovered && (
                              <motion.div
                                className="preview-overlay"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="overlay-content">
                                  <div className="overlay-actions">
                                    <button
                                      className="overlay-button"
                                      onClick={handleVisitWebsite}
                                      title="Visit Website"
                                    >
                                      <svg
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                      >
                                        <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                                      </svg>
                                      <span>Visit Website</span>
                                    </button>

                                    {getSourceCodeLinks(selectedProject)
                                      .backend && (
                                      <button
                                        className="overlay-button"
                                        onClick={() =>
                                          handleViewSource("backend")
                                        }
                                        title="View Backend Source Code"
                                      >
                                        <svg
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                        >
                                          <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
                                        </svg>
                                        <span>Backend</span>
                                      </button>
                                    )}

                                    {getSourceCodeLinks(selectedProject)
                                      .frontend && (
                                      <button
                                        className="overlay-button"
                                        onClick={() =>
                                          handleViewSource("frontend")
                                        }
                                        title="View Frontend Source Code"
                                      >
                                        <svg
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                        >
                                          <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
                                        </svg>
                                        <span>Frontend</span>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-project"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="no-project-selected">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M11,16.5L6.5,12L8,10.5L11,13.5L16,8.5L17.5,10L11,16.5Z" />
                      </svg>
                      <h3>No Project Selected</h3>
                      <p>
                        Select a project from the sidebar to view its details
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </SkeletonTheme>
  );
};

export default ProjectsPage;
