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
  const description = `I'm Daan Hessen, 23 years old, with seven years of experience in the hospitality industry. While I gained valuable skills there, I discovered my true passion lies in technology. Two years ago, I started studying HBO-ICT at Hogeschool Utrecht, driven by my fascination with technology's rapid development and my curiosity about how things work. Currently focused on object-oriented programming through JavaScript, Java, and Python.`

  const asciiArt = `    ____                   __  __                       
   / __ \\____ _____ _____  / / / /__  ______________  ____ 
  / / / / __ \`/ __ \`/ __ \\/ /_/ / _ \\/ ___/ ___/ _ \\/ __ \\
 / /_/ / /_/ / /_/ / / / / __  /  __(__  |__  )  __/ / / /
/_____/\\__,_/\\__,_/_/ /_/_/ /_/\\___/____/____/\\___/_/ /_/ 
                                                         `

  // Immediately set title complete for faster loading
  useEffect(() => {
    const timer = setTimeout(() => setTitleComplete(true), 100)
    return () => clearTimeout(timer)
  }, [setTitleComplete])

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