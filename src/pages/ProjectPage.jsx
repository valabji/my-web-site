import { useParams, Link } from 'react-router-dom';
import portfolio from '../data/portfolio.json';
import SEO from '../components/SEO';
import './ProjectPage.css';
import { useLanguage } from '../i18n/LanguageContext.jsx';

function yearOf(dateStr) {
  if (!dateStr) return null;
  const y = String(dateStr).slice(0, 4);
  return /^\d{4}$/.test(y) ? y : null;
}

export default function ProjectPage() {
  const { slug } = useParams();
  const { t, tr, isArabic, pathFor } = useLanguage();
  const sourceProject = portfolio.projects.find((p) => p.slug === slug);
  const project = sourceProject ? {
    ...sourceProject,
    title: isArabic ? (sourceProject.title_ar || sourceProject.title) : sourceProject.title,
    description: isArabic ? (sourceProject.description_ar || sourceProject.description) : sourceProject.description,
    tagline: isArabic ? (sourceProject.description_ar || sourceProject.tagline) : sourceProject.tagline,
  } : null;

  if (!project) {
    return (
      <section className="section">
        <div className="container" style={{ textAlign: 'center', paddingTop: '8rem' }}>
          <span className="tag">~/404</span>
          <h1 className="mono gradient-text" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: '1.5rem 0' }}>
            {t('projectNotFound')}
          </h1>
          <Link to={pathFor('/projects')} className="btn">
            <span className="lni lni-arrow-left" aria-hidden="true" />
            {t('backProjects')}
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
            name: isArabic ? 'عبدالرحمن فلبجي' : 'Abdalrahman Valabji',
            url: `https://valabji.com${isArabic ? '/ar' : ''}`,
          },
          datePublished: project.date_completed || undefined,
          applicationCategory: 'MobileApplication',
        }}
      />

      <section className="section pj-detail">
        <div className="container">
          <Link to={pathFor('/projects')} className="pj-detail-back mono">
            <span className="lni lni-arrow-left" aria-hidden="true" />
            /{t('projects')}
          </Link>

          <article className="pj-detail-article">
            <header className="pj-detail-head">
              <span className="pj-detail-eyebrow mono">// {t('project')}</span>
              <h1 className="pj-detail-title" dir="auto">
                {project.title}
              </h1>
              {!isArabic && project.title_ar && (
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
                    <dt>{t('year')}</dt>
                    <dd>{year}</dd>
                  </div>
                )}
                {project.work_type && (
                  <div className="pj-detail-meta-item">
                    <dt>{t('type')}</dt>
                    <dd>{tr(project.work_type)}</dd>
                  </div>
                )}
                {project.duration && (
                  <div className="pj-detail-meta-item">
                    <dt>{t('builtIn')}</dt>
                    <dd>{tr(project.duration)}</dd>
                  </div>
                )}
                {project.data_source && (
                  <div className="pj-detail-meta-item">
                    <dt>{t('data')}</dt>
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
                      alt={t('screenshot', { name: project.title })}
                      loading="lazy"
                    />
                  </figure>
                ))}
              </div>
            )}

            <div className="pj-detail-body">
              <p className="pj-detail-desc">{project.description}</p>

              {!isArabic && project.description_ar && (
                <p className="pj-detail-desc pj-detail-desc-ar" dir="rtl">
                  {project.description_ar}
                </p>
              )}

              {tech.length > 0 && (
                <div className="pj-detail-tech">
                  <h2 className="mono pj-detail-section-head">
                    <span className="gradient-text">{t('techStackTitle')}</span>
                  </h2>
                  <ul className="pj-detail-tags" aria-label={t('technologiesUsed')}>
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
                      {t('viewMostaql')}
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
