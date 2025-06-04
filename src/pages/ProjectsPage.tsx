import { motion } from "framer-motion";
import useGlobalAnimations from "../utils/useGlobalAnimations";
import { useState, useEffect } from "react";
import { fetchProjects, type Project } from "../utils/database";

interface ProjectsPageProps {
  currentPage: number;
  onNavigateUp?: () => void;
}

const ProjectsPage = ({ currentPage }: ProjectsPageProps) => {
  const { contentFadeVariants, transitionSettings } = useGlobalAnimations();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const shouldShow = currentPage === 2;

  useEffect(() => {
    const loadProjects = async () => {
      if (shouldShow) {
        setIsLoading(true);
        const projectData = await fetchProjects();
        setProjects(projectData);
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [shouldShow]);

  return (
    <div className="page page-projects">
      <div className="content-container">
        <motion.div
          className="main-content"
          variants={contentFadeVariants}
          initial="initial"
          animate={shouldShow ? "animate" : "exit"}
          exit="exit"
          transition={{
            ...transitionSettings.content,
            delay: 0.2,
          }}
        >
          <motion.h1
            variants={contentFadeVariants}
            initial="initial"
            animate={shouldShow ? "animate" : "exit"}
            exit="exit"
            transition={{
              ...transitionSettings.content,
              delay: 0.3,
            }}
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: "300",
              color: "var(--text-primary)",
              marginBottom: "2rem",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            Projects
          </motion.h1>

          <motion.p
            variants={contentFadeVariants}
            initial="initial"
            animate={shouldShow ? "animate" : "exit"}
            exit="exit"
            transition={{
              ...transitionSettings.content,
              delay: 0.4,
            }}
            style={{
              fontSize: "1.2rem",
              color: "var(--text-secondary)",
              marginBottom: "3rem",
              maxWidth: "600px",
              lineHeight: "1.6",
            }}
          >
            A showcase of my development projects and technical work.
          </motion.p>

          {/* Projects Grid */}
          <motion.div
            variants={contentFadeVariants}
            initial="initial"
            animate={shouldShow ? "animate" : "exit"}
            exit="exit"
            transition={{
              ...transitionSettings.content,
              delay: 0.5,
            }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "2rem",
              maxWidth: "1200px",
              width: "100%",
            }}
          >
            {isLoading ? (
              // Loading Skeletons
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  style={{
                    background: "var(--bg-card)",
                    borderRadius: "var(--radius-lg)",
                    padding: "1.5rem",
                    border: "1px solid var(--bg-tertiary)",
                    minHeight: "250px",
                  }}
                >
                  {/* Title Skeleton */}
                  <div
                    style={{
                      height: "24px",
                      background: "var(--bg-tertiary)",
                      borderRadius: "4px",
                      marginBottom: "1rem",
                      width: "70%",
                      animation: "pulse 2s infinite",
                    }}
                  />
                  {/* Description Skeleton */}
                  <div
                    style={{
                      height: "16px",
                      background: "var(--bg-tertiary)",
                      borderRadius: "4px",
                      marginBottom: "0.5rem",
                      width: "100%",
                      animation: "pulse 2s infinite",
                    }}
                  />
                  <div
                    style={{
                      height: "16px",
                      background: "var(--bg-tertiary)",
                      borderRadius: "4px",
                      marginBottom: "1rem",
                      width: "80%",
                      animation: "pulse 2s infinite",
                    }}
                  />
                  {/* Tech tags skeleton */}
                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          height: "20px",
                          background: "var(--bg-tertiary)",
                          borderRadius: "10px",
                          width: `${60 + i * 20}px`,
                          animation: "pulse 2s infinite",
                        }}
                      />
                    ))}
                  </div>
                  {/* Link skeleton */}
                  <div
                    style={{
                      height: "20px",
                      background: "var(--bg-tertiary)",
                      borderRadius: "4px",
                      width: "40%",
                      animation: "pulse 2s infinite",
                    }}
                  />
                </div>
              ))
            ) : (
              // Actual Projects
              projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    background: "var(--bg-card)",
                    borderRadius: "var(--radius-lg)",
                    padding: "1.5rem",
                    border: "1px solid var(--bg-tertiary)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  whileHover={{
                    scale: 1.02,
                    borderColor: "var(--accent-primary)",
                  }}
                  onClick={() => {
                    if (project.Link) window.open(project.Link, "_blank");
                  }}
                >
                  <h3
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "1.25rem",
                      marginBottom: "1rem",
                      fontWeight: "600",
                    }}
                  >
                    {project.Name}
                  </h3>
                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.95rem",
                      lineHeight: "1.6",
                      marginBottom: "1rem",
                    }}
                  >
                    {project.Description}
                  </p>
                  {project.Technologies && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        marginBottom: "1rem",
                      }}
                    >
                      {project.Technologies.split(",").map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          style={{
                            background: "rgba(59, 130, 246, 0.1)",
                            color: "var(--accent-primary)",
                            padding: "0.25rem 0.5rem",
                            borderRadius: "0.5rem",
                            fontSize: "0.8rem",
                            fontWeight: "500",
                          }}
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--accent-primary)",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                      }}
                    >
                      {project.Link ? "View Project →" : "Coming Soon"}
                    </span>
                                         <span
                       style={{
                         fontSize: "0.8rem",
                         padding: "0.25rem 0.5rem",
                         background: project.Status === "Completed" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                         color: project.Status === "Completed" ? "var(--accent-green)" : "var(--accent-warm)",
                         borderRadius: "0.5rem",
                       }}
                    >
                      {project.Status}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectsPage;
