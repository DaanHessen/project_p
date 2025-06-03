import { motion } from "framer-motion";
import useGlobalAnimations from "../utils/useGlobalAnimations";

interface ProjectsPageProps {
  currentPage: number;
  onNavigateUp?: () => void;
}

const ProjectsPage = ({ currentPage, onNavigateUp }: ProjectsPageProps) => {
  const { contentFadeVariants, transitionSettings } = useGlobalAnimations();

  if (currentPage !== 2) {
    return null;
  }

  return (
    <div className="page page-projects">
      <div className="content-container">
        <motion.div
          className="main-content"
          variants={contentFadeVariants}
          initial="initial"
          animate="animate"
          transition={{
            ...transitionSettings.content,
            delay: 0.2,
          }}
        >
          <motion.h1
            variants={contentFadeVariants}
            initial="initial"
            animate="animate"
            transition={{
              ...transitionSettings.content,
              delay: 0.3,
            }}
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              fontWeight: "300",
              color: "var(--text-primary)",
              marginBottom: "2rem",
              fontFamily: "JetBrains Mono, monospace",
            }}
          >
            Projects Coming Soon
          </motion.h1>
          
          <motion.p
            variants={contentFadeVariants}
            initial="initial"
            animate="animate"
            transition={{
              ...transitionSettings.content,
              delay: 0.4,
            }}
            style={{
              fontSize: "1.2rem",
              color: "var(--text-secondary)",
              marginBottom: "3rem",
              maxWidth: "600px",
              lineHeight: "1.6",
            }}
          >
            This page is under construction. Check back soon for an interactive portfolio showcase.
          </motion.p>

          {onNavigateUp && (
            <motion.button
              onClick={onNavigateUp}
              variants={contentFadeVariants}
              initial="initial"
              animate="animate"
              transition={{
                ...transitionSettings.content,
                delay: 0.5,
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "1rem 2rem",
                backgroundColor: "var(--accent-primary)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Back to Home
            </motion.button>
          )}

          <motion.div
            variants={contentFadeVariants}
            initial="initial"
            animate="animate"
            transition={{
              ...transitionSettings.content,
              delay: 0.6,
            }}
            style={{
              marginTop: "3rem",
              opacity: 0.7,
            }}
          >
            <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
              Scroll up to return home
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectsPage;
