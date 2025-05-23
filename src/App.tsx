import './index.css'
import Typewriter from './components/Typewriter'
import { useState, useEffect } from 'react'

function App() {
  const [titleComplete, setTitleComplete] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
  const title = `Daan Hessen`
  
  const subtitle = `// student HBO-ICT at Hogeschool Utrecht`
  const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      e.preventDefault()
      
      if (e.deltaY > 0 && currentPage === 1) {
        // Scrolling down - go to page 2
        setCurrentPage(2)
      } else if (e.deltaY < 0 && currentPage === 2) {
        // Scrolling up - go to page 1
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

  const handleArrowClick = () => {
    if (currentPage === 1) {
      setCurrentPage(2)
    } else {
      setCurrentPage(1)
    }
  }

  return (
    <div className="app-container">
      {/* Fixed Social Media Panel */}
      {titleComplete && (
        <div className="social-media-panel">
          <a href="https://linkedin.com/in/daanhessen" target="_blank" rel="noopener noreferrer" className="social-icon linkedin">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          
          <a href="mailto:daan@example.com" className="social-icon email">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.957L12 11.365 21.407 3.82h.957c.904 0 1.636.733 1.636 1.637Z"/>
            </svg>
          </a>
          
          <a href="https://instagram.com/daanhessen" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.40z"/>
            </svg>
          </a>
          
          <a href="https://github.com/daanhessen" target="_blank" rel="noopener noreferrer" className="social-icon github">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          
          <button 
            onClick={handleArrowClick} 
            className={`scroll-arrow ${currentPage === 2 ? 'rotate' : ''}`}
            title={currentPage === 1 ? 'Go to Projects' : 'Back to Top'}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6-6-6 1.41-1.42z"/>
            </svg>
          </button>
        </div>
      )}

      <div className={`page page-one ${currentPage === 2 ? 'slide-up' : ''}`}>
        <div className="content-container">
          <div className="main-content">
            <Typewriter 
              text={title}
              speed={30}
              onComplete={() => setTitleComplete(true)}
              className="title"
            />
            
            {titleComplete && (
              <>
                <div className="subtitle fade-in">
                  {subtitle}
                </div>
                
                <div className="description fade-in-delayed">
                  {description}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className={`page page-two ${currentPage === 2 ? 'slide-in' : ''}`}>
        <div className="content-container">
          <div className="coming-soon">
            <h1>Projects & Experience</h1>
            <p>Portfolio showcase coming soon...</p>
            <button onClick={() => setCurrentPage(1)} className="back-button">
              ↑ Back to Top
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
