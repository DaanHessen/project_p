import './AboutPage.css'
import { motion } from 'framer-motion'

interface AboutPageProps {
  currentPage: number
  setCurrentPage: (page: number) => void
}

const AboutPage = ({ currentPage }: AboutPageProps) => {
  return (
    <motion.div 
      className={`page page-two page-transition`}
      initial={false}
      animate={{
        y: currentPage === 2 ? '0vh' : currentPage === 3 ? '-100vh' : '100vh',
        scale: currentPage === 2 ? 1 : 0.98
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 25,
        mass: 0.8
      }}
    >
      <div className="content-container">
        <div className="about-content">
          <div className="about-header">
            <motion.div 
              className="ascii-title-section"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: currentPage === 2 ? 1 : 0, y: currentPage === 2 ? 0 : 10 }}
              transition={{ delay: currentPage === 2 ? 0.05 : 0, duration: 0.15 }}
            >
              <pre className="ascii-text">
{`    ┌─────────────────────────────────────┐
    │              ABOUT ME               │
    └─────────────────────────────────────┘`}
              </pre>
              <motion.p 
                className="ascii-description"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: currentPage === 2 ? 1 : 0, y: currentPage === 2 ? 0 : 15 }}
                transition={{ delay: currentPage === 2 ? 0.1 : 0, duration: 0.2 }}
              >
                Get to know me, my background, and my journey in technology
              </motion.p>
            </motion.div>
          </div>

          <div className="about-grid">
            <div className="about-left-column">
              <motion.div 
                className="about-section background-section"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: currentPage === 2 ? 1 : 0, y: currentPage === 2 ? 0 : 30 }}
                transition={{ delay: currentPage === 2 ? 0.15 : 0, duration: 0.2 }}
              >
                <h2 className="section-title">Background</h2>
                <p className="section-text">
                My name is Daan Hessen, and I'm 23 years old. I've worked in the restaurant side of the hospitality industry for about 
                seven years now. During that time, I've gained a lot of experience and learned a great deal. But I also discovered that 
                my true passion doesn't lie in hospitality.
                </p>
                <p className="section-text">
                That's why, two years ago, I decided to start studying HBO-ICT at the University of Utrecht. It wasn't a random 
                choice—technology and its rapid development have always fascinated me, and I've always been curious about how things work 
                and why they work the way they do.
                </p>
              </motion.div>

              <motion.div 
                className="about-section learning-section"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: currentPage === 2 ? 1 : 0, y: currentPage === 2 ? 0 : 30 }}
                transition={{ delay: currentPage === 2 ? 0.2 : 0, duration: 0.2 }}
              >
                <h2 className="section-title">Currently Learning & Contact</h2>
                <p className="section-text">
                  I'm currently focused on object-oriented programming, mostly through JavaScript, Java and Python.
                </p>
                <p className="section-text">
                  We're actually in the middle of a big project, where we're building a web-based simulation tool for hydrological pipe modelling.
                  Our client is a professor at the University of Utrecht, for the study of 'Werktuigbouwkunde' (Mechanical Engineering).
                </p>
                <div className="contact-note">
                  <p>
                    <strong>Feel free to reach out!</strong> Feel free to reach out through my email or through my social media platforms!
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="about-right-column">
              <motion.div 
                className="about-section skills-section"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: currentPage === 2 ? 1 : 0, y: currentPage === 2 ? 0 : 30 }}
                transition={{ delay: currentPage === 2 ? 0.25 : 0, duration: 0.2 }}
              >
                <h2 className="section-title">Skills & Technologies</h2>
                <p className="section-text" style={{marginBottom: '1rem', fontStyle: 'italic', color: 'var(--text-comment)'}}>
                  <strong>Note:</strong> I am familiar with these technologies but am still actively learning and far from mastering them as I continue my studies.
                </p>
                <div className="skills-grid">
                  <div className="skill-category">
                    <h3>Programming</h3>
                    <div className="tech-tags">
                      <motion.span 
                        className="tech-tag"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                      >
                        Java
                      </motion.span>
                      <motion.span 
                        className="tech-tag"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                      >
                        JavaScript
                      </motion.span>
                      <motion.span 
                        className="tech-tag"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                      >
                        Python
                      </motion.span>
                    </div>
                  </div>
                  <div className="skill-category">
                    <h3>Frontend</h3>
                    <div className="tech-tags">
                      <motion.span 
                        className="tech-tag"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                      >
                        React
                      </motion.span>
                    </div>
                  </div>
                  <div className="skill-category">
                    <h3>Tools & Others</h3>
                    <div className="tech-tags">
                      <motion.span 
                        className="tech-tag"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                      >
                        Git
                      </motion.span>
                      <motion.span 
                        className="tech-tag"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                      >
                        Vite
                      </motion.span>
                      <motion.span 
                        className="tech-tag"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                      >
                        Figma
                      </motion.span>
                      <motion.span 
                        className="tech-tag"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                      >
                        Vercel
                      </motion.span>
                      <motion.span 
                        className="tech-tag"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                      >
                        SEO Optimization
                      </motion.span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default AboutPage 