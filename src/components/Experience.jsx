import { useState } from 'react';
import profile from '../data/profile.json';
import Reveal from './Reveal';
import { useReveal } from '../hooks/useReveal';
import { useTilt } from '../hooks/useTilt';
import './Experience.css';

const BULLET_PREVIEW = 4;

function isUrl(str) {
  return /^https?:\/\//i.test(str.trim());
}

function ExperienceItem({ job, index }) {
  const [expanded, setExpanded] = useState(false);
  const itemRef = useReveal();
  const cardRef = useTilt({ max: 5 });

  const bullets = job.bullets || [];
  const hasOverflow = bullets.length > BULLET_PREVIEW;
  const visible = expanded ? bullets : bullets.slice(0, BULLET_PREVIEW);
  const hiddenCount = bullets.length - BULLET_PREVIEW;

  const panelId = `exp-bullets-${index}`;

  return (
    <li
      ref={itemRef}
      className="xp-item reveal"
      style={{ '--rv-delay': `${Math.min(index * 60, 360)}ms` }}
    >
      <span className={`xp-node${job.current ? ' xp-node--current' : ''}`} aria-hidden="true" />

      <article ref={cardRef} className="xp-card card tilt-3d">
        <header className="xp-head">
          <div className="xp-titleRow">
            <h3 className="xp-title">{job.title}</h3>
            {job.current && (
              <span className="xp-badge mono" aria-label="Current role">
                <span className="xp-badge-dot" aria-hidden="true" />
                current
              </span>
            )}
          </div>

          <p className="xp-company mono">
            <span className="xp-prompt" aria-hidden="true">@</span>
            <span className="xp-company-name gradient-text">{job.company}</span>
            {job.type && <span className="xp-type">· {job.type}</span>}
          </p>

          <dl className="xp-meta mono">
            <div className="xp-meta-item">
              <dt className="xp-meta-key" aria-hidden="true">const&nbsp;range&nbsp;=</dt>
              <dd className="xp-meta-val">
                {job.start} — {job.end}
                {job.duration && <span className="xp-dur"> ({job.duration})</span>}
              </dd>
            </div>
            {job.location && (
              <div className="xp-meta-item">
                <dt className="xp-meta-key" aria-hidden="true">//&nbsp;loc</dt>
                <dd className="xp-meta-val xp-loc">{job.location}</dd>
              </div>
            )}
          </dl>
        </header>

        {bullets.length > 0 && (
          <>
            <ul className="xp-bullets" id={panelId}>
              {visible.map((b, i) => (
                <li className="xp-bullet" key={i}>
                  <span className="xp-bullet-mark mono" aria-hidden="true">&gt;</span>
                  {isUrl(b) ? (
                    <a href={b.trim()} target="_blank" rel="noopener noreferrer" className="xp-bullet-link">
                      {b.trim()}
                    </a>
                  ) : (
                    <span dir="auto">{b}</span>
                  )}
                </li>
              ))}
            </ul>

            {hasOverflow && (
              <button
                type="button"
                className="xp-toggle mono"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                aria-controls={panelId}
              >
                <span className="xp-toggle-sym" aria-hidden="true">{expanded ? '–' : '+'}</span>
                {expanded ? 'show less' : `show ${hiddenCount} more`}
              </button>
            )}
          </>
        )}

        {job.tech && job.tech.length > 0 && (
          <ul className="xp-tech" aria-label="Technologies used">
            {job.tech.map((t) => (
              <li key={t}>
                <span className="tag">{t}</span>
              </li>
            ))}
          </ul>
        )}
      </article>
    </li>
  );
}

export default function Experience() {
  const experience = profile.experience || [];
  const timelineRef = useReveal();

  return (
    <section id="experience" className="section xp" aria-labelledby="xp-heading">
      <div className="container">
        <Reveal as="header" className="xp-section-head">
          <h2 className="xp-eyebrow mono" id="xp-heading">
            <span className="gradient-text">// experience</span>
            <span className="cursor" aria-hidden="true" />
          </h2>
          <p className="xp-subtitle">
            A timeline of where I&apos;ve shipped, led, and leveled up.
          </p>
        </Reveal>

        <ol ref={timelineRef} className="xp-timeline" role="list">
          {experience.map((job, i) => (
            <ExperienceItem key={`${job.company}-${job.title}-${i}`} job={job} index={i} />
          ))}
        </ol>
      </div>
    </section>
  );
}
