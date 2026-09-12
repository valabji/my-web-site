import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import portfolio from '../data/portfolio.json';
import Reveal from './Reveal';
import TiltCard from './TiltCard';
import './Projects.css';

function yearOf(dateStr) {
  if (!dateStr) return null;
  const y = String(dateStr).slice(0, 4);
  return /^\d{4}$/.test(y) ? y : null;
}

// The gallery shows screenshots; the small cover/logo thumbnail (role "cover")
// is skipped — it still serves as the card cover. Single source of truth shared
// by the card badge and the lightbox so their counts always agree. Falls back to
// all images if filtering would empty the set (projects with only a cover).
function galleryImagesOf(project) {
  const all = project.images || [];
  const gallery = all.filter((im) => im.role !== 'cover');
  return gallery.length ? gallery : all;
}

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

function Lightbox({ project, onClose }) {
  const images = galleryImagesOf(project);
  const [index, setIndex] = useState(0);
  const total = images.length;
  const dialogRef = useRef(null);
  const thumbRefs = useRef([]);
  const touchStartX = useRef(null);
  const triggerRef = useRef(null);

  const go = useCallback(
    (dir) => {
      setIndex((i) => (total ? (i + dir + total) % total : 0));
    },
    [total]
  );

  // Keyboard handling + focus trap
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      } else if (e.key === 'Tab') {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const items = dialog.querySelectorAll(FOCUSABLE);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        const activeEl = document.activeElement;
        if (e.shiftKey) {
          if (activeEl === first || activeEl === dialog) {
            e.preventDefault();
            last.focus();
          }
        } else if (activeEl === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, onClose]);

  // Body scroll lock
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Focus dialog on open, restore focus to trigger on close
  useEffect(() => {
    triggerRef.current = document.activeElement;
    dialogRef.current?.focus();
    return () => {
      triggerRef.current?.focus?.();
    };
  }, []);

  // Keep active thumbnail in view
  useEffect(() => {
    const el = thumbRefs.current[index];
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [index]);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  const year = yearOf(project.date_completed);
  const current = images[index];
  const tech = project.tech || [];
  const links = project.links || [];

  return (
    <div className="pj-overlay" onClick={onClose}>
      <div
        className="pj-modal"
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
        tabIndex={-1}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="pj-close" onClick={onClose} aria-label="Close (Esc)">
          <span aria-hidden="true">×</span>
        </button>

        <div className="pj-modal-grid">
          {/* Gallery */}
          <div className="pj-gallery" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div className="pj-stage" aria-live="polite">
              {current && (
                <img
                  key={current.file}
                  src={'/' + current.file}
                  alt={`${project.title} — image ${index + 1} of ${total}`}
                  loading="eager"
                  className="pj-stage-img"
                />
              )}
              {total > 1 && (
                <>
                  <button
                    className="pj-nav pj-nav-prev"
                    onClick={() => go(-1)}
                    aria-label="Previous image"
                  >
                    <span aria-hidden="true">‹</span>
                  </button>
                  <button
                    className="pj-nav pj-nav-next"
                    onClick={() => go(1)}
                    aria-label="Next image"
                  >
                    <span aria-hidden="true">›</span>
                  </button>
                  <div className="pj-counter mono" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </div>
                </>
              )}
            </div>

            {total > 1 && (
              <div className="pj-thumbs" role="tablist" aria-label="Gallery thumbnails">
                {images.map((img, i) => (
                  <button
                    key={img.file}
                    ref={(el) => (thumbRefs.current[i] = el)}
                    className={'pj-thumb' + (i === index ? ' is-active' : '')}
                    onClick={() => setIndex(i)}
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Show image ${i + 1}`}
                  >
                    <img src={'/' + img.file} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info panel */}
          <div className="pj-info">
            <div className="pj-info-head">
              <span className="pj-info-tag mono">// project</span>
              <h3 className="pj-info-title" dir="auto">{project.title}</h3>
              {project.title_ar && (
                <p className="pj-info-sub" dir="rtl">{project.title_ar}</p>
              )}
              {project.tagline && (
                <p className="pj-info-tagline">{project.tagline}</p>
              )}
              <div className="pj-info-meta mono">
                {year && <span className="pj-meta-item"><span className="pj-meta-key">year</span> {year}</span>}
                <span className="pj-meta-item">
                  <span className="pj-meta-key">images</span> {total}
                </span>
                {project.work_type && (
                  <span className="pj-meta-item"><span className="pj-meta-key">type</span> {project.work_type}</span>
                )}
                {project.duration && (
                  <span className="pj-meta-item"><span className="pj-meta-key">built in</span> {project.duration}</span>
                )}
                {project.data_source && (
                  <span className="pj-meta-item"><span className="pj-meta-key">data</span> {project.data_source}</span>
                )}
              </div>
            </div>

            <p className="pj-info-desc" dir="auto">{project.description}</p>

            {tech.length > 0 && (
              <ul className="pj-tech" aria-label="Technologies used">
                {tech.map((t) => (
                  <li key={t}><span className="tag">{t}</span></li>
                ))}
              </ul>
            )}

            <div className="pj-info-links">
              {links.map((l) => (
                <a
                  key={l.url}
                  className="btn-ghost pj-info-link"
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span aria-hidden="true">$</span> {(l.label || 'link').toLowerCase()}
                  <span className="lni lni-link" aria-hidden="true" />
                </a>
              ))}
              {project.url && (
                <a
                  className="btn-ghost pj-info-link"
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span aria-hidden="true">$</span> view on mostaql
                  <span className="lni lni-link" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const projects = portfolio.projects || [];
  const count = portfolio.project_count ?? projects.length;
  const [active, setActive] = useState(null);

  const openProject = (p) => setActive(p);
  const closeLightbox = useCallback(() => setActive(null), []);

  return (
    <section id="projects" className="section pj-section" aria-labelledby="pj-heading">
      <div className="container">
        <Reveal as="header" className="pj-header">
          <span className="pj-eyebrow mono">// selected work</span>
          <h2 id="pj-heading" className="pj-title">
            <span className="gradient-text">Projects</span>
            <span className="pj-count mono" aria-label={`${count} projects`}>
              [{String(count).padStart(2, '0')}]
            </span>
          </h2>
          <p className="pj-sub mono">
            <span className="pj-prompt">const</span> portfolio = await load(
            <span className="pj-str">'./work'</span>)
            <span className="cursor" aria-hidden="true" />
          </p>
        </Reveal>

        <ul className="pj-grid" role="list">
          {projects.map((p, i) => {
            const year = yearOf(p.date_completed);
            const shots = galleryImagesOf(p).length;
            return (
              <Reveal as="li" key={p.id} delay={`${Math.min(i * 60, 360)}ms`}>
                <TiltCard as="article" className="pj-card" glare max={6}>
                  <Link
                    to={`/projects/${p.slug}`}
                    className="pj-cover pj-cover-btn"
                    aria-label={`View ${p.title}`}
                  >
                    <img
                      src={'/' + p.cover}
                      alt=""
                      loading="lazy"
                      className="pj-cover-img"
                    />
                    <span className="pj-badge mono" aria-hidden="true">
                      <span className="lni lni-image" aria-hidden="true" /> {shots}
                    </span>
                    <span className="pj-open-hint mono" aria-hidden="true">
                      {'>'} view
                    </span>
                  </Link>

                  <div className="pj-card-body">
                    <h3 className="pj-card-title" dir="auto">{p.title}</h3>
                    <p className="pj-card-desc" dir="auto">{p.tagline || p.description}</p>
                    {p.tech && p.tech.length > 0 && (
                      <ul className="pj-card-tech" aria-hidden="true">
                        {p.tech.slice(0, 3).map((t) => (
                          <li key={t} className="pj-card-chip">{t}</li>
                        ))}
                        {p.tech.length > 3 && (
                          <li className="pj-card-chip pj-card-chip--more">+{p.tech.length - 3}</li>
                        )}
                      </ul>
                    )}
                    <div className="pj-card-foot mono">
                      <span className="pj-year">{year ? year : '—'}</span>
                      <span className="pj-slug">/{p.slug}</span>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </ul>
      </div>

      {active && <Lightbox project={active} onClose={closeLightbox} />}
    </section>
  );
}
