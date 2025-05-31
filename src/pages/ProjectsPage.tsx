import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { fetchProjects, Project } from "../utils/database";
import ProjectCard from "../components/ProjectCard";
import SEOHead from "../components/SEOHead";
import "./ProjectsPage.css";

interface ProjectsPageProps {
  currentPage: number;
}

const ProjectsPage = ({ currentPage }: ProjectsPageProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // SEO structured data
  const projectsPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Projects - Daan Hessen",
    description: "A showcase of projects by Daan Hessen.",
    url: "https://daanhessen.nl/projects",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => ({
        "@type": "CreativeWork",
        position: index + 1,
        name: project.name,
        description: project.description,
        url: project.link,
        dateCreated: project.addedat,
        creator: {
          "@type": "Person",
          name: "Daan Hessen"
        }
      }))
    }
  };

  // Fetch projects on component mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const projectsData = await fetchProjects();
        setProjects(projectsData);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (currentPage === 2) {
      loadProjects();
    }
  }, [currentPage]);

  // Set up intersection observer for card visibility
  useEffect(() => {
    if (!containerRef.current || loading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cardIndex = parseInt(entry.target.getAttribute('data-index') || '0');
          if (entry.isIntersecting) {
            setVisibleCards(prev => new Set([...prev, cardIndex]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    const cards = containerRef.current.querySelectorAll('.project-card-observer');
    cards.forEach(card => observerRef.current?.observe(card));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [projects, loading]);

  // Don't render if not on projects page
  if (currentPage !== 2) {
    return null;
  }

  return (
    <>
      <SEOHead
        title="Projects - Daan Hessen | Full Stack Developer Portfolio"
        description="Explore my latest web development projects featuring React, TypeScript, JavaScript, and modern web technologies. See live demos and detailed project information."
        canonical="https://daanhessen.nl/projects"
        structuredData={projectsPageStructuredData}
      />

      <motion.div
        className="page page-projects"
        initial={{ opacity: 0, y: "100vh" }}
        animate={{ opacity: 1, y: "0vh" }}
        exit={{ opacity: 0, y: "100vh" }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        <div className="projects-container" ref={containerRef}>
          {/* Header Section */}
          <motion.div
            className="projects-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="projects-title">
              <span className="title-accent">{"<"}</span>
              Projects
              <span className="title-accent">{" />"}</span>
            </h1>
            <p className="projects-subtitle">
              A collection of my latest work, featuring modern web technologies and innovative solutions.
            </p>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div
              className="projects-loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="loading-spinner-large"></div>
              <p>Loading projects...</p>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              className="projects-error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="error-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <h3>Oops! Something went wrong</h3>
              <p>{error}</p>
              <button 
                className="retry-button"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </motion.div>
          )}

          {/* Projects Grid */}
          {!loading && !error && projects.length > 0 && (
            <motion.div
              className="projects-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  className="project-card-observer"
                  data-index={index}
                >
                  <ProjectCard
                    project={project}
                    index={index}
                    isVisible={visibleCards.has(index)}
                  />
                </div>
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !error && projects.length === 0 && (
            <motion.div
              className="projects-empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="empty-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <h3>No Projects Yet</h3>
              <p>Projects will appear here once they're added to the database.</p>
            </motion.div>
          )}

          {/* Footer */}
          {!loading && !error && projects.length > 0 && (
            <motion.div
              className="projects-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <p>
                Showing {projects.length} project{projects.length !== 1 ? 's' : ''}
              </p>
              <div className="footer-decoration">
                <span>{"<"}</span>
                <span>/</span>
                <span>{">"}</span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default ProjectsPage; 