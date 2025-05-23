import './globals.css'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import AboutPage from './pages/AboutPage'
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

function App() {
  const [titleComplete, setTitleComplete] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const lastScrollTime = useRef(0)
  const scrollCooldown = 800 // ms

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      e.preventDefault()
      
      const now = Date.now()
      if (now - lastScrollTime.current < scrollCooldown) {
        return // Debounce rapid scrolling
      }
      
      lastScrollTime.current = now
      
      if (e.deltaY > 0) {
        // Scrolling down - ensure proper sequence
        if (currentPage === 1) {
          setCurrentPage(2)
        } else if (currentPage === 2) {
          setCurrentPage(3)
        }
        // Block scrolling past page 3
      } else if (e.deltaY < 0) {
        // Scrolling up - ensure proper sequence
        if (currentPage === 3) {
          setCurrentPage(2)
        } else if (currentPage === 2) {
          setCurrentPage(1)
        }
        // Block scrolling past page 1
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now()
      if (now - lastScrollTime.current < scrollCooldown) {
        return // Debounce rapid key presses
      }
      
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        lastScrollTime.current = now
        if (currentPage === 1) {
          setCurrentPage(2)
        } else if (currentPage === 2) {
          setCurrentPage(3)
        }
      } else if (e.key === 'ArrowUp' || e.key === 'Escape') {
        e.preventDefault()
        lastScrollTime.current = now
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
  }, [currentPage, scrollCooldown])

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
        className="page-indicator gpu-accelerated"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: titleComplete ? 1 : 0, y: titleComplete ? 0 : 20 }}
        transition={{ 
          delay: titleComplete ? 0.3 : 0, 
          duration: 0.3,
          type: "spring",
          stiffness: 200,
          damping: 25
        }}
      >
        {[1, 2, 3].map((page) => (
          <motion.div
            key={page}
            className={`indicator-dot ${currentPage === page ? 'active' : ''}`}
            whileHover={{ 
              scale: currentPage === page ? 1 : 1.2,
              transition: { duration: 0.2, type: "spring", stiffness: 400 }
            }}
            whileTap={{ 
              scale: 0.9,
              transition: { duration: 0.1 }
            }}
            onClick={() => setCurrentPage(page)}
            animate={{
              scale: currentPage === page ? 1 : 1,
            }}
            transition={{ 
              duration: 0.25,
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}

export default App
