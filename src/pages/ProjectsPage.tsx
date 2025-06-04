import { motion } from "framer-motion";
import useGlobalAnimations from "../utils/useGlobalAnimations";
import { useState, useEffect, useRef } from "react";
import { fetchProjects, type Project } from "../utils/database";
import "./ProjectsPage.css";

interface ProjectsPageProps {
  currentPage: number;
}

const ProjectsPage = ({ currentPage }: ProjectsPageProps) => {
  const { contentFadeVariants, transitionSettings } = useGlobalAnimations();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewHovered, setPreviewHovered] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const shouldShow = currentPage === 2;

  useEffect(() => {
    const loadProjects = async () => {
      if (shouldShow) {
        setIsLoading(true);
        const projectData = await fetchProjects();
        setProjects(projectData);
        if (projectData.length > 0) {
          setSelectedProject(projectData[0]);
        }
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [shouldShow]);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setPreviewHovered(false);
  };

  const handleVisitWebsite = () => {
    if (selectedProject?.Link) {
      window.open(selectedProject.Link, "_blank");
    }
  };

  return (
    <div className="page page-projects">
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
            delay: 0.05,
            duration: 0.6,
          }}
        >
          {/* Header */}
          <div className="projects-header">
            <h1 className="projects-title">Projects</h1>
            <p className="projects-subtitle">
              A showcase of my development work and technical projects.
            </p>
          </div>

          {/* Projects List */}
          <div className="projects-list">
            {isLoading
              ? // Loading Skeletons
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="project-item skeleton">
                    <div className="project-item-header">
                      <div className="skeleton-title"></div>
                      <div className="skeleton-status"></div>
                    </div>
                    <div className="skeleton-description"></div>
                    <div className="skeleton-tags">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="skeleton-tag"></div>
                      ))}
                    </div>
                  </div>
                ))
              : projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    className={`project-item ${selectedProject?.id === project.id ? "active" : ""}`}
                    onClick={() => handleProjectSelect(project)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className="project-item-header">
                      <h3 className="project-item-title">{project.Name}</h3>
                      <span
                        className={`project-status ${project.Status.toLowerCase().replace(" ", "-")}`}
                      >
                        {project.Status}
                      </span>
                    </div>
                    <p className="project-item-description">
                      {project.Description.length > 100
                        ? `${project.Description.substring(0, 100)}...`
                        : project.Description}
                    </p>
                    {project.Technologies && (
                      <div className="project-item-tags">
                        {project.Technologies.split(",")
                          .slice(0, 3)
                          .map((tech, techIndex) => (
                            <span key={techIndex} className="project-tag">
                              {tech.trim()}
                            </span>
                          ))}
                        {project.Technologies.split(",").length > 3 && (
                          <span className="project-tag more">
                            +{project.Technologies.split(",").length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
          </div>

          {/* Scroll to Top Button */}
          <div className="projects-footer">
            <button
              className="scroll-to-top-button"
              onClick={() => {
                const projectsList = document.querySelector(".projects-list");
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
            delay: 0.1,
            duration: 0.6,
          }}
        >
          {selectedProject ? (
            <div className="project-detail-content">
              {/* Project Info */}
              <div className="project-info">
                <div className="project-info-header">
                  <h2 className="project-detail-title">
                    {selectedProject.Name}
                  </h2>
                  <span
                    className={`project-status large ${selectedProject.Status.toLowerCase().replace(" ", "-")}`}
                  >
                    {selectedProject.Status}
                  </span>
                </div>

                <p className="project-detail-description">
                  {selectedProject.Description}
                </p>

                {selectedProject.Technologies && (
                  <div className="project-detail-tags">
                    <h4>Technologies Used:</h4>
                    <div className="tags-container">
                      {selectedProject.Technologies.split(",").map(
                        (tech, techIndex) => (
                          <span key={techIndex} className="project-tag large">
                            {tech.trim()}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {selectedProject.Link && (
                  <button
                    className="visit-website-btn"
                    onClick={handleVisitWebsite}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                    </svg>
                    Visit Website
                  </button>
                )}
              </div>

              {/* Live Preview */}
              {selectedProject.Link && (
                <div className="project-preview">
                  <div className="preview-header">
                    <h4>Live Preview</h4>
                    <div className="preview-controls">
                      <div className="browser-dots">
                        <span className="dot red"></span>
                        <span className="dot yellow"></span>
                        <span className="dot green"></span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`preview-container ${previewHovered ? "hovered" : ""}`}
                    onMouseEnter={() => setPreviewHovered(true)}
                    onMouseLeave={() => setPreviewHovered(false)}
                    onClick={handleVisitWebsite}
                  >
                    <iframe
                      ref={iframeRef}
                      src={selectedProject.Link}
                      title={`Preview of ${selectedProject.Name}`}
                      className="preview-iframe"
                      loading="lazy"
                      sandbox="allow-scripts allow-same-origin"
                    />

                    {previewHovered && (
                      <motion.div
                        className="preview-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="overlay-content">
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                          </svg>
                          <span>Visit Website</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="no-project-selected">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" />
              </svg>
              <h3>Select a Project</h3>
              <p>
                Choose a project from the sidebar to view details and live
                preview.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectsPage;
