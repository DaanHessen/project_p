import React, { useRef } from "react";
import "./SocialMedia.css";

const resumeUrl = `/resume.html?v=${__RESUME_VERSION__}`;
const ASCII_BLOBS_VERSION = "1.0.4";

const SocialMedia: React.FC = () => {
  const tooltipRefs = useRef<(HTMLDivElement | null)[]>([]);

  const showTooltip = (index: number) => {
    const tooltip = tooltipRefs.current[index];
    tooltip?.classList.add("active");
  };

  const hideTooltip = (index: number) => {
    const tooltip = tooltipRefs.current[index];
    tooltip?.classList.remove("active");
  };

  const socialLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/daan-hessen-552789236/",
      className: "linkedin",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/daanhessen_/",
      className: "instagram",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.40s-.644-1.44-1.439-1.40z" />
        </svg>
      ),
    },
    {
      name: "X",
      url: "https://x.com/Ge_Daan0",
      className: "x",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      name: "Email",
      url: "mailto:daanh2002@gmail.com",
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
      name: "Resumé",
      url: resumeUrl,
      className: "resume",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
        </svg>
      ),
    },
    {
      name: "Buy Me A Coffee (yeah I know)",
      url: "https://buymeacoffee.com/daanhessen",
      className: "coffee",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.5 3H6c-1.1 0-2 .9-2 2v5.71c0 3.83 2.95 7.18 6.78 7.29 3.96.12 7.22-3.06 7.22-7v-1h.5c1.93 0 3.5-1.57 3.5-3.5S20.43 3 18.5 3zM16 5v3H6V5h10zm2.5 3H18V5h.5c.83 0 1.5.67 1.5 1.5S19.33 8 18.5 8zM4 19h16v2H4z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="pixel-social-container">
      <div className="social-section">
        <div className="tooltip-container">
          {socialLinks.map((link, index) => (
            <div 
              key={link.name} 
              className="tooltip-item" 
              data-tooltip={link.name}
              ref={(element) => {
                tooltipRefs.current[index] = element;
              }}
              style={{ left: `calc((100% / 7) * ${index} + (100% / 7 / 2))` }}
            />
          ))}
        </div>
        
        <div className="social-grid">
          {socialLinks.map((link, index) => (
            <div key={link.name} className="social-link-wrapper">
              <a
                href={link.url || undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={`social-link ${link.className}`}
                onMouseEnter={() => showTooltip(index)}
                onMouseLeave={() => hideTooltip(index)}
                onClick={(e) => {
                  if (!link.url) {
                    e.preventDefault();
                  }
                }}
                aria-disabled={!link.url}
              >
                <div className="hover-bg"></div>
                {link.icon}
              </a>
            </div>
          ))}
        </div>
      </div>

      <footer className="ascii-footer-floating" aria-label="ASCII-blobs showcase">
        <div className="ascii-footer-card">
          <div className="ascii-footer-top">
            <span className="ascii-footer-title">ASCII-blobs</span>
            <span className="ascii-footer-version">v{ASCII_BLOBS_VERSION}</span>
          </div>
          <div className="ascii-footer-bottom">
            <span className="ascii-footer-byline">
              This background now ships as a highly customizable npm package made by me!
            </span>
            <div className="ascii-footer-links">
              <a
                href="https://github.com/DaanHessen/ASCII-blobs"
                target="_blank"
                rel="noopener noreferrer"
                className="ascii-footer-link"
              >
                GitHub
              </a>
              <a
                href="https://www.npmjs.com/package/ascii-blobs"
                target="_blank"
                rel="noopener noreferrer"
                className="ascii-footer-link"
              >
                npm
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SocialMedia;
