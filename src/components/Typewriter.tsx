import { useState, useEffect, useRef } from 'react'

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
  speed = 80, 
  delay = 0, 
  className = '', 
  showCursor = true,
  onComplete 
}: TypewriterProps) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Reset state when text changes
    setDisplayedText('')
    setIsComplete(false)
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    const startTyping = () => {
      intervalRef.current = setInterval(() => {
        setDisplayedText((prevText) => {
          if (prevText.length < text.length) {
            return text.slice(0, prevText.length + 1)
          } else {
            setIsComplete(true)
            onComplete?.()
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
            }
            return prevText
          }
        })
      }, speed + Math.random() * 20) // Add slight randomness for more human-like typing
    }

    const timeoutId = setTimeout(startTyping, delay)
    
    return () => {
      clearTimeout(timeoutId)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [text, speed, delay, onComplete])

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