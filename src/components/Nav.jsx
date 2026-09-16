import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import profile from '../data/profile.json';
import { useIsBrowser } from '../hooks/useIsBrowser';
import './Nav.css';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const LINKS = [
  { to: '/about', anchor: '#about', label: 'about' },
  { to: '/experience', anchor: '#experience', label: 'experience' },
  { to: '/projects', anchor: '#projects', label: 'work' },
  { to: '/skills', anchor: '#skills', label: 'skills' },
  { to: '/opensource', anchor: '#opensource', label: 'openSource' },
  { to: '/certifications', anchor: '#certifications', label: 'certifications' },
  { to: '/recommendations', anchor: '#recommendations', label: 'recommendations' },
  { to: '/contact', anchor: '#contact', label: 'contact' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { github, linkedin } = profile.identity.links;
  const location = useLocation();
  const isBrowser = useIsBrowser();
  const { language, t, pathFor, switchLanguage } = useLanguage();
  const isHome = location.pathname === '/' || location.pathname === '/ar';

  const close = () => setOpen(false);

  const getHref = (link) => {
    if (isBrowser && isHome) return link.anchor;
    return pathFor(link.to);
  };

  const getLinkProps = (link) => {
    const href = getHref(link);
    const isAnchor = href.startsWith('#');
    return isAnchor
      ? { to: href, onClick: close }
      : { to: href, onClick: close };
  };

  return (
    <nav className="nav" aria-label={t('primaryNav')}>
      <div className="container">
        <div className="nav__inner">
          <Link className="nav__brand mono" to={pathFor('/')} aria-label={t('homeLink')} onClick={() => { close(); if (isHome) window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <span className="nav__brand-prefix" aria-hidden="true">~/</span>
            <span className="nav__brand-name">valabji</span>
            <span className="cursor" aria-hidden="true" />
          </Link>

          <ul className="nav__links">
            {LINKS.map((l) => (
              <li key={l.label}>
                <Link className="nav__link" {...getLinkProps(l)}>{t(l.label)}</Link>
              </li>
            ))}
            <li>
              <button className="nav__language mono" type="button" onClick={() => switchLanguage(language === 'ar' ? 'en' : 'ar')} aria-label={t('language')} lang={language === 'ar' ? 'en' : 'ar'}>
                <span className="lni lni-world" aria-hidden="true" />
                {language === 'ar' ? t('switchToEnglish') : t('switchToArabic')}
              </button>
            </li>
            <li className="nav__social">
              {github && (
                <a className="nav__icon" href={github} target="_blank" rel="noreferrer" aria-label={t('githubProfile')}>
                  <span className="lni lni-github" aria-hidden="true" />
                </a>
              )}
              {linkedin && (
                <a className="nav__icon" href={linkedin} target="_blank" rel="noreferrer" aria-label={t('linkedinProfile')}>
                  <span className="lni lni-linkedin" aria-hidden="true" />
                </a>
              )}
            </li>
          </ul>

          <button
            type="button"
            className={`nav__toggle${open ? ' nav__toggle--open' : ''}`}
            aria-label={open ? t('closeMenu') : t('openMenu')}
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
                  <Link className="nav__mobile-link" {...getLinkProps(l)}>{t(l.label)}</Link>
                </li>
              ))}
            </ul>
            <button className="nav__language nav__language--mobile mono" type="button" onClick={() => { close(); switchLanguage(language === 'ar' ? 'en' : 'ar') }} aria-label={t('language')} lang={language === 'ar' ? 'en' : 'ar'}>
              <span className="lni lni-world" aria-hidden="true" />
              {language === 'ar' ? t('switchToEnglish') : t('switchToArabic')}
            </button>
            <div className="nav__mobile-social">
              {github && (
                <a className="nav__icon" href={github} target="_blank" rel="noreferrer" aria-label={t('githubProfile')} onClick={close}>
                  <span className="lni lni-github" aria-hidden="true" />
                </a>
              )}
              {linkedin && (
                <a className="nav__icon" href={linkedin} target="_blank" rel="noreferrer" aria-label={t('linkedinProfile')} onClick={close}>
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
