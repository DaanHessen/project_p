import SocialMediaPanel from '../components/SocialMediaPanel'
import './HomePage.css'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface HomePageProps {
  currentPage: number
  setCurrentPage: (page: number) => void
  titleComplete: boolean
  setTitleComplete: (complete: boolean) => void
}

const HomePage = ({ currentPage, setCurrentPage, titleComplete, setTitleComplete }: HomePageProps) => {
  const [typingComplete, setTypingComplete] = useState(false)
  
  const description = `I'm Daan Hessen, 23 years old, with seven years of experience in the hospitality industry. While I gained valuable skills there, I discovered my true passion lies in technology. Two years ago, I started studying HBO-ICT at Hogeschool Utrecht, driven by my fascination with technology's rapid development and my curiosity about how things work. Currently focused on object-oriented programming through JavaScript, Java, and Python.`

  const asciiArt = `██████╗  █████╗  █████╗ ███╗   ██╗    ██╗  ██╗███████╗███████╗███████╗███████╗███╗   ██╗
██╔══██╗██╔══██╗██╔══██╗████╗  ██║    ██║  ██║██╔════╝██╔════╝██╔════╝██╔════╝████╗  ██║
██║  ██║███████║███████║██╔██╗ ██║    ███████║█████╗  ███████╗███████╗█████╗  ██╔██╗ ██║
██║  ██║██╔══██║██╔══██║██║╚██╗██║    ██╔══██║██╔══╝  ╚════██║╚════██║██╔══╝  ██║╚██╗██║
██████╔╝██║  ██║██║  ██║██║ ╚████║    ██║  ██║███████╗███████║███████║███████╗██║ ╚████║
╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝    ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═══╝`

  // Split ASCII art into lines for individual animation
  const asciiLines = asciiArt.split('\n')

  // Calculate total ASCII animation duration
  const totalAsciiDuration = (asciiLines.length * 0.1) + (asciiLines[0].length * 0.003) + 0.6

  useEffect(() => {
    const timer = setTimeout(() => {
      setTitleComplete(true)
      // Set typing complete immediately when ASCII animation finishes
      setTimeout(() => setTypingComplete(true), totalAsciiDuration * 1000)
    }, 100)
    return () => clearTimeout(timer)
  }, [setTitleComplete, totalAsciiDuration])

  const handleArrowClick = () => {
    if (currentPage === 1) {
      setCurrentPage(2)
    } else {
      setCurrentPage(1)
    }
  }

  return (
    <>
      {titleComplete && (
        <SocialMediaPanel 
          currentPage={currentPage}
          onArrowClick={handleArrowClick}
        />
      )}

      <motion.div 
        className={`page page-one page-transition ${currentPage >= 2 ? 'page-slide-up' : ''}`}
        initial={false}
        animate={{
          y: currentPage >= 2 ? '-100vh' : '0vh',
          scale: currentPage >= 2 ? 0.95 : 1
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 30,
          mass: 0.8
        }}
      >
        <div className="content-container">
          <div className="main-content">
            <motion.div 
              className="ascii-art-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <pre className="ascii-text">
                {asciiLines.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                    style={{ 
                      display: 'block',
                      transformOrigin: 'center',
                    }}
                  >
                    {line.split('').map((char, charIndex) => (
                      <motion.span
                        key={charIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.02,
                          delay: (index * 0.1) + (charIndex * 0.003),
                          ease: "easeOut"
                        }}
                        style={{ display: 'inline-block' }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </motion.div>
                ))}
              </pre>
            </motion.div>

            <motion.div 
              className="description-section"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: typingComplete ? 1 : 0, y: typingComplete ? 0 : 30 }}
              transition={{ 
                duration: 0.8, 
                delay: 0,
                ease: "easeOut" 
              }}
            >
              <p className="description-text">{description}</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default HomePage 