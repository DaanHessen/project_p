import { motion } from "framer-motion";
import useGlobalAnimations from "../utils/useGlobalAnimations";

interface ProjectsPageProps {
  currentPage: number;
  onNavigateUp?: () => void;
}

const ProjectsPage = ({ currentPage }: ProjectsPageProps) => {
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
            Still working on this page. Meanwhile, you can check some of my projects out on my GitHub.
          </motion.p>

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
