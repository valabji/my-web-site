import { useState } from 'react';
import profile from '../data/profile.json';
import './Nav.css';

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Work' },
  { href: '#opensource', label: 'Open Source' },
  { href: '#certifications', label: 'Certs' },
  { href: '#recommendations', label: 'Recs' },
  { href: '#contact', label: 'Contact' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { github, linkedin } = profile.identity.links;

  const close = () => setOpen(false);

  return (
    <nav className="nav" aria-label="Primary">
      <div className="container">
        <div className="nav__inner">
          <a className="nav__brand mono" href="#home" aria-label="valabji — home" onClick={close}>
            <span className="nav__brand-prefix" aria-hidden="true">~/</span>
            <span className="nav__brand-name">valabji</span>
            <span className="cursor" aria-hidden="true" />
          </a>

          <ul className="nav__links">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a className="nav__link" href={l.href}>{l.label}</a>
              </li>
            ))}
            <li className="nav__social">
              {github && (
                <a className="nav__icon" href={github} target="_blank" rel="noreferrer" aria-label="GitHub profile">
                  <span className="lni lni-github" aria-hidden="true" />
                </a>
              )}
              {linkedin && (
                <a className="nav__icon" href={linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
                  <span className="lni lni-linkedin" aria-hidden="true" />
                </a>
              )}
            </li>
          </ul>

          <button
            type="button"
            className={`nav__toggle${open ? ' nav__toggle--open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="nav-mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="nav__toggle-bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="nav__mobile" id="nav-mobile-menu">
          <div className="container">
            <ul className="nav__mobile-list">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a className="nav__mobile-link" href={l.href} onClick={close}>{l.label}</a>
                </li>
              ))}
            </ul>
            <div className="nav__mobile-social">
              {github && (
                <a className="nav__icon" href={github} target="_blank" rel="noreferrer" aria-label="GitHub profile" onClick={close}>
                  <span className="lni lni-github" aria-hidden="true" />
                </a>
              )}
              {linkedin && (
                <a className="nav__icon" href={linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile" onClick={close}>
                  <span className="lni lni-linkedin" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
