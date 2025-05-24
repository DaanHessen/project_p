import { useState, useEffect } from "react";

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

const Typewriter = ({
  text,
  speed = 15,
  onComplete,
  className,
}: TypewriterProps) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
      if (onComplete) {
        setTimeout(onComplete, 50);
      }
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <div className={`typewriter ${className || ""}`}>
      <span className="typewriter-text">{displayText}</span>
      <span
        className={`cursor ${isTyping ? "cursor-typing" : "cursor-idle"}`}
      ></span>
    </div>
  );
};

export default Typewriter;
