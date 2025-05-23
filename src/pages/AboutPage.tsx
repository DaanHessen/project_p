import './AboutPage.css'

interface AboutPageProps {
  currentPage: number
  setCurrentPage: (page: number) => void
}

const AboutPage = ({ currentPage }: AboutPageProps) => {
  return (
    <div className={`page page-three page-transition ${currentPage === 3 ? 'page-slide-in' : ''}`}>
      <div className="content-container">
        <div className="about-content">
          <div className="about-header">
            <div className="header-prompt fade-in">
              <span className="prompt-symbol">$</span>
              <span className="prompt-command">cat ~/about.md</span>
            </div>
            <h1 className="about-title slide-up">About Me</h1>
          </div>

          <div className="about-grid">
            <div className="about-section fade-in-delayed">
              <h2 className="section-title">Background</h2>
              <p className="section-text">
                I'm a passionate 2nd year HBO-ICT student at Hogeschool Utrecht, specializing in software development. 
                My journey in technology started with curiosity about how things work, and has evolved into a deep 
                passion for building innovative web applications and exploring cutting-edge technologies.
              </p>
            </div>

            <div className="about-section fade-in-final">
              <h2 className="section-title">Skills & Technologies</h2>
              <div className="skills-grid">
                <div className="skill-category">
                  <h3>Frontend</h3>
                  <div className="tech-tags">
                    <span className="tech-tag hover-lift">React</span>
                    <span className="tech-tag hover-lift">TypeScript</span>
                    <span className="tech-tag hover-lift">CSS3</span>
                    <span className="tech-tag hover-lift">Tailwind</span>
                  </div>
                </div>
                <div className="skill-category">
                  <h3>Backend</h3>
                  <div className="tech-tags">
                    <span className="tech-tag hover-lift">Node.js</span>
                    <span className="tech-tag hover-lift">Python</span>
                    <span className="tech-tag hover-lift">SQL</span>
                    <span className="tech-tag hover-lift">APIs</span>
                  </div>
                </div>
                <div className="skill-category">
                  <h3>Tools</h3>
                  <div className="tech-tags">
                    <span className="tech-tag hover-lift">Git</span>
                    <span className="tech-tag hover-lift">Vite</span>
                    <span className="tech-tag hover-lift">Figma</span>
                    <span className="tech-tag hover-lift">Vercel</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-section fade-in-late">
              <h2 className="section-title">Current Focus</h2>
              <p className="section-text">
                Currently focused on mastering modern web development frameworks and exploring new areas like 
                machine learning and cloud computing. I'm always eager to learn new technologies and work on 
                challenging projects that push my boundaries.
              </p>
              <div className="contact-note">
                <p>
                  <strong>Let's connect!</strong> Feel free to reach out through any of my social media platforms 
                  or send me an email. I'm always open to discussing new opportunities, collaborations, or just 
                  chatting about technology.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage 