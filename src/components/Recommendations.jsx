import profile from '../data/profile.json';
import './Recommendations.css';

export default function Recommendations() {
  const recommendations = profile.recommendations || [];

  if (!recommendations.length) return null;

  return (
    <section id="recommendations" className="section" aria-labelledby="recommendations-heading">
      <div className="container">
        <header className="rec-head reveal">
          <span className="rec-head__mark mono" aria-hidden="true">{'//'}</span>
          <h2 id="recommendations-heading" className="rec-head__title">
            <span className="gradient-text">recommendations</span>
          </h2>
        </header>

        <ul className="rec-grid">
          {recommendations.map((rec, i) => (
            <li
              key={`${rec.name}-${rec.date}`}
              className="card rec-card reveal"
              style={{ animationDelay: `${Math.min(i * 0.08, 0.4)}s` }}
            >
              <figure>
                <span className="rec-card__quote mono" aria-hidden="true">&ldquo;</span>
                <blockquote className="rec-card__text" dir="auto">
                  {rec.text}
                </blockquote>
                <figcaption className="rec-card__meta">
                  <span className="rec-card__name">{rec.name}</span>
                  {rec.title && <span className="rec-card__role">{rec.title}</span>}
                  {rec.relationship && (
                    <span className="rec-card__rel mono">{rec.relationship}</span>
                  )}
                  {rec.date && (
                    <time className="rec-card__date mono">{rec.date}</time>
                  )}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
