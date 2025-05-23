import { useState, useEffect } from 'react'
import './ProjectsPage.css'
import { motion } from 'framer-motion'
import LivePreview from '../components/LivePreview'

interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  image: string
  liveUrl: string
  codeUrl: string
}

interface ProjectsPageProps {
  currentPage: number
  setCurrentPage: (page: number) => void
}

const ProjectsPage = ({ currentPage }: ProjectsPageProps) => {
  const [projects, setProjects] = useState<Project[]>([])

  const projectsAsciiArt = ` *******  *******     *******        ** ********   ******  **********  ********
/**////**/**////**   **/////**      /**/**/////   **////**/////**///  **////// 
/**   /**/**   /**  **     //**     /**/**       **    //     /**    /**       
/******* /*******  /**      /**     /**/******* /**           /**    /*********
/**////  /**///**  /**      /**     /**/**////  /**           /**    ////////**
/**      /**  //** //**     **  **  /**/**      //**    **    /**           /**
/**      /**   //** //*******  //***** /******** //******     /**     ******** 
//       //     //   ///////    /////  ////////   //////      //     ////////`

  useEffect(() => {
    import('../data/projects.json')
      .then(data => setProjects(data.default || data))
      .catch(err => console.error('Error loading projects:', err))
  }, [])

  return (
    <motion.div 
      className={`page page-two page-transition`}
      initial={false}
      animate={{
        y: currentPage === 2 ? '0vh' : '100vh',
        scale: currentPage === 2 ? 1 : 0.98
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
        mass: 0.8
      }}
    >
      <div className="content-container">
        <div className="projects-content">
          <div className="projects-header">
            <motion.div 
              className="ascii-title-section"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: currentPage === 2 ? 1 : 0, y: currentPage === 2 ? 0 : 20, scale: currentPage === 2 ? 1 : 0.9 }}
              transition={{ delay: currentPage === 2 ? 0.1 : 0, duration: 0.2 }}
            >
              <pre className="ascii-text">
{projectsAsciiArt}
              </pre>
              <motion.p 
                className="ascii-description"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: currentPage === 2 ? 1 : 0, y: currentPage === 2 ? 0 : 15 }}
                transition={{ delay: currentPage === 2 ? 0.15 : 0, duration: 0.2 }}
              >
                View my projects, check the source code, or see what I've been working on. Also includes various school-related projects.
              </motion.p>
            </motion.div>
          </div>

          {projects.length > 0 ? (
            <motion.div 
              className="projects-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: currentPage === 2 ? 1 : 0 }}
              transition={{ delay: currentPage === 2 ? 0.2 : 0, duration: 0.2 }}
            >
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="project-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ 
                    opacity: currentPage === 2 ? 1 : 0, 
                    y: currentPage === 2 ? 0 : 30 
                  }}
                  transition={{ 
                    delay: currentPage === 2 ? 0.25 + (index * 0.05) : 0, 
                    duration: 0.2 
                  }}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.15 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="card-header">
                    <h3 className="project-title">{project.title}</h3>
                    <div className="card-actions">
                      <motion.a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn live-btn"
                        title="View Live Site"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.1 }}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                        </svg>
                      </motion.a>
                      
                      <motion.a
                        href={project.codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn code-btn"
                        title="View Source Code"
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.1 }}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
                        </svg>
                      </motion.a>
                    </div>
                  </div>

                  <p className="project-description">{project.description}</p>

                  <LivePreview url={project.liveUrl} title={project.title} />

                  <div className="tech-stack">
                    {project.tech.map((tech, techIndex) => (
                      <motion.span
                        key={techIndex}
                        className="tech-tag"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="loading-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: currentPage === 2 ? 1 : 0 }}
              transition={{ delay: 0.2, duration: 0.2 }}
            >
              <div className="loading-spinner"></div>
              <p>Loading projects...</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectsPage 