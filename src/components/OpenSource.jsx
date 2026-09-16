import profile from '../data/profile.json'
import Reveal from './Reveal'
import TiltCard from './TiltCard'
import './OpenSource.css'
import { useLanguage } from '../i18n/LanguageContext.jsx'

// Approximate GitHub language colors
const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  PHP: '#4F5D95',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Java: '#b07219',
  Ruby: '#701516',
  Go: '#00ADD8',
  Shell: '#89e051',
}

const RepoIcon = () => (
  <svg
    className="os-repo-icon"
    viewBox="0 0 16 16"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1H4.5a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" />
  </svg>
)

const StarIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" width="1em" height="1em">
    <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
  </svg>
)

const ExternalIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M3.75 2h3.5a.75.75 0 0 1 0 1.5h-3.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-3.5a.75.75 0 0 1 1.5 0v3.5A1.75 1.75 0 0 1 12.25 14h-8.5A1.75 1.75 0 0 1 2 12.25v-8.5C2 2.784 2.784 2 3.75 2Zm6.854-1h4.146a.75.75 0 0 1 .75.75v4.146a.75.75 0 0 1-1.28.53L13.5 5.31 8.78 10.03a.75.75 0 0 1-1.06-1.06l4.72-4.72-1.114-1.115a.75.75 0 0 1 .53-1.28Z" />
  </svg>
)

export default function OpenSource() {
  const { t, tr } = useLanguage()
  const { github } = profile

  return (
    <section id="opensource" className="section" aria-labelledby="opensource-title">
      <div className="container">
        <Reveal as="header" className="os-head">
          <span className="os-eyebrow mono">// {t('openSource')}</span>
          <h2 id="opensource-title" className="os-title">
            <span className="gradient-text">{t('buildingOpen')}</span>
          </h2>
          <p className="os-intro">
            <span className="os-prompt" aria-hidden="true">$</span>
            <span>
              <b>{github.publicRepos}</b> {t('publicRepos')}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              <b>{github.followers}</b> {t('followers')}
            </span>
            <span aria-hidden="true">·</span>
            <a
              className="os-profile-link"
              href={github.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('visitGithub', { name: github.username })}
            >
              <span className="lni lni-github" aria-hidden="true" />
              @{github.username}
            </a>
          </p>
        </Reveal>

        <ul className="os-grid">
          {github.repos.map((repo, i) => {
            const langColor = repo.language ? LANG_COLORS[repo.language] || 'var(--text-dim)' : null
            return (
              <li key={repo.name}>
                <TiltCard as="article" className="card os-card" reveal max={5} delay={`${Math.min(i * 60, 360)}ms`}>
                  <div className="os-card-top">
                    <RepoIcon />
                    <h3 className="os-card-name">{repo.name}</h3>
                  </div>

                  {repo.description && (
                    <p className="os-card-desc" dir="auto">
                      {tr(repo.description)}
                    </p>
                  )}

                  {repo.topics && repo.topics.length > 0 && (
                    <div className="os-topics" aria-label={t('topics')}>
                      {repo.topics.slice(0, 4).map((t) => (
                        <span key={t} className="os-topic">#{t}</span>
                      ))}
                    </div>
                  )}

                  <footer className="os-foot">
                    {repo.language && (
                      <span className="os-meta">
                        <span
                          className="os-lang-dot"
                          style={{ background: langColor, color: langColor }}
                          aria-hidden="true"
                        />
                        {repo.language}
                      </span>
                    )}
                    <span className="os-meta" aria-label={t('stars', { count: repo.stars })}>
                      <StarIcon />
                      {repo.stars}
                    </span>

                    <span className="os-foot-links">
                      {repo.homepage && (
                        <a
                          className="os-foot-link"
                          href={repo.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={t('openLive', { name: repo.name })}
                        >
                          <span className="lni lni-link" aria-hidden="true" />
                          {t('live')}
                        </a>
                      )}
                      <a
                        className="os-foot-link"
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t('viewGithub', { name: repo.name })}
                      >
                        <ExternalIcon />
                        {t('code')}
                      </a>
                    </span>
                  </footer>
                </TiltCard>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
