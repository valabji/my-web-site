import { Link } from 'react-router-dom'

export default function ErrorPage() {
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
          404: route not found
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
            bash: no such file or directory
          </span>
          <br />
          The page you requested has moved, was removed, or never existed.
        </p>
        <Link to="/" className="btn">
          <span className="lni lni-home" aria-hidden="true" />
          cd ~/home
        </Link>
      </div>
    </section>
  )
}
