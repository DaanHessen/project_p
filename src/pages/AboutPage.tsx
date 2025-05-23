import './AboutPage.css'
import { motion } from 'framer-motion'

interface AboutPageProps {
  currentPage: number
  setCurrentPage: (page: number) => void
}

const AboutPage = ({ currentPage }: AboutPageProps) => {
  const aboutAsciiArt = `    ___    __                   __ 
   /   |  / /_  ____  __  __  / /_
  / /| | / __ \\/ __ \\/ / / / / __/
 / ___ |/ /_/ / /_/ / /_/ / / /_  
/_/  |_/_.___/\\____/\\__,_/  \\__/  
                                 `

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
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: currentPage === 2 ? 1 : 0, y: currentPage === 2 ? 0 : 20, scale: currentPage === 2 ? 1 : 0.9 }}
              transition={{ delay: currentPage === 2 ? 0.1 : 0, duration: 0.2 }}
            >
              <pre className="ascii-text">
{aboutAsciiArt}
              </pre>
              <motion.p 
                className="ascii-description"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: currentPage === 2 ? 1 : 0, y: currentPage === 2 ? 0 : 15 }}
                transition={{ delay: currentPage === 2 ? 0.15 : 0, duration: 0.2 }}
              >
                Get to know me, my background, and my journey in technology
              </motion.p>
            </motion.div>
          </div>

          <motion.div 
            className="about-main"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: currentPage === 2 ? 1 : 0, y: currentPage === 2 ? 0 : 30 }}
            transition={{ delay: currentPage === 2 ? 0.2 : 0, duration: 0.25 }}
          >
            <div className="about-grid">
              <div className="about-card personal-card">
                <div className="card-header">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <h2>Background</h2>
                </div>
                <div className="card-content">
                  <p>I'm Daan Hessen, 23 years old, with seven years of experience in the hospitality industry. While I gained valuable skills there, I discovered my true passion lies in technology.</p>
                  <p>Two years ago, I started studying HBO-ICT at Hogeschool Utrecht, driven by my fascination with technology's rapid development and my curiosity about how things work.</p>
                </div>
              </div>

              <div className="about-card learning-card">
                <div className="card-header">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                  </div>
                  <h2>Currently Learning</h2>
                </div>
                <div className="card-content">
                  <p>Focused on object-oriented programming through JavaScript, Java, and Python. Currently working on a web-based simulation tool for hydrological pipe modeling.</p>
                  <p>Our client is a professor at the University of Utrecht for Werktuigbouwkunde (Mechanical Engineering), making this project both challenging and rewarding.</p>
                </div>
              </div>

              <div className="about-card skills-card">
                <div className="card-header">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
                    </svg>
                  </div>
                  <h2>Skills & Technologies</h2>
                </div>
                <div className="card-content">
                  <div className="skills-disclaimer">
                    <p><em>Note: I'm familiar with these technologies but actively learning as I continue my studies.</em></p>
                  </div>
                  <div className="skills-categories">
                    <div className="skill-category">
                      <h4>Programming</h4>
                      <div className="tech-stack">
                        <span className="tech-tag">Java</span>
                        <span className="tech-tag">JavaScript</span>
                        <span className="tech-tag">Python</span>
                      </div>
                    </div>
                    <div className="skill-category">
                      <h4>Frontend</h4>
                      <div className="tech-stack">
                        <span className="tech-tag">React</span>
                        <span className="tech-tag">TypeScript</span>
                        <span className="tech-tag">CSS3</span>
                      </div>
                    </div>
                    <div className="skill-category">
                      <h4>Tools & Others</h4>
                      <div className="tech-stack">
                        <span className="tech-tag">Git</span>
                        <span className="tech-tag">Vite</span>
                        <span className="tech-tag">Figma</span>
                        <span className="tech-tag">Vercel</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="about-card contact-card">
                <div className="card-header">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  <h2>Let's Connect</h2>
                </div>
                <div className="card-content">
                  <p><strong>Feel free to reach out!</strong> I'm always open to connecting with fellow developers, students, or anyone interested in technology.</p>
                  <p>Contact me through email or social media platforms — I'd love to hear from you!</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default AboutPage 