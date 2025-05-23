import './globals.css'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import AboutPage from './pages/AboutPage'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function App() {
  const [titleComplete, setTitleComplete] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      e.preventDefault()
      
      if (e.deltaY > 0) {
        // Scrolling down
        if (currentPage === 1) {
          setCurrentPage(2)
        } else if (currentPage === 2) {
          setCurrentPage(3)
        }
      } else if (e.deltaY < 0) {
        // Scrolling up
        if (currentPage === 3) {
          setCurrentPage(2)
        } else if (currentPage === 2) {
          setCurrentPage(1)
        }
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        if (currentPage === 1) {
          setCurrentPage(2)
        } else if (currentPage === 2) {
          setCurrentPage(3)
        }
      } else if (e.key === 'ArrowUp' || e.key === 'Escape') {
        e.preventDefault()
        if (currentPage === 3) {
          setCurrentPage(2)
        } else if (currentPage === 2) {
          setCurrentPage(1)
        }
      }
    }

    window.addEventListener('wheel', handleScroll, { passive: false })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('wheel', handleScroll)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentPage])

  return (
    <div className="app-container">
      <HomePage 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        titleComplete={titleComplete}
        setTitleComplete={setTitleComplete}
      />
      
      <AboutPage 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      
      <ProjectsPage 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Page Indicator */}
      <motion.div 
        className="page-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: titleComplete ? 1 : 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        {[1, 2, 3].map((page) => (
          <motion.div
            key={page}
            className={`indicator-dot ${currentPage === page ? 'active' : ''}`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentPage(page)}
          />
        ))}
      </motion.div>
    </div>
  )
}

export default App
