import { useEffect, useRef, useState } from "react";
import "./BackButton.css";

interface BackButtonProps {
  onNavigateHome: () => void;
  badge?: string;
  label?: string;
  rightAction?: React.ReactNode;
}

export const BackButton = ({
  onNavigateHome,
  badge,
  label = "back",
  rightAction,
}: BackButtonProps) => {
  const [stuck, setStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setStuck(!entry.isIntersecting);
      },
      { threshold: [0, 1] },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        ref={sentinelRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "1px",
          height: "8px",
          pointerEvents: "none",
          visibility: "hidden",
        }}
      />
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
        {rightAction}
      </div>
    </header>
    </>
  );
};

export default BackButton;
