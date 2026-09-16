import { useState, useEffect, useCallback, useRef } from 'react';
import profile from '../data/profile.json';
import Reveal from './Reveal';
import TiltCard from './TiltCard';
import './Certifications.css';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

export default function Certifications() {
  const { t, tr } = useLanguage();
  const certs = profile.certifications || [];
  const [active, setActive] = useState(null); // { image, title } | null
  const modalRef = useRef(null);
  const closeRef = useRef(null);
  const triggerRef = useRef(null);

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) return undefined;

    // Store the trigger and move focus into the dialog.
    triggerRef.current = document.activeElement;
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        close();
      } else if (e.key === 'Tab') {
        const dialog = modalRef.current;
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
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const trigger = triggerRef.current;
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      trigger?.focus?.();
    };
  }, [active, close]);

  if (!certs.length) return null;

  return (
    <section id="certifications" className="section" aria-labelledby="certs-title">
      <div className="container">
        <Reveal as="header" className="certs-head">
          <p className="certs-eyebrow mono">
            <span className="certs-command" dir="ltr">
              <span className="certs-prompt">$</span> ls ~/credentials
            </span>
          </p>
          <h2 id="certs-title" className="certs-title">
            <span className="certs-slashes" aria-hidden="true">//</span>
            <span className="gradient-text">{t('certifications')}</span>
          </h2>
          <p className="certs-sub">
            {t('verifiedCredentials', { count: certs.length })}
          </p>
        </Reveal>

        <ul className="certs-grid" role="list">
          {certs.map((cert, i) => {
            const hasImage = Boolean(cert.image);
            const key = `${cert.title}-${i}`;
            return (
              <TiltCard
                as="li"
                key={key}
                className="card cert-card"
                reveal
                glare
                max={6}
                delay={`${Math.min(i * 0.06, 0.4)}s`}
              >
                {hasImage ? (
                  <button
                    type="button"
                    className="cert-thumb"
                    onClick={() => setActive({ image: cert.image, title: cert.title })}
                    aria-label={t('viewCredential', { name: tr(cert.title) })}
                  >
                    <img src={cert.image} alt={t('credentialAlt', { name: tr(cert.title) })} loading="lazy" />
                  </button>
                ) : (
                  <div className="cert-noimg" aria-hidden="true">
                    <span className="cert-code" dir="ltr">
                      <span className="cert-dollar">const</span> credential = &#123; ... &#125;
                    </span>
                  </div>
                )}

                <div className="cert-body">
                  <span className="cert-issuer mono">
                    <span className="cert-const">@</span>{tr(cert.issuer)}
                  </span>
                  <h3 className="cert-name" dir="auto">{tr(cert.title)}</h3>

                  <dl className="cert-meta">
                    {cert.issued ? (
                      <div className="cert-row">
                        <dt className="cert-key">{t('issued')}</dt>
                        <dd>{tr(cert.issued)}</dd>
                      </div>
                    ) : null}
                    {cert.credentialId ? (
                      <div className="cert-row">
                        <dt className="cert-key">id:</dt>
                        <dd className="cert-id">{cert.credentialId}</dd>
                      </div>
                    ) : null}
                  </dl>

                  {cert.url ? (
                    <div className="cert-foot">
                      <a
                        className="cert-link"
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="lni lni-link" aria-hidden="true" />
                        {t('showCredential')}
                      </a>
                    </div>
                  ) : null}
                </div>
              </TiltCard>
            );
          })}
        </ul>
      </div>

      {active ? (
        <div
          className="cert-modal"
          role="dialog"
          aria-modal="true"
          aria-label={t('credentialFull', { name: tr(active.title) })}
          onClick={close}
          ref={modalRef}
        >
          <div className="cert-modal-inner" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="cert-modal-close"
              onClick={close}
              aria-label={t('closePreview')}
              ref={closeRef}
            >
              ✕
            </button>
            <img src={active.image} alt={t('credentialFull', { name: tr(active.title) })} />
            <p className="cert-modal-cap mono">
              <span className="cert-prompt">//</span> {tr(active.title)}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
