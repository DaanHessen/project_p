import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import "./CVPage.css";
import useGlobalAnimations from "../utils/useGlobalAnimations";

interface CVPageProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const CVPage: React.FC<CVPageProps> = ({ currentPage, setCurrentPage }) => {
  const { contentFadeVariants, transitionSettings } = useGlobalAnimations();

  const shouldShow = currentPage === 3;
  const [activeSection, setActiveSection] = useState("summary");
  const [scrollDisabled, setScrollDisabled] = useState(false);
  
  // Particle decoration setup
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; opacity: number }[]>([]);
  
  // Generate particles for decoration
  useEffect(() => {
    if (shouldShow) {
      const newParticles = Array(50).fill(0).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.15 + 0.05
      }));
      setParticles(newParticles);
    }
  }, [shouldShow]);

  // Disable scrolling temporarily when arriving at CV page
  useEffect(() => {
    if (currentPage === 3) {
      setScrollDisabled(true);
      const timer = setTimeout(() => {
        setScrollDisabled(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  const handleDownloadPDF = () => {
    // I wanna do something cool here where it'll export the page itself instead of just uploading a pdf version too, so I never
    // have to change both of them and I can just change the page. 
    alert("PDF download feature coming soon");
  };

  const handleBackClick = () => {
    setCurrentPage(1);
  };

  const cvSections = [
    { id: "summary", label: "Summary", icon: "📄" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "experience", label: "Experience", icon: "💼" },
    { id: "skills", label: "Skills", icon: "⚡" },
    { id: "personal", label: "Personal", icon: "👤" },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case "summary":
        return (
          <div className="cv-section-content">
            <h2 className="cv-section-title">Professional Summary</h2>
            <div className="summary-card">
              <div className="summary-header">
                <div className="summary-avatar">DH</div>
                <div className="summary-info">
                  <h3>Daan Hessen</h3>
                  <p>HBO-ICT Student & Software Developer</p>
                </div>
              </div>
              <div className="summary-text">
                <p>
                  23-year-old HBO-ICT student specializing in Software Development at 
                  University of Applied Sciences Utrecht. Experienced in hospitality 
                  with international work experience. Passionate about programming 
                  and modern web technologies.
                </p>
              </div>
              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-number">2+</span>
                  <span className="stat-label">Years in ICT</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">5+</span>
                  <span className="stat-label">Years Experience</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">3</span>
                  <span className="stat-label">Languages</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "education":
        return (
          <div className="cv-section-content">
            <h2 className="cv-section-title">Education</h2>
            <div className="education-timeline">
              <div className="timeline-item active">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <h3>HBO-ICT Software Development</h3>
                    <span className="timeline-period">2023 - Present</span>
                  </div>
                  <p className="timeline-subtitle">University of Applied Sciences Utrecht</p>
                  <p className="timeline-description">
                    Currently in second year, specializing in Software Development. 
                    Focus on modern programming languages, software architecture, 
                    and development methodologies.
                  </p>
                  <div className="timeline-skills">
                    <span className="skill-tag">Java</span>
                    <span className="skill-tag">JavaScript</span>
                    <span className="skill-tag">Web Development</span>
                    <span className="skill-tag">Software Architecture</span>
                  </div>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <h3>HBO Creative Business</h3>
                    <span className="timeline-period">2020 - 2022</span>
                  </div>
                  <p className="timeline-subtitle">University of Applied Sciences Amsterdam</p>
                  <p className="timeline-description">
                    Initial studies before discovering passion for software development 
                    and transitioning to ICT focus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "experience":
        return (
          <div className="cv-section-content">
            <h2 className="cv-section-title">Work Experience</h2>
            <div className="experience-grid">
              <div className="experience-card current">
                <div className="experience-header">
                  <div className="experience-company">Brasserie Monsees</div>
                  <div className="experience-period">2022 - Present</div>
                </div>
                <h3 className="experience-title">Bartender</h3>
                <p className="experience-location">Hilversum, Netherlands</p>
                <p className="experience-description">
                  Customer service, beverage preparation, and restaurant operations 
                  in upscale dining environment. Managing busy periods and maintaining 
                  high service standards.
                </p>
                <div className="experience-skills">
                  <span>Customer Service</span>
                  <span>Team Leadership</span>
                  <span>Multitasking</span>
                </div>
              </div>
              
              <div className="experience-card">
                <div className="experience-header">
                  <div className="experience-company">Ambrosius Stube</div>
                  <div className="experience-period">2022</div>
                </div>
                <h3 className="experience-title">International Bartender</h3>
                <p className="experience-location">Lech, Austria</p>
                <p className="experience-description">
                  International hospitality experience in alpine resort setting 
                  during high season. Developed cultural adaptability and language skills.
                </p>
                <div className="experience-skills">
                  <span>International Experience</span>
                  <span>Language Skills</span>
                  <span>Cultural Adaptability</span>
                </div>
              </div>
              
              <div className="experience-card">
                <div className="experience-header">
                  <div className="experience-company">Oh Lobo</div>
                  <div className="experience-period">2019 - 2020</div>
                </div>
                <h3 className="experience-title">Server & Bartender</h3>
                <p className="experience-location">Hilversum, Netherlands</p>
                <p className="experience-description">
                  Progressive role from server to bartender, developing customer 
                  relations and hospitality management skills.
                </p>
              </div>
              
              <div className="experience-card">
                <div className="experience-header">
                  <div className="experience-company">Sijgje Hilversum</div>
                  <div className="experience-period">2017 - 2019</div>
                </div>
                <h3 className="experience-title">Server</h3>
                <p className="experience-location">Hilversum, Netherlands</p>
                <p className="experience-description">
                  First professional role, developing foundational hospitality 
                  and teamwork skills in fast-paced environment.
                </p>
              </div>
            </div>
          </div>
        );
      
      case "skills":
        return (
          <div className="cv-section-content">
            <h2 className="cv-section-title">Skills & Expertise</h2>
            <div className="skills-container">
              <div className="skills-category">
                <h3>Programming Languages</h3>
                <div className="skills-list">
                  <div className="skill-item advanced">
                    <span className="skill-name">Java</span>
                    <div className="skill-level">
                      <div className="skill-bar" style={{width: '85%'}}></div>
                    </div>
                    <span className="skill-percentage">Advanced</span>
                  </div>
                  <div className="skill-item advanced">
                    <span className="skill-name">JavaScript</span>
                    <div className="skill-level">
                      <div className="skill-bar" style={{width: '80%'}}></div>
                    </div>
                    <span className="skill-percentage">Advanced</span>
                  </div>
                  <div className="skill-item intermediate">
                    <span className="skill-name">TypeScript</span>
                    <div className="skill-level">
                      <div className="skill-bar" style={{width: '70%'}}></div>
                    </div>
                    <span className="skill-percentage">Intermediate</span>
                  </div>
                  <div className="skill-item intermediate">
                    <span className="skill-name">Python</span>
                    <div className="skill-level">
                      <div className="skill-bar" style={{width: '65%'}}></div>
                    </div>
                    <span className="skill-percentage">Intermediate</span>
                  </div>
                </div>
              </div>
              
              <div className="skills-category">
                <h3>Languages</h3>
                <div className="language-skills">
                  <div className="language-item">
                    <div className="language-flag">🇳🇱</div>
                    <div className="language-info">
                      <span className="language-name">Dutch</span>
                      <span className="language-level native">Native</span>
                    </div>
                  </div>
                  <div className="language-item">
                    <div className="language-flag">🇬🇧</div>
                    <div className="language-info">
                      <span className="language-name">English</span>
                      <span className="language-level fluent">Fluent</span>
                    </div>
                  </div>
                  <div className="language-item">
                    <div className="language-flag">🇩🇪</div>
                    <div className="language-info">
                      <span className="language-name">German</span>
                      <span className="language-level intermediate">Intermediate</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="skills-category">
                <h3>Personal Skills</h3>
                <div className="personal-skills">
                  <div className="personal-skill">Team Collaboration</div>
                  <div className="personal-skill">Customer Service</div>
                  <div className="personal-skill">International Experience</div>
                  <div className="personal-skill">Problem Solving</div>
                  <div className="personal-skill">Leadership</div>
                  <div className="personal-skill">Communication</div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case "personal":
        return (
          <div className="cv-section-content">
            <h2 className="cv-section-title">Personal Information</h2>
            <div className="personal-info-container">
              <div className="contact-section">
                <h3>Contact Information</h3>
                <div className="contact-grid">
                  <div className="contact-item">
                    <div className="contact-icon">📍</div>
                    <div className="contact-details">
                      <span className="contact-label">Location</span>
                      <span className="contact-value">Hilversum, Netherlands</span>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">📞</div>
                    <div className="contact-details">
                      <span className="contact-label">Phone</span>
                      <span className="contact-value">+31 647 072 045</span>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">✉️</div>
                    <div className="contact-details">
                      <span className="contact-label">Email</span>
                      <span className="contact-value">daan2002@gmail.com</span>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">🌐</div>
                    <div className="contact-details">
                      <span className="contact-label">Website</span>
                      <span className="contact-value">daanhessen.nl</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="details-section">
                <h3>Personal Details</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Date of Birth</span>
                    <span className="detail-value">September 4, 2002</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Nationality</span>
                    <span className="detail-value">Dutch</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Age</span>
                    <span className="detail-value">21 years old</span>
                  </div>
                </div>
              </div>
              
              <div className="social-section">
                <h3>Professional Links</h3>
                <div className="social-links">
                  <a href="https://linkedin.com/in/daanhessen" target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                    <div className="social-icon">💼</div>
                    <span>LinkedIn Profile</span>
                  </a>
                  <a href="https://github.com/DaanHessen" target="_blank" rel="noopener noreferrer" className="social-link github">
                    <div className="social-icon">💻</div>
                    <span>GitHub Profile</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Create particle decoration elements
  const renderParticles = useCallback(() => {
    return particles.map((particle, index) => (
      <div 
        key={index}
        style={{
          position: 'absolute',
          top: `${particle.y}%`,
          left: `${particle.x}%`,
          width: `${particle.size}px`,
          height: `${particle.size}px`,
          borderRadius: '50%',
          background: 'rgba(59, 130, 246, 0.4)',
          boxShadow: '0 0 10px rgba(59, 130, 246, 0.2)',
          opacity: particle.opacity,
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />
    ));
  }, [particles]);

  return (
    <div className="page page-three cv-page">
      {/* Particle decorations */}
      {shouldShow && renderParticles()}
      
      <div className="cv-layout">
        <motion.div
          className="cv-sidebar"
          variants={contentFadeVariants}
          initial="initial"
          animate={shouldShow ? "animate" : "exit"}
          exit="exit"
          transition={{
            ...transitionSettings.content,
            delay: 0.1,
          }}
        >
          <div className="sidebar-header">
            <div className="sidebar-title-section">
              <h2 className="sidebar-title">Curriculum Vitae</h2>
              <button 
                className="back-button"
                onClick={handleBackClick}
                aria-label="Go back"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/>
                </svg>
                Back
              </button>
            </div>
          </div>
          
          <nav className="sidebar-nav">
            {cvSections.map((section, index) => (
              <motion.button
                key={section.id}
                className={`sidebar-nav-item ${activeSection === section.id ? 'active' : ''}`}
                onClick={() => setActiveSection(section.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={shouldShow ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{
                  delay: shouldShow ? 0.2 + index * 0.1 : 0,
                  duration: 0.3,
                }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="nav-icon">{section.icon}</span>
                <span className="nav-label">{section.label}</span>
              </motion.button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <motion.button
              onClick={handleDownloadPDF}
              className="download-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={shouldShow ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: shouldShow ? 0.8 : 0 }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
              Download PDF
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          className={`cv-main-content ${scrollDisabled ? 'scroll-disabled' : ''}`}
          variants={contentFadeVariants}
          initial="initial"
          animate={shouldShow ? "animate" : "exit"}
          exit="exit"
          transition={{
            ...transitionSettings.content,
            delay: 0.2,
          }}
        >
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderActiveSection()}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CVPage;
