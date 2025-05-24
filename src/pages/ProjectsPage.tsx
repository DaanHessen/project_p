import { useState, useEffect, useCallback, useRef } from 'react'
import './ProjectsPage.css'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const touchStartRef = useRef({ x: 0, y: 0 })
  const touchEndRef = useRef({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)

  const projectsAsciiArt = `██████╗ ██████╗  ██████╗      ██╗███████╗ ██████╗████████╗███████╗
██╔══██╗██╔══██╗██╔═══██╗     ██║██╔════╝██╔════╝╚══██╔══╝██╔════╝
██████╔╝██████╔╝██║   ██║     ██║█████╗  ██║        ██║   ███████╗
██╔═══╝ ██╔══██╗██║   ██║██   ██║██╔══╝  ██║        ██║   ╚════██║
██║     ██║  ██║╚██████╔╝╚█████╔╝███████╗╚██████╗   ██║   ███████║
╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝   ╚══════╝`

  useEffect(() => {
    import('../data/projects.json')
      .then(data => setProjects(data.default || data))
      .catch(err => console.error('Error loading projects:', err))
  }, [])

  const navigateProject = useCallback((direction: 'prev' | 'next') => {
    if (projects.length === 0) return
    
    setCurrentProjectIndex(prev => {
      if (direction === 'next') {
        return (prev + 1) % projects.length
      } else {
        return prev === 0 ? projects.length - 1 : prev - 1
      }
    })
  }, [projects.length])

  // Enhanced touch handling for project navigation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (currentPage !== 2) return
    
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
    touchEndRef.current = { x: touch.clientX, y: touch.clientY }
    isDraggingRef.current = false
  }, [currentPage])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (currentPage !== 2) return
    
    const touch = e.touches[0]
    touchEndRef.current = { x: touch.clientX, y: touch.clientY }
    
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x)
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y)
    
    // If horizontal swipe is detected, prevent page scrolling
    if (deltaX > deltaY && deltaX > 20) {
      e.preventDefault()
      isDraggingRef.current = true
    }
  }, [currentPage])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (currentPage !== 2 || !isDraggingRef.current) return
    
    const deltaX = touchEndRef.current.x - touchStartRef.current.x
    const deltaY = Math.abs(touchEndRef.current.y - touchStartRef.current.y)
    
    // Only navigate if horizontal swipe is dominant and significant
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
      e.preventDefault()
      e.stopPropagation()
      
      if (deltaX > 0) {
        navigateProject('prev')
      } else {
        navigateProject('next')
      }
    }
    
    isDraggingRef.current = false
  }, [currentPage, navigateProject])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentPage !== 2) return
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        navigateProject('prev')
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        navigateProject('next')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, navigateProject])

  return (
    <motion.div 
      className={`page page-two page-transition`}
      initial={false}
      animate={{
        y: currentPage === 2 ? '0vh' : '100vh',
        scale: currentPage === 2 ? 1 : 0.95
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 30,
        mass: 0.8
      }}
    >
      <div className="content-container">
        <div className="projects-content">
          <motion.div 
            className="projects-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: currentPage === 2 ? 1 : 0, y: currentPage === 2 ? 0 : -20 }}
            transition={{ delay: currentPage === 2 ? 0.1 : 0, duration: 0.4 }}
          >
            <div className="ascii-title-section">
              <pre className="ascii-text">
{projectsAsciiArt}
              </pre>
            </div>
          </motion.div>

          {projects.length > 0 ? (
            <div className="project-showcase">
              {/* Navigation arrows - positioned to match card height */}
              <motion.button
                className="nav-arrow nav-arrow-prev"
                onClick={() => navigateProject('prev')}
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: currentPage === 2 ? 1 : 0, x: currentPage === 2 ? 0 : -20 }}
                transition={{ delay: currentPage === 2 ? 0.2 : 0, duration: 0.3 }}
                disabled={projects.length <= 1}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12Z"/>
                </svg>
              </motion.button>

              <motion.button
                className="nav-arrow nav-arrow-next"
                onClick={() => navigateProject('next')}
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: currentPage === 2 ? 1 : 0, x: currentPage === 2 ? 0 : 20 }}
                transition={{ delay: currentPage === 2 ? 0.2 : 0, duration: 0.3 }}
                disabled={projects.length <= 1}
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.59 16.59L10 18L16 12L10 6L8.59 7.41L13.17 12Z"/>
                </svg>
              </motion.button>

              {/* Main project card with enhanced touch handling */}
              <div 
                className="project-card-wrapper"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`project-${currentProjectIndex}`}
                    className="project-card"
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.98 }}
                    transition={{ 
                      duration: 0.4,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                  >
                    {projects[currentProjectIndex] && (
                      <>
                        {/* Card Header - Improved alignment */}
                        <div className="project-header">
                          <div className="project-meta">
                            <motion.h2 
                              className="project-title"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.05, duration: 0.3 }}
                            >
                              {projects[currentProjectIndex].title}
                            </motion.h2>
                            <motion.div 
                              className="project-counter"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.1, duration: 0.3 }}
                            >
                              {String(currentProjectIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                            </motion.div>
                          </div>
                          
                          <motion.p 
                            className="project-description"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                          >
                            {projects[currentProjectIndex].description}
                          </motion.p>
                        </div>

                        {/* Live Preview - Enhanced */}
                        <motion.div 
                          className="project-preview"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.15, duration: 0.4 }}
                        >
                          <div className="preview-container">
                            <LivePreview 
                              url={projects[currentProjectIndex].liveUrl} 
                              title={projects[currentProjectIndex].title} 
                            />
                            <div className="preview-overlay">
                              <motion.a
                                href={projects[currentProjectIndex].liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="preview-action"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <span>View Website</span>
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                                </svg>
                              </motion.a>
                            </div>
                          </div>
                        </motion.div>

                        {/* Tech Stack & Actions - Improved layout */}
                        <motion.div 
                          className="project-footer"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.3 }}
                        >
                          <div className="tech-stack">
                            <span className="tech-label">Built with:</span>
                            <div className="tech-tags">
                              {projects[currentProjectIndex].tech.map((tech, techIndex) => (
                                <motion.span 
                                  key={`${tech}-${techIndex}`}
                                  className="tech-tag"
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ 
                                    delay: 0.25 + (techIndex * 0.03), 
                                    duration: 0.3,
                                    type: "spring",
                                    stiffness: 200
                                  }}
                                >
                                  {tech}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="project-actions">
                            <motion.a
                              href={projects[currentProjectIndex].codeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="action-button secondary"
                              whileHover={{ scale: 1.02, y: -1 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
                              </svg>
                              <span>Source Code</span>
                            </motion.a>
                          </div>
                        </motion.div>

                        {/* Mobile swipe indicator - Enhanced visibility */}
                        <motion.div 
                          className="mobile-swipe-indicator"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: currentPage === 2 ? 1 : 0, y: currentPage === 2 ? 0 : 10 }}
                          transition={{ delay: 0.8, duration: 0.6 }}
                        >
                          <span className="swipe-text">← Swipe to navigate projects →</span>
                          <div className="swipe-animation">
                            <motion.div 
                              className="swipe-dot"
                              animate={{ x: [-12, 12, -12] }}
                              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                            />
                          </div>
                        </motion.div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <motion.div 
              className="loading-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: currentPage === 2 ? 1 : 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>Loading projects...</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectsPage 