import { useState } from 'react';
import profile from '../data/profile.json';
import { useCountUp } from '../hooks/useCountUp';
import Hero3D from './Hero3D';
import { hasWebGL } from './hero3d/webgl';
import './Hero.css';

function HeroStat({ value, label }) {
  const ref = useCountUp(value);
  return (
    <div className="hero__stat">
      <dd className="hero__stat-value gradient-text" ref={ref}>{value}</dd>
      <dt className="hero__stat-label">{label}</dt>
    </div>
  );
}

export default function Hero() {
  const { identity, stats, techStack } = profile;
  const { name, headline, tagline, location, photo, links } = identity;

  // Decide once, client-side, whether to mount the real 3D scene or fall
  // back to the static code-editor window.
  const [webgl] = useState(hasWebGL);

  // Split name so part of it gets the gradient treatment.
  const nameParts = name.trim().split(/\s+/);
  const first = nameParts[0];
  const rest = nameParts.slice(1).join(' ');

  // A few frontend techs for the pseudo-code window.
  const stack = techStack.frontend.slice(0, 4);

  return (
    <section id="home" className="section hero" aria-label="Introduction">
      <div className="container hero__grid">
        {/* ---------- Left column ---------- */}
        <div className="hero__left">
          <span className="hero__kicker hero__anim hero__d1">
            <span className="lni lni-code" aria-hidden="true" />
            // software engineer
          </span>

          <h1 className="hero__name hero__anim hero__d1">
            <span>{first}</span>
            {rest && <span className="gradient-text">{rest}</span>}
          </h1>

          <p className="hero__headline hero__anim hero__d2">{headline}</p>
          <p className="hero__tagline hero__anim hero__d2">{tagline}</p>

          <p className="hero__location hero__anim hero__d3">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11Z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            {location}
          </p>

          <div className="hero__cta hero__anim hero__d4">
            <a className="btn" href="#projects">
              <span className="lni lni-briefcase" aria-hidden="true" />
              View Work
            </a>
            <a className="btn-ghost" href={links.github}
              target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
              <span className="lni lni-github" aria-hidden="true" />
              GitHub
            </a>
            <a className="btn-ghost" href={links.linkedin}
              target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
              <span className="lni lni-linkedin" aria-hidden="true" />
              LinkedIn
            </a>
            <a className="btn-ghost" href="#contact">
              <span className="lni lni-envelope" aria-hidden="true" />
              Contact
            </a>
          </div>

          <dl className="hero__stats hero__anim hero__d5" aria-label="Key stats">
            {stats.map((s) => (
              <HeroStat key={s.label} value={s.value} label={s.label} />
            ))}
          </dl>
        </div>

        {/* ---------- Right column: 3D scene (or terminal fallback) ---------- */}
        <div className={`hero__right hero__anim${webgl ? ' hero__right--3d' : ''}`}>
          <img
            className="hero__photo"
            src={photo}
            alt={name}
            loading="eager"
            width="118"
            height="118"
          />

          {webgl ? (
            <div className="hero__stage">
              <Hero3D />
            </div>
          ) : (
          <div className="hero__terminal" role="img"
            aria-label="Code editor window describing the developer">
            <div className="hero__titlebar">
              <span className="hero__dots" aria-hidden="true">
                <span className="hero__dot hero__dot--r" />
                <span className="hero__dot hero__dot--y" />
                <span className="hero__dot hero__dot--g" />
              </span>
              <span className="hero__title-path mono">~/valabji</span>
            </div>

            <pre className="hero__code" aria-hidden="true">
              <code>
                <span className="hero__line">
                  <span className="tk-com">// whoami</span>
                </span>
                <span className="hero__line">
                  <span className="tk-key">const</span>{' '}
                  <span className="tk-prop">dev</span>{' '}
                  <span className="tk-punc">=</span>{' '}
                  <span className="tk-punc">{'{'}</span>
                </span>
                <span className="hero__line">
                  {'  '}<span className="tk-prop">role</span>
                  <span className="tk-punc">:</span>{' '}
                  <span className="tk-str">&apos;{headline}&apos;</span>
                  <span className="tk-punc">,</span>
                </span>
                <span className="hero__line">
                  {'  '}<span className="tk-prop">stack</span>
                  <span className="tk-punc">:</span>{' '}
                  <span className="tk-punc">[</span>
                  {stack.map((t, i) => (
                    <span key={t}>
                      <span className="tk-str">&apos;{t}&apos;</span>
                      {i < stack.length - 1 && (
                        <span className="tk-punc">, </span>
                      )}
                    </span>
                  ))}
                  <span className="tk-punc">]</span>
                  <span className="tk-punc">,</span>
                </span>
                <span className="hero__line">
                  {'  '}<span className="tk-prop">years</span>
                  <span className="tk-punc">:</span>{' '}
                  <span className="tk-num">13</span>
                  <span className="tk-punc">,</span>
                </span>
                <span className="hero__line">
                  {'  '}<span className="tk-prop">location</span>
                  <span className="tk-punc">:</span>{' '}
                  <span className="tk-str">&apos;{location}&apos;</span>
                  <span className="tk-punc">,</span>
                </span>
                <span className="hero__line">
                  <span className="tk-punc">{'}'}</span>
                </span>
                <span className="hero__line">
                  <span className="tk-fn">ship</span>
                  <span className="tk-punc">(</span>
                  <span className="tk-prop">dev</span>
                  <span className="tk-punc">)</span>
                  <span className="cursor" aria-hidden="true" />
                </span>
              </code>
            </pre>
          </div>
          )}
        </div>
      </div>
    </section>
  );
}
