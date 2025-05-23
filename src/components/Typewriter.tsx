import { useState, useEffect, useRef, useCallback } from 'react'

type TypewriterProps = {
  text: string
  speed?: number
  delay?: number
  className?: string
  showCursor?: boolean
  onComplete?: () => void
}

const Typewriter = ({ 
  text, 
  speed = 50, 
  delay = 0, 
  className = '', 
  showCursor = true,
  onComplete 
}: TypewriterProps) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    // Reset state when text changes
    setDisplayedText('')
    setIsComplete(false)
    cleanup()
    
    if (!text) return

    const startTyping = () => {
      let currentIndex = 0
      
      intervalRef.current = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          setIsComplete(true)
          onComplete?.()
          cleanup()
        }
      }, speed + Math.random() * 10)
    }

    // Start typing after delay
    timeoutRef.current = setTimeout(startTyping, delay)

    // Cleanup on unmount or text change
    return cleanup
  }, [text, speed, delay, onComplete, cleanup])

  return (
    <div className={`typewriter ${className}`} data-text={text}>
      <span className="typewriter-text">
        {displayedText}
      </span>
      {showCursor && (
        <span 
          className={`cursor ${isComplete ? 'cursor-idle' : 'cursor-typing'}`}
        />
      )}
    </div>
  )
}

export default Typewriter 