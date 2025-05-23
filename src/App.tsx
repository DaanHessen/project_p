import './globals.css'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import AboutPage from './pages/AboutPage'
import { useState, useEffect } from 'react'

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
      
      <ProjectsPage 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      
      <AboutPage 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  )
}

export default App
