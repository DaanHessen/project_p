import type { MouseEvent } from "react";
import "./SiteNav.css";

interface SiteNavProps {
  onNavigateToResume: () => void;
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

const SiteNav = ({ onNavigateToResume }: SiteNavProps) => {
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

  return (
    <nav className="site-nav" aria-label="Primary">
      <a className="site-nav__resume" href="/cv" onClick={handleResumeClick}>
        <span>résumé</span>
        <span className="site-nav__arrow" aria-hidden="true">
          →
        </span>
      </a>

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
