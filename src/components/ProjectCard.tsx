import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Project } from "../utils/database";
import "./ProjectCard.css";

interface ProjectCardProps {
  project: Project;
  index: number;
  isVisible: boolean;
}

const ProjectCard = ({ project, index, isVisible }: ProjectCardProps) => {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Parse technologies string into array
  const technologies = project.technologies
    ? project.technologies.split(',').map(tech => tech.trim())
    : [];

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'var(--accent-green)';
      case 'in development':
        return 'var(--accent-warm)';
      case 'planning':
        return 'var(--accent-purple)';
      default:
        return 'var(--accent-primary)';
    }
  };

  // Preload iframe when card becomes visible
  useEffect(() => {
    if (isVisible && !showIframe && project.link) {
      const timer = setTimeout(() => {
        setShowIframe(true);
      }, index * 200); // Stagger iframe loading

      return () => clearTimeout(timer);
    }
  }, [isVisible, showIframe, project.link, index]);

  const handleIframeLoad = () => {
    setIsIframeLoaded(true);
  };

  const handleCardClick = () => {
    if (project.link) {
      window.open(project.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.div
      className="project-card"
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      onClick={handleCardClick}
    >
      <div className="project-card-inner">
        {/* Website Preview */}
        <div className="project-preview">
          {showIframe && project.link ? (
            <>
              <iframe
                ref={iframeRef}
                src={project.link}
                title={`${project.name} preview`}
                onLoad={handleIframeLoad}
                className={`project-iframe ${isIframeLoaded ? 'loaded' : ''}`}
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
              {!isIframeLoaded && (
                <div className="iframe-loading">
                  <div className="loading-spinner"></div>
                  <span>Loading preview...</span>
                </div>
              )}
            </>
          ) : (
            <div className="preview-placeholder">
              <div className="placeholder-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <span>Preview Loading...</span>
            </div>
          )}
          
          {/* Overlay for click interaction */}
          <div className="preview-overlay">
            <div className="overlay-content">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m9 18 6-6-6-6"/>
              </svg>
              <span>Visit Site</span>
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div className="project-info">
          <div className="project-header">
            <h3 className="project-name">{project.name}</h3>
            <div 
              className="project-status"
              style={{ '--status-color': getStatusColor(project.status) } as React.CSSProperties}
            >
              {project.status}
            </div>
          </div>

          <p className="project-description">{project.description}</p>

          {/* Technologies */}
          {technologies.length > 0 && (
            <div className="project-technologies">
              {technologies.map((tech, techIndex) => (
                <span key={techIndex} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="project-footer">
            <span className="project-date">
              {formatDate(project.addedat)}
            </span>
            {project.link && (
              <div className="project-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15,3 21,3 21,9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard; 