import { useParams, Link } from 'react-router-dom';
import portfolio from '../data/portfolio.json';
import SEO from '../components/SEO';
import './ProjectPage.css';

function yearOf(dateStr) {
  if (!dateStr) return null;
  const y = String(dateStr).slice(0, 4);
  return /^\d{4}$/.test(y) ? y : null;
}

export default function ProjectPage() {
  const { slug } = useParams();
  const project = portfolio.projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <section className="section">
        <div className="container" style={{ textAlign: 'center', paddingTop: '8rem' }}>
          <span className="tag">~/404</span>
          <h1 className="mono gradient-text" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: '1.5rem 0' }}>
            project not found
          </h1>
          <Link to="/projects" className="btn">
            <span className="lni lni-arrow-left" aria-hidden="true" />
            Back to projects
          </Link>
        </div>
      </section>
    );
  }

  const images = (project.images || []).filter((im) => im.role !== 'cover');
  const year = yearOf(project.date_completed);
  const tech = project.tech || [];
  const links = project.links || [];

  return (
    <>
      <SEO
        title={project.title}
        description={project.description}
        canonical={`/projects/${slug}`}
        image={`https://valabji.com/${project.cover}`}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: project.title,
          description: project.description,
          author: {
            '@type': 'Person',
            name: 'Abdalrahman Valabji',
            url: 'https://valabji.com',
          },
          datePublished: project.date_completed || undefined,
          applicationCategory: 'MobileApplication',
        }}
      />

      <section className="section pj-detail">
        <div className="container">
          <Link to="/projects" className="pj-detail-back mono">
            <span className="lni lni-arrow-left" aria-hidden="true" />
            /projects
          </Link>

          <article className="pj-detail-article">
            <header className="pj-detail-head">
              <span className="pj-detail-eyebrow mono">// project</span>
              <h1 className="pj-detail-title" dir="auto">
                {project.title}
              </h1>
              {project.title_ar && (
                <p className="pj-detail-title-ar" dir="rtl">
                  {project.title_ar}
                </p>
              )}
              {project.tagline && (
                <p className="pj-detail-tagline">{project.tagline}</p>
              )}
              <dl className="pj-detail-meta mono">
                {year && (
                  <div className="pj-detail-meta-item">
                    <dt>year</dt>
                    <dd>{year}</dd>
                  </div>
                )}
                {project.work_type && (
                  <div className="pj-detail-meta-item">
                    <dt>type</dt>
                    <dd>{project.work_type}</dd>
                  </div>
                )}
                {project.duration && (
                  <div className="pj-detail-meta-item">
                    <dt>built in</dt>
                    <dd>{project.duration}</dd>
                  </div>
                )}
                {project.data_source && (
                  <div className="pj-detail-meta-item">
                    <dt>data</dt>
                    <dd>{project.data_source}</dd>
                  </div>
                )}
              </dl>
            </header>

            {images.length > 0 && (
              <div className="pj-detail-gallery">
                {images.map((img) => (
                  <figure key={img.file} className="pj-detail-img-wrap">
                    <img
                      src={`/${img.file}`}
                      alt={`${project.title} screenshot`}
                      loading="lazy"
                    />
                  </figure>
                ))}
              </div>
            )}

            <div className="pj-detail-body">
              <p className="pj-detail-desc">{project.description}</p>

              {project.description_ar && (
                <p className="pj-detail-desc pj-detail-desc-ar" dir="rtl">
                  {project.description_ar}
                </p>
              )}

              {tech.length > 0 && (
                <div className="pj-detail-tech">
                  <h2 className="mono pj-detail-section-head">
                    <span className="gradient-text">Tech Stack</span>
                  </h2>
                  <ul className="pj-detail-tags" aria-label="Technologies used">
                    {tech.map((t) => (
                      <li key={t}>
                        <span className="tag">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {links.length > 0 && (
                <div className="pj-detail-links">
                  {links.map((l) => (
                    <a
                      key={l.url}
                      className="btn"
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="lni lni-link" aria-hidden="true" />
                      {l.label || 'link'}
                    </a>
                  ))}
                  {project.url && (
                    <a
                      className="btn-ghost"
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="lni lni-link" aria-hidden="true" />
                      view on mostaql
                    </a>
                  )}
                </div>
              )}
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
