import type { MouseEvent } from "react";
import "./SiteNav.css";

interface SiteNavProps {
  onNavigateToResume: () => void;
  onNavigateToMinor: () => void;
}

const links = [
  { label: "github", href: "https://github.com/DaanHessen" },
  {
    label: "linkedin",
    href: "https://www.linkedin.com/in/daan-hessen-552789236/",
  },
  { label: "x", href: "https://x.com/Ge_Daan0" },
  { label: "instagram", href: "https://www.instagram.com/daanhessen_/" },
  { label: "email", href: "mailto:daanh2002@gmail.com" },
];

const SiteNav = ({ onNavigateToResume, onNavigateToMinor }: SiteNavProps) => {
  /*
    A real href, intercepted. Modified clicks fall through so middle-click and
    "open in new tab" keep working, which a button-based nav would break.
  */
  const handleResumeClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    onNavigateToResume();
  };

  const handleMinorClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    onNavigateToMinor();
  };

  return (
    <nav className="site-nav" aria-label="Primary">
      <div className="site-nav__actions">
        <a className="site-nav__btn" href="/cv" onClick={handleResumeClick}>
          résumé
        </a>
        <a className="site-nav__btn" href="/minor" onClick={handleMinorClick}>
          minor
        </a>
      </div>

      <ul className="site-nav__links">
        {links.map((link) => (
          <li key={link.label}>
            <a
              className="site-nav__link"
              href={link.href}
              {...(link.href.startsWith("mailto:")
                ? {}
                : { target: "_blank", rel: "noopener noreferrer" })}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SiteNav;
