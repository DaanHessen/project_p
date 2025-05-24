import './globals.css'
import HomePage from './pages/HomePage'
import ProjectsPage from './pages/ProjectsPage'
import { useState, useEffect, useRef } from 'react'

function App() {
  const [titleComplete, setTitleComplete] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const lastScrollTime = useRef(0)
  const scrollCooldown = 600 // Reduced for better responsiveness
  const touchStartY = useRef(0)
  const touchEndY = useRef(0)
  const touchStartX = useRef(0)
  const minSwipeDistance = 40 // Increased for more deliberate gestures
  const isHandlingTouch = useRef(false)
  const touchStartTime = useRef(0)

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      e.preventDefault()
      
      const now = Date.now()
      if (now - lastScrollTime.current < scrollCooldown) {
        return
      }
      
      lastScrollTime.current = now
      
      if (e.deltaY > 0) {
        // Scrolling down
        if (currentPage === 1) {
          setCurrentPage(2)
        }
      } else if (e.deltaY < 0) {
        // Scrolling up - FIXED: Allow going back from projects page
        if (currentPage === 2) {
          setCurrentPage(1)
        }
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const now = Date.now()
      if (now - lastScrollTime.current < scrollCooldown) {
        return
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
      // Get the target element
      const target = e.target as Element
      
      // Allow project navigation to handle horizontal swipes
      if (currentPage === 2 && (
        target.closest('.project-card-wrapper') || 
        target.closest('.project-card') ||
        target.closest('.nav-arrow')
      )) {
        return
      }
      
      touchEndY.current = 0
      touchStartY.current = e.touches[0].clientY
      touchStartX.current = e.touches[0].clientX
      touchStartTime.current = Date.now()
      isHandlingTouch.current = false
    }

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as Element
      
      // Don't interfere with project navigation
      if (currentPage === 2 && (
        target.closest('.project-card-wrapper') || 
        target.closest('.project-card') ||
        target.closest('.nav-arrow')
      )) {
        return
      }
      
      const touch = e.touches[0]
      const deltaY = Math.abs(touch.clientY - touchStartY.current)
      const deltaX = Math.abs(touch.clientX - touchStartX.current)
      
      // Only handle if it's primarily a vertical swipe and significant
      if (deltaY > deltaX && deltaY > 30) {
        isHandlingTouch.current = true
        // Prevent default scrolling when we're handling the gesture
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const target = e.changedTouches[0].target as Element
      
      // Don't interfere with project navigation
      if (currentPage === 2 && (
        target.closest('.project-card-wrapper') || 
        target.closest('.project-card') ||
        target.closest('.nav-arrow')
      )) {
        return
      }
      
      if (!touchStartY.current || !isHandlingTouch.current) return
      
      touchEndY.current = e.changedTouches[0].clientY
      const swipeDistance = touchStartY.current - touchEndY.current
      const swipeDistanceX = Math.abs(e.changedTouches[0].clientX - touchStartX.current)
      const touchDuration = Date.now() - touchStartTime.current
      
      const now = Date.now()
      if (now - lastScrollTime.current < scrollCooldown) {
        return
      }

      // Only navigate if vertical swipe is dominant, significant, and not too fast
      if (Math.abs(swipeDistance) > minSwipeDistance && 
          Math.abs(swipeDistance) > swipeDistanceX &&
          touchDuration > 100) { // Prevent accidental swipes
        
        lastScrollTime.current = now
        
        if (swipeDistance > 0) {
          // Swiped up - go to next page
          if (currentPage === 1) {
            setCurrentPage(2)
          }
        } else {
          // Swiped down - go to previous page (FIXED: Allow going back)
          if (currentPage === 2) {
            setCurrentPage(1)
          }
        }
      }
      
      // Reset touch values
      touchStartY.current = 0
      touchEndY.current = 0
      touchStartX.current = 0
      touchStartTime.current = 0
      isHandlingTouch.current = false
    }

    window.addEventListener('wheel', handleScroll, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      window.removeEventListener('wheel', handleScroll)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
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
