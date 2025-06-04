import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./CVPage.css";
import useGlobalAnimations from "../utils/useGlobalAnimations";

// import { initializeCVTables } from "../utils/database";
import { exportCVToPDF } from "../utils/pdfExport";
import {
  loadCVDataWithFallback,
  scheduleAutoBackup,
  type CVBackupData,
} from "../utils/dataBackup";

interface CVPageProps {
  currentPage: number;
}

// Contact Section Skeleton - matches exact real structure
const ContactSkeleton = () => (
  <div className="contact-section">
    <h3 className="contact-title">
      <Skeleton width={80} height={18} />
    </h3>
    <div className="contact-items">
      <div className="contact-item">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <Skeleton circle width={16} height={16} />
        </svg>
        <span>
          <Skeleton width={140} height={14} />
        </span>
      </div>
      <div className="contact-item">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <Skeleton circle width={16} height={16} />
        </svg>
        <span>
          <Skeleton width={120} height={14} />
        </span>
      </div>
      <div className="contact-item">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <Skeleton circle width={16} height={16} />
        </svg>
        <span>
          <Skeleton width={130} height={14} />
        </span>
      </div>
    </div>
  </div>
);

// Skills Section Skeleton - matches exact real structure
const SkillsSkeleton = () => (
  <div className="skills-section">
    <h3 className="skills-title">
      <Skeleton width={100} height={18} />
    </h3>
    <div className="skills-list">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="skill-category">
          <h4>
            <Skeleton width={85} height={16} />
          </h4>
          <ul>
            {Array.from({ length: 4 }).map((_, skillIndex) => (
              <li key={skillIndex}>
                <Skeleton width={95} height={12} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

// Main Content Skeleton - matches exact real content structure
const MainContentSkeleton = () => (
  <div className="cv-content">
    {/* Professional Summary Skeleton */}
    <section className="cv-section">
      <h2 className="section-heading">
        <Skeleton width={220} height={24} />
      </h2>
      <div className="section-content">
        <Skeleton count={3} height={16} style={{ marginBottom: "8px" }} />
      </div>
    </section>

    {/* Work Experience Skeleton */}
    <section className="cv-section">
      <h2 className="section-heading">
        <Skeleton width={160} height={24} />
      </h2>
      <div className="section-content">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="experience-entry">
            <div className="experience-header">
              <div className="experience-years">
                <span className="year-range">
                  <Skeleton width={80} height={14} />
                </span>
              </div>
              <div className="experience-details">
                <h3 className="job-title">
                  <Skeleton width="65%" height={20} />
                </h3>
                <h4 className="company-location">
                  <Skeleton width="55%" height={16} />
                </h4>
                <p className="job-description">
                  <Skeleton
                    count={2}
                    height={14}
                    style={{ marginBottom: "4px" }}
                  />
                </p>
                <div className="experience-highlights">
                  <div className="highlight-item">
                    <Skeleton width="90%" height={12} />
                  </div>
                  <div className="highlight-item">
                    <Skeleton width="85%" height={12} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Education Skeleton */}
    <section className="cv-section">
      <h2 className="section-heading">
        <Skeleton width={120} height={24} />
      </h2>
      <div className="section-content">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="education-entry">
            <div className="education-header">
              <div className="education-years">
                <span className="year-range">
                  <Skeleton width={80} height={14} />
                </span>
              </div>
              <div className="education-details">
                <h3 className="degree-title">
                  <Skeleton width="70%" height={20} />
                </h3>
                <h4 className="institution-name">
                  <Skeleton width="60%" height={16} />
                </h4>
                <p className="education-description">
                  <Skeleton
                    count={2}
                    height={14}
                    style={{ marginBottom: "4px" }}
                  />
                </p>
                <div className="education-highlights">
                  <span className="highlight-tag">
                    <Skeleton width={70} height={18} borderRadius={9} />
                  </span>
                  <span className="highlight-tag">
                    <Skeleton width={80} height={18} borderRadius={9} />
                  </span>
                  <span className="highlight-tag">
                    <Skeleton width={65} height={18} borderRadius={9} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const CVPage: React.FC<CVPageProps> = ({ currentPage }) => {
  const mainContentRef = useRef<HTMLDivElement>(null);
  const { contentFadeVariants, transitionSettings } = useGlobalAnimations();

  const shouldShow = currentPage === 3;
  const [scrollDisabled, setScrollDisabled] = useState(false);
  const [cvData, setCvData] = useState<CVBackupData>({
    profile: null,
    experience: [],
    education: [],
    skills: [],
    exportDate: "",
    version: "1.0",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [isPDFLoading, setIsPDFLoading] = useState(false);

  useEffect(() => {
    if (currentPage === 3) {
      setScrollDisabled(true);
      const timer = setTimeout(() => {
        setScrollDisabled(false);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  useEffect(() => {
    const loadCVData = async () => {
      try {
        if (shouldShow && !hasLoadedOnce) {
          setIsLoading(true);

          // Initialize tables if needed
          // await initializeCVTables();

          // Load CV data with fallback system
          const data = await loadCVDataWithFallback();
          setCvData(data);

          // Schedule auto-backup
          scheduleAutoBackup();
          
          setHasLoadedOnce(true);
        }
      } catch (error) {
        console.error("Error loading CV data:", error);
      } finally {
        if (shouldShow && !hasLoadedOnce) {
          setTimeout(() => {
            setIsLoading(false);
          }, 300);
        }
      }
    };

    loadCVData();
  }, [shouldShow, hasLoadedOnce]);

  const handleDownloadPDF = async () => {
    await exportCVToPDF(setIsPDFLoading);
  };

  if (!shouldShow) return null;

  return (
    <SkeletonTheme
      baseColor="rgba(255, 255, 255, 0.1)"
      highlightColor="rgba(255, 255, 255, 0.2)"
      duration={2}
    >
      <motion.div
        className="page-wrapper active"
        variants={contentFadeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transitionSettings.page}
      >
        <div className="cv-page page">
          <div className="cv-layout">
            {/* CV Sidebar */}
            <motion.div
              className="cv-sidebar"
              variants={contentFadeVariants}
              initial="initial"
              animate={shouldShow ? "animate" : "exit"}
              exit="exit"
              transition={{
                ...transitionSettings.content,
                delay: 0.1,
                duration: 0.4,
              }}
            >
              {/* Profile Section */}
              <div className="profile-section">
                <div className="profile-avatar">
                  {isLoading ? (
                    <Skeleton circle height={120} width={120} />
                  ) : (
                    <img
                      src="/daan-profile.jpg"
                      alt="Daan Hessen"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                </div>
                <div className="profile-info">
                  <h1 className="profile-name">
                    {isLoading ? (
                      <Skeleton height={24} width={120} />
                    ) : (
                      cvData.profile?.Name || "Daan Hessen"
                    )}
                  </h1>
                  <h2 className="profile-title">
                    {isLoading ? (
                      <Skeleton height={18} width={150} />
                    ) : (
                      cvData.profile?.Title || "Full Stack Developer"
                    )}
                  </h2>
                </div>
              </div>

              {/* Contact Section */}
              <div className="contact-section">
                <h3 className="section-title">CONTACT</h3>
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="contact-skeleton"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ContactSkeleton />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="contact-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="contact-items">
                        <div className="contact-item">
                          <svg
                            className="contact-icon"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />
                          </svg>
                          <span>
                            {cvData.profile?.Phone || "+31 647 072 045"}
                          </span>
                        </div>
                        <div className="contact-item">
                          <svg
                            className="contact-icon"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />
                          </svg>
                          <span>
                            {cvData.profile?.Email || "daan2002@gmail.com"}
                          </span>
                        </div>
                        <div className="contact-item">
                          <svg
                            className="contact-icon"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" />
                          </svg>
                          <span>
                            {cvData.profile?.Location ||
                              "Hilversum, Netherlands"}
                          </span>
                        </div>
                        <div className="contact-item">
                          <svg
                            className="contact-icon"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M16.36,14C16.44,13.3 16.5,12.66 16.5,12C16.5,11.34 16.44,10.7 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.7 7.5,11.34 7.5,12C7.5,12.66 7.56,13.3 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                          </svg>
                          <span>
                            {cvData.profile?.Website || "daanhessen.dev"}
                          </span>
                        </div>
                        <div className="contact-item">
                          <svg
                            className="contact-icon"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19M18.5,18.5V13.2A3.26,3.26 0 0,0 15.24,9.94C14.39,9.94 13.4,10.46 12.92,11.24V10.13H10.13V18.5H12.92V13.57C12.92,12.8 13.54,12.17 14.31,12.17A1.4,1.4 0 0,1 15.71,13.57V18.5H18.5M6.88,8.56A1.68,1.68 0 0,0 8.56,6.88C8.56,5.95 7.81,5.19 6.88,5.19A1.69,1.69 0 0,0 5.19,6.88C5.19,7.81 5.95,8.56 6.88,8.56M8.27,18.5V10.13H5.5V18.5H8.27Z" />
                          </svg>
                          <span>
                            {cvData.profile?.LinkedIn ||
                              "linkedin.com/in/daanhessen"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Skills Section */}
              <div className="skills-section">
                <h3 className="section-title">SKILLS</h3>
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="skills-skeleton"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <SkillsSkeleton />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="skills-content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="skills-list">
                        {cvData.skills.map((skillCategory) => (
                          <div
                            key={skillCategory.id}
                            className="skill-category"
                          >
                            <h4>{skillCategory.Category}</h4>
                            <ul>
                              {skillCategory.Skills.split("|").map(
                                (skill, index) => (
                                  <li key={index}>{skill}</li>
                                ),
                              )}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Navigation & Download */}
              <div className="sidebar-footer">
                <motion.button
                  onClick={handleDownloadPDF}
                  className="download-btn"
                  disabled={isPDFLoading}
                  whileHover={{ scale: isPDFLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isPDFLoading ? 1 : 0.98 }}
                >
                  {isPDFLoading ? (
                    <>
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        style={{ animation: "spin 1s linear infinite" }}
                      >
                        <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z" />
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                      </svg>
                      Download PDF
                    </>
                  )}
                </motion.button>
                <button
                  className="scroll-to-top-button"
                  onClick={() => {
                    if (mainContentRef.current) {
                      mainContentRef.current.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }
                  }}
                  aria-label="Scroll to top"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l8 8-1.41 1.41L12 4.83l-6.59 6.58L4 10l8-8z" />
                  </svg>
                  Back to Top
                </button>
              </div>
            </motion.div>

            {/* Main Content Area */}
            <motion.div
              className={`cv-main-content ${scrollDisabled ? "scroll-disabled" : ""}`}
              ref={mainContentRef}
              variants={contentFadeVariants}
              initial="initial"
              animate={shouldShow ? "animate" : "exit"}
              exit="exit"
              transition={{
                ...transitionSettings.content,
                delay: 0.1,
                duration: 0.6,
              }}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="main-skeleton"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MainContentSkeleton />
                  </motion.div>
                ) : (
                  <motion.div
                    key="main-content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="cv-content">
                      {/* Professional Summary */}
                      <section className="cv-section">
                        <h2 className="section-heading">
                          PROFESSIONAL SUMMARY
                        </h2>
                        <div className="section-content">
                          <p>
                            {cvData.profile?.Summary ||
                              "Passionate HBO-ICT student specializing in Software Development with hands-on experience in modern programming languages and web technologies. Currently in my second year at University of Applied Sciences Utrecht, combining academic knowledge with practical application. Strong background in hospitality with international work experience, bringing excellent communication skills and cultural awareness to technical projects."}
                          </p>
                        </div>
                      </section>

                      {/* Work Experience */}
                      <section className="cv-section">
                        <h2 className="section-heading">WORK EXPERIENCE</h2>
                        <div className="section-content">
                          {cvData.experience.map((exp) => (
                            <div key={exp.id} className="experience-entry">
                              <div className="experience-header">
                                <div className="experience-years">
                                  <span className="year-range">
                                    {exp.StartYear} -{" "}
                                    {exp.IsCurrent ? "Present" : exp.EndYear}
                                  </span>
                                </div>
                                <div className="experience-details">
                                  <h3 className="job-title">{exp.JobTitle}</h3>
                                  <h4 className="company-name">
                                    {exp.Company} • {exp.Location}
                                  </h4>
                                  <p className="job-description">
                                    {exp.Description}
                                  </p>
                                  {exp.Highlights && (
                                    <div className="experience-highlights">
                                      {exp.Highlights.split("|").map(
                                        (highlight, index) => (
                                          <div
                                            key={index}
                                            className="highlight-item"
                                          >
                                            • {highlight.trim()}
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Education */}
                      <section className="cv-section">
                        <h2 className="section-heading">EDUCATION</h2>
                        <div className="section-content">
                          {cvData.education.map((edu) => (
                            <div key={edu.id} className="education-entry">
                              <div className="education-header">
                                <div className="education-years">
                                  <span className="year-range">
                                    {edu.StartYear} -{" "}
                                    {edu.IsCurrent ? "Present" : edu.EndYear}
                                  </span>
                                </div>
                                <div className="education-details">
                                  <h3 className="degree-title">{edu.Degree}</h3>
                                  <h4 className="institution-name">
                                    {edu.Institution}
                                  </h4>
                                  <p className="education-description">
                                    {edu.Description}
                                  </p>
                                  {edu.Highlights && (
                                    <div className="education-highlights">
                                      {edu.Highlights.split("|").map(
                                        (highlight, index) => (
                                          <span
                                            key={index}
                                            className="highlight-tag"
                                          >
                                            {highlight.trim()}
                                          </span>
                                        ),
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </SkeletonTheme>
  );
};

export default CVPage;
