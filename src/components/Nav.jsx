import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import profile from '../data/profile.json';
import { useIsBrowser } from '../hooks/useIsBrowser';
import './Nav.css';

const LINKS = [
  { to: '/about', anchor: '#about', label: 'About' },
  { to: '/experience', anchor: '#experience', label: 'Experience' },
  { to: '/projects', anchor: '#projects', label: 'Work' },
  { to: '/skills', anchor: '#skills', label: 'Skills' },
  { to: '/opensource', anchor: '#opensource', label: 'Open Source' },
  { to: '/certifications', anchor: '#certifications', label: 'Certs' },
  { to: '/recommendations', anchor: '#recommendations', label: 'Recs' },
  { to: '/contact', anchor: '#contact', label: 'Contact' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { github, linkedin } = profile.identity.links;
  const location = useLocation();
  const isBrowser = useIsBrowser();
  const isHome = location.pathname === '/';

  const close = () => setOpen(false);

  const getHref = (link) => {
    if (isBrowser && isHome) return link.anchor;
    return link.to;
  };

  const getLinkProps = (link) => {
    const href = getHref(link);
    const isAnchor = href.startsWith('#');
    return isAnchor
      ? { to: href, onClick: close }
      : { to: href, onClick: close };
  };

  return (
    <nav className="nav" aria-label="Primary">
      <div className="container">
        <div className="nav__inner">
          <Link className="nav__brand mono" to="/" aria-label="valabji — home" onClick={() => { close(); if (isHome) window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <span className="nav__brand-prefix" aria-hidden="true">~/</span>
            <span className="nav__brand-name">valabji</span>
            <span className="cursor" aria-hidden="true" />
          </Link>

          <ul className="nav__links">
            {LINKS.map((l) => (
              <li key={l.label}>
                <Link className="nav__link" {...getLinkProps(l)}>{l.label}</Link>
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
                <li key={l.label}>
                  <Link className="nav__mobile-link" {...getLinkProps(l)}>{l.label}</Link>
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
