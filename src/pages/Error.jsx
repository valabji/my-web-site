import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function ErrorPage() {
  const { t, pathFor } = useLanguage()
  return (
    <section
      className="section"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.5rem',
        }}
      >
        <span className="tag">~/404</span>
        <h1
          className="mono gradient-text"
          style={{
            fontSize: 'clamp(2.4rem, 9vw, 4.5rem)',
            fontWeight: 700,
            lineHeight: 1.05,
          }}
        >
          {t('notFound')}
        </h1>
        <p
          className="mono"
          style={{
            color: 'var(--text-dim)',
            maxWidth: '46ch',
          }}
        >
          <span style={{ color: 'var(--accent)' }}>$</span> cd{' '}
          {typeof window !== 'undefined' ? window.location.pathname : '/'}
          <br />
          <span style={{ color: 'var(--warn)' }}>
            {t('missingPath')}
          </span>
          <br />
          {t('missingExplain')}
        </p>
        <Link to={pathFor('/')} className="btn">
          <span className="lni lni-home" aria-hidden="true" />
          {t('goHome')}
        </Link>
      </div>
    </section>
  )
}
