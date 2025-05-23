import './globals.css'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import { useState, useEffect } from 'react'

function App() {
  const [titleComplete, setTitleComplete] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      e.preventDefault()
      
      if (e.deltaY > 0 && currentPage === 1) {
        setCurrentPage(2)
      } else if (e.deltaY < 0 && currentPage === 2) {
        setCurrentPage(1)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        if (currentPage === 1) {
          setCurrentPage(2)
        }
      } else if (e.key === 'ArrowUp' || e.key === 'Escape') {
        e.preventDefault()
        if (currentPage === 2) {
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

  useEffect(() => {
    const parallax = document.querySelector('.parallax-background') as HTMLElement
    if (parallax) {
      if (currentPage === 1) {
        parallax.style.transform = 'translateZ(0) scale(1.1)'
      } else {
        parallax.style.transform = 'translateY(-10vh) scale(1.2)'
      }
    }
  }, [currentPage])

  return (
    <div className="app-container">
      <div className="parallax-background"></div>

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
    </div>
  )
}

export default App
