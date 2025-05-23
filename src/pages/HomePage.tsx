import SocialMediaPanel from '../components/SocialMediaPanel'
import './HomePage.css'
import { motion } from 'framer-motion'
import { useEffect } from 'react'

interface HomePageProps {
  currentPage: number
  setCurrentPage: (page: number) => void
  titleComplete: boolean
  setTitleComplete: (complete: boolean) => void
}

const HomePage = ({ currentPage, setCurrentPage, titleComplete, setTitleComplete }: HomePageProps) => {
  const title = `Daan Hessen`
  const subtitle = `student HBO-ICT at Hogeschool Utrecht`
  const description = `2nd year student at HBO-ICT, specializing in software development. Passionate about building web applications and exploring new technologies. Feel free to contact me through email or social media!`

  const asciiArt = `     ____  __  __
    / __ \\/ / / /
   / / / / /_/ / 
  / /_/ / __  /  
 /_____/_/ /_/   
                `

  // Immediately set title complete for faster loading
  useEffect(() => {
    const timer = setTimeout(() => setTitleComplete(true), 100)
    return () => clearTimeout(timer)
  }, [setTitleComplete])

  const handleArrowClick = () => {
    if (currentPage === 1) {
      setCurrentPage(2)
    } else if (currentPage === 2) {
      setCurrentPage(3)
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
          scale: currentPage >= 2 ? 0.98 : 1
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25,
          mass: 0.8
        }}
      >
        <div className="content-container">
          <div className="main-content">
            <motion.div 
              className="ascii-art"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.2, 
                ease: "easeOut" 
              }}
            >
              <pre className="ascii-text">
{asciiArt}
              </pre>
            </motion.div>

            <motion.h1
              className="title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.25, 
                delay: 0.1,
                ease: "easeOut" 
              }}
            >
              {title}
            </motion.h1>
            
            <motion.div 
              className="subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.2, 
                delay: 0.15,
                ease: "easeOut" 
              }}
            >
              {subtitle}
            </motion.div>
            
            <motion.div 
              className="description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.2, 
                delay: 0.2,
                ease: "easeOut" 
              }}
            >
              {description}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default HomePage 