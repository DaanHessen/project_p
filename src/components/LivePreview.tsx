import './LivePreview.css'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface LivePreviewProps {
  url: string
  title: string
}

const LivePreview = ({ url, title }: LivePreviewProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoaded(true)
  }

  return (
    <div className="live-preview-container">
      <div className="preview-header">
        <div className="browser-controls">
          <div className="control-dot red"></div>
          <div className="control-dot yellow"></div>
          <div className="control-dot green"></div>
        </div>
        <div className="address-bar">
          <span className="url-text">{url}</span>
        </div>
      </div>
      
      <div className="preview-content" onClick={handleClick}>
        {!isLoaded && !hasError && (
          <div className="preview-loading">
            <div className="loading-spinner"></div>
            <p>Loading preview...</p>
          </div>
        )}
        
        {hasError ? (
          <div className="preview-error">
            <div className="error-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17A1.5,1.5 0 0,1 10.5,15.5A1.5,1.5 0 0,1 12,14A1.5,1.5 0 0,1 13.5,15.5A1.5,1.5 0 0,1 12,17M12,10A1,1 0 0,1 13,11V13A1,1 0 0,1 12,14A1,1 0 0,1 11,13V11A1,1 0 0,1 12,10Z"/>
              </svg>
            </div>
            <p>Preview unavailable</p>
            <span>Click to visit site</span>
          </div>
        ) : (
          <iframe
            src={url}
            title={`Preview of ${title}`}
            onLoad={handleLoad}
            onError={handleError}
            className={`preview-iframe ${isLoaded ? 'loaded' : ''}`}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )}
        
        <motion.div 
          className="preview-overlay"
          whileHover={{ opacity: 1 }}
          initial={{ opacity: 0 }}
        >
          <div className="overlay-content">
            <div className="visit-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
              </svg>
            </div>
            <span>Click to visit site</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default LivePreview 