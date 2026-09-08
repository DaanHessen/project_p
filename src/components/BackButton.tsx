import { useEffect, useState } from "react";
import "./BackButton.css";

interface BackButtonProps {
  onNavigateHome: () => void;
  badge?: string;
  label?: string;
}

export const BackButton = ({
  onNavigateHome,
  badge,
  label = "back",
}: BackButtonProps) => {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setStuck(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="back-bar" data-stuck={stuck}>
      <div className="back-bar__inner">
        <button
          type="button"
          className="back-button"
          onClick={onNavigateHome}
          aria-label="Return to homepage"
        >
          <span className="back-button__arrow" aria-hidden="true">
            ←
          </span>
          <span className="back-button__label">{label}</span>
        </button>
        {badge && <span className="back-bar__badge">{badge}</span>}
      </div>
    </header>
  );
};

export default BackButton;
