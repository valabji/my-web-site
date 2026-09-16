import { useEffect, useState } from 'react';
import profile from '../data/profile.json';
import Reveal from './Reveal';
import TiltCard from './TiltCard';
import './Recommendations.css';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function Recommendations() {
  const { language, isArabic, t, tr } = useLanguage();
  const recommendations = profile.recommendations || [];

  if (!recommendations.length) return null;

  return (
    <section id="recommendations" className="section" aria-labelledby="recommendations-heading">
      <div className="container">
        <Reveal as="header" className="rec-head">
          <span className="rec-head__mark mono" aria-hidden="true">{'//'}</span>
          <h2 id="recommendations-heading" className="rec-head__title">
            <span className="gradient-text">{t('recommendations')}</span>
          </h2>
        </Reveal>

        <ul className="rec-grid">
          {recommendations.map((rec, i) => (
            <RecommendationCard
              key={`${rec.name}-${rec.date}`}
              rec={rec}
              index={i}
              isArabic={isArabic}
              language={language}
              t={t}
              tr={tr}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function RecommendationCard({ rec, index, isArabic, language, t, tr }) {
  const [showOriginal, setShowOriginal] = useState(false);
  const textId = `recommendation-${index}-text`;

  useEffect(() => {
    setShowOriginal(false);
  }, [language]);

  return (
    <TiltCard
      as="li"
      className="card rec-card"
      reveal
      max={5}
      delay={`${Math.min(index * 0.08, 0.4)}s`}
    >
      <figure>
        <span className="rec-card__quote mono" aria-hidden="true">&ldquo;</span>
        <div className="rec-card__text-wrap">
          <blockquote
            id={textId}
            className="rec-card__text"
            dir={showOriginal ? 'ltr' : 'auto'}
            lang={showOriginal ? 'en' : language}
          >
            {showOriginal ? rec.text : tr(rec.text)}
          </blockquote>
          {isArabic && (
            <button
              className="rec-card__original-toggle mono"
              type="button"
              aria-controls={textId}
              aria-pressed={showOriginal}
              onClick={() => setShowOriginal((visible) => !visible)}
            >
              <span aria-hidden="true">{showOriginal ? '↩' : 'Aa'}</span>
              {showOriginal ? t('showTranslation') : t('showOriginal')}
            </button>
          )}
        </div>
        <figcaption className="rec-card__meta">
          <span className="rec-card__name">{rec.name}</span>
          {rec.title && <span className="rec-card__role">{tr(rec.title)}</span>}
          {rec.relationship && (
            <span className="rec-card__rel mono">{tr(rec.relationship)}</span>
          )}
          {rec.date && (
            <time className="rec-card__date mono">{tr(rec.date)}</time>
          )}
        </figcaption>
      </figure>
    </TiltCard>
  );
}
