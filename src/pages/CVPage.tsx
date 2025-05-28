import React from "react";
import { motion } from "framer-motion";
import "./CVPage.css";

interface CVPageProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const CVPage: React.FC<CVPageProps> = ({ currentPage, setCurrentPage }) => {
  const handleBackClick = () => {
    setCurrentPage(1);
  };

  if (currentPage !== 3) {
    return null;
  }

  const socialLinks = [
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/daanhessen",
      className: "linkedin",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      url: "https://instagram.com/daanhessen",
      className: "instagram",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: "Email",
      url: "mailto:daan2002@gmail.com",
      className: "email",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
      ),
    },
    {
      name: "GitHub",
      url: "https://github.com/DaanHessen",
      className: "github",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      name: "Website",
      url: "https://daanhessen.nl",
      className: "website",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      ),
    },
  ];

  return (
    <motion.div
      className="page page-three cv-page"
      initial={{ transform: "translateY(100vh)" }}
      animate={{ transform: "translateY(0)" }}
      exit={{ transform: "translateY(100vh)" }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div className="cv-content">
        {/* Header with Back Button */}
        <motion.div
          className="cv-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <button
            onClick={handleBackClick}
            className="back-button"
            aria-label="Go back to homepage"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z" />
            </svg>
            <span>Back</span>
          </button>
        </motion.div>

        {/* CV Container */}
        <motion.div
          className="cv-container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Personal Info Section */}
          <div className="cv-section personal-info">
            <div className="personal-header">
              <h1 className="cv-name">Daan Hessen</h1>
              <div className="personal-details">
                <div className="detail-group">
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">Daan Hessen</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Address:</span>
                    <span className="detail-value">
                      Alexanderlaan 33, Hilversum, 1213XR
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">+31647072045</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">daan2002@gmail.com</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date of Birth:</span>
                    <span className="detail-value">4/9/2002</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Gender:</span>
                    <span className="detail-value">Male</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Nationality:</span>
                    <span className="detail-value">Netherlands</span>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="cv-social-section">
                <h3 className="social-title">Connect with me</h3>
                <div className="cv-social-grid">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`cv-social-link ${link.className}`}
                      title={link.name}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="cv-section">
            <h2 className="section-title">Education</h2>
            <div className="timeline-item">
              <div className="timeline-header">
                <h3 className="timeline-title">HBO-ICT</h3>
                <span className="timeline-period">sep 2023 - present</span>
              </div>
              <div className="timeline-subtitle">
                University of Applied Sciences Utrecht, Heidelberglaan 15
              </div>
              <div className="timeline-description">
                I started this study after coming from working internationally.
                I really like it, and am currently in my second year. At the
                start of this year I chose to specialize in Software
                Development.
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-header">
                <h3 className="timeline-title">HBO-CB</h3>
                <span className="timeline-period">sep 2020 - mrt 2022</span>
              </div>
              <div className="timeline-subtitle">
                University of Applied Sciences Amsterdam, Rhijnspoorplein 1
              </div>
              <div className="timeline-description">
                My first studies after finishing high school. I chose for
                Creative Business because it seemed interesting and had a lot of
                variety, but I quickly found out this wasn't the right path for
                me.
              </div>
            </div>
          </div>

          {/* Work Experience Section */}
          <div className="cv-section">
            <h2 className="section-title">Work Experience</h2>

            <div className="timeline-item">
              <div className="timeline-header">
                <h3 className="timeline-title">Bartender</h3>
                <span className="timeline-period">dec 2022 - present</span>
              </div>
              <div className="timeline-subtitle">
                Brasserie Monsees, Hilversum
              </div>
              <div className="timeline-description">
                Started immediately after returning from my international role
                in Lech. Thus far it's been the most serious job out of all of
                them
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-header">
                <h3 className="timeline-title">Bartender</h3>
                <span className="timeline-period">apr 2022 - nov 2022</span>
              </div>
              <div className="timeline-subtitle">Ambrosius Stube, Lech</div>
              <div className="timeline-description">
                After leaving Creative Business, I wanted to make productive use
                of my newfound time. I chose to work at a restaurant in Lech,
                directly across from the slopes. I completed my tenure during
                the entire high season and had a great time.
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-header">
                <h3 className="timeline-title">Bartender</h3>
                <span className="timeline-period">aug 2020 - dec 2020</span>
              </div>
              <div className="timeline-subtitle">Le Journal, Hilversum</div>
              <div className="timeline-description">
                The bar where I often went to to have a drink with friends.
                After a while I figured why not work there, but shortly after it
                unfortunately closed due to the pandemic.
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-header">
                <h3 className="timeline-title">Server</h3>
                <span className="timeline-period">apr 2019 - jul 2020</span>
              </div>
              <div className="timeline-subtitle">Oh Lobo, Hilversum</div>
              <div className="timeline-description">
                Began as a server, but mostly worked behind the bar. Although it
                was one of the shortest jobs I've had, it remains one of the
                most enjoyable.
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-header">
                <h3 className="timeline-title">Service</h3>
                <span className="timeline-period">jul 2017 - mei 2019</span>
              </div>
              <div className="timeline-subtitle">
                Sijgje Hilversum, Hilversum
              </div>
              <div className="timeline-description">
                Learned an incredible deal about the restaurant industry during
                my first job as a server (and occasionally the dishwashing
                area). Served in nearly two years until the restaurant
                tragically burned down.
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="cv-section">
            <h2 className="section-title">Technical Skills</h2>
            <div className="skills-grid">
              <div className="skill-category">
                <h3 className="skill-category-title">Programming</h3>
                <div className="skill-tags">
                  <span className="skill-tag experienced">Java</span>
                  <span className="skill-tag experienced">JavaScript</span>
                  <span className="skill-tag good">TypeScript</span>
                  <span className="skill-tag good">Python</span>
                </div>
              </div>
              <div className="skill-category">
                <h3 className="skill-category-title">Skills</h3>
                <div className="skill-tags">
                  <span className="skill-tag experienced">Dutch</span>
                  <span className="skill-tag experienced">English</span>
                  <span className="skill-tag good">German</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CVPage;
