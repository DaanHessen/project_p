import './SocialMediaPanel.css'
import { motion } from 'framer-motion'

interface SocialMediaPanelProps {
  currentPage: number
  onArrowClick: () => void
}

const SocialMediaPanel = ({ currentPage, onArrowClick }: SocialMediaPanelProps) => {
  return (
    <motion.div 
      className="social-media-panel"
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ 
        delay: 0.3, 
        duration: 0.6,
        type: "spring",
        stiffness: 200,
        damping: 25
      }}
    >
      <motion.a 
        href="https://linkedin.com/in/daanhessen" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="social-icon linkedin"
        title="Go to LinkedIn"
        whileHover={{ 
          scale: 1.1, 
          rotate: 5,
          transition: { duration: 0.1, type: "spring", stiffness: 400 }
        }}
        whileTap={{ scale: 0.9 }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </motion.a>

      <motion.a 
        href="https://instagram.com/daanhessen_" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="social-icon instagram"
        title="Follow me on Instagram"
        whileHover={{ 
          scale: 1.1, 
          rotate: -5,
          transition: { duration: 0.1, type: "spring", stiffness: 400 }
        }}
        whileTap={{ scale: 0.9 }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </motion.a>
      
      <motion.a 
        href="mailto:daanh2002@gmail.com" 
        className="social-icon email"
        title="Send me an Email"
        whileHover={{ 
          scale: 1.1, 
          rotate: 5,
          transition: { duration: 0.1, type: "spring", stiffness: 400 }
        }}
        whileTap={{ scale: 0.9 }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.957L12 11.365 21.407 3.82h.957c.904 0 1.636.733 1.636 1.637Z"/>
        </svg>
      </motion.a>

      <motion.a 
        href="https://buymeacoffee.com/daanhessen" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="social-icon coffee"
        title="Buy Me a Coffee"
        whileHover={{ 
          scale: 1.1, 
          rotate: -5,
          transition: { duration: 0.1, type: "spring", stiffness: 400 }
        }}
        whileTap={{ scale: 0.9 }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-.766-1.587l-.755-.755a2.93 2.93 0 00-2.076-.862H7.727c-.776 0-1.516.304-2.076.862l-.755.755a2.93 2.93 0 00-.766 1.587l-.132.666-.132.666c-.119.598-.119 1.219 0 1.817l.132.666.132.666c.119.598.388 1.163.766 1.587l.755.755c.56.558 1.3.862 2.076.862h8.488c.776 0 1.516-.304 2.076-.862l.755-.755a2.93 2.93 0 00.766-1.587l.132-.666.132-.666c.119-.598.119-1.219 0-1.817l-.132-.666zM6.984 16.329c0 .663.537 1.2 1.2 1.2s1.2-.537 1.2-1.2-.537-1.2-1.2-1.2-1.2.537-1.2 1.2zm9.6 0c0 .663.537 1.2 1.2 1.2s1.2-.537 1.2-1.2-.537-1.2-1.2-1.2-1.2.537-1.2 1.2z"/>
        </svg>
      </motion.a>

      <motion.a 
        href="tel:+31642872646" 
        className="social-icon phone"
        title="Call me at +31 6 4287 2646"
        whileHover={{ 
          scale: 1.1, 
          rotate: 5,
          transition: { duration: 0.1, type: "spring", stiffness: 400 }
        }}
        whileTap={{ scale: 0.9 }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
        </svg>
      </motion.a>
      
      <motion.a 
        href="https://github.com/daanhessen" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="social-icon github"
        title="Go to GitHub"
        whileHover={{ 
          scale: 1.1, 
          rotate: -5,
          transition: { duration: 0.1, type: "spring", stiffness: 400 }
        }}
        whileTap={{ scale: 0.9 }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"/>
        </svg>
      </motion.a>
      
      <motion.button 
        onClick={onArrowClick} 
        className={`scroll-arrow`}
        title={
          currentPage === 1 ? 'Learn About Me' : 
          currentPage === 2 ? 'Explore Projects & Experience' : 
          'Return to Homepage'
        }
        whileHover={{ 
          scale: 1.15, 
          y: -2,
          transition: { duration: 0.1, type: "spring", stiffness: 500 }
        }}
        whileTap={{ scale: 0.9 }}
        animate={{
          rotate: currentPage === 3 ? 180 : 0,
          scale: 1
        }}
        transition={{
          duration: 0.2,
          type: "spring",
          stiffness: 400,
          damping: 30
        }}
      >
        <motion.svg 
          viewBox="0 0 24 24" 
          fill="currentColor"
          animate={{
            y: currentPage === 1 ? [0, 1, 0] : 0
          }}
          transition={{
            duration: 1.5,
            repeat: currentPage === 1 ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          <path d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6-6-6 1.41-1.42z"/>
        </motion.svg>
      </motion.button>
    </motion.div>
  )
}

export default SocialMediaPanel 