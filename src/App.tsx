import './globals.css'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import { useState, useEffect, useRef } from 'react'

function App() {
  const [titleComplete, setTitleComplete] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const lastScrollTime = useRef(0)
  const scrollCooldown = 800 // ms
  const touchStartY = useRef(0)
  const touchEndY = useRef(0)
  const minSwipeDistance = 30 // Reduced minimum distance for better responsiveness

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
        }
        // Block scrolling past page 2
      } else if (e.deltaY < 0) {
        // Scrolling up - ensure proper sequence
        if (currentPage === 2) {
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
        }
      } else if (e.key === 'ArrowUp' || e.key === 'Escape') {
        e.preventDefault()
        lastScrollTime.current = now
        if (currentPage === 2) {
          setCurrentPage(1)
        }
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      // Reset end position to ensure clean start
      touchEndY.current = 0
      touchStartY.current = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartY.current) return
      
      touchEndY.current = e.changedTouches[0].clientY
      const swipeDistance = touchStartY.current - touchEndY.current
      
      const now = Date.now()
      if (now - lastScrollTime.current < scrollCooldown) {
        return // Debounce rapid touches
      }

      // Swipe up (swipeDistance > 0) = next page
      // Swipe down (swipeDistance < 0) = previous page
      if (Math.abs(swipeDistance) > minSwipeDistance) {
        lastScrollTime.current = now
        
        if (swipeDistance > 0) {
          // Swiped up - go to next page
          if (currentPage === 1) {
            setCurrentPage(2)
          }
        } else {
          // Swiped down - go to previous page
          if (currentPage === 2) {
            setCurrentPage(1)
          }
        }
      }
      
      // Reset touch values
      touchStartY.current = 0
      touchEndY.current = 0
    }

    window.addEventListener('wheel', handleScroll, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleScroll)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
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
      
      <ProjectsPage 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  )
}

export default App
