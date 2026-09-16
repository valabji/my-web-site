import profile from '../data/profile.json'
import Reveal from './Reveal'
import TiltCard from './TiltCard'
import './Skills.css'
import { useLanguage } from '../i18n/LanguageContext.jsx'

/**
 * Skills — groups profile.skills by category and renders each group
 * as a card of mono pills. Pills with endorsements > 0 show a small
 * mono badge ("x3") plus a tiny endorsement meter.
 */
export default function Skills() {
  const { t, tr } = useLanguage()
  // Preserve first-seen category order, group skills underneath.
  const groups = []
  const index = new Map()
  for (const skill of profile.skills) {
    if (!index.has(skill.category)) {
      index.set(skill.category, groups.length)
      groups.push({ category: skill.category, items: [] })
    }
    groups[index.get(skill.category)].items.push(skill)
  }

  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="container">
        <Reveal as="div" className="skills-head">
          <h2 id="skills-title">
            <span className="skills-slash mono" aria-hidden="true">// </span>
            <span className="gradient-text">{t('skills')}</span>
          </h2>
        </Reveal>
        <Reveal as="p" className="skills-sub mono">
          <span className="skills-prompt" aria-hidden="true">$ </span>
          {t('skillsMatches', { skills: profile.skills.length, groups: groups.length })}
        </Reveal>

        <div className="skills-groups">
          {groups.map((group, gi) => (
            <TiltCard
              as="article"
              key={group.category}
              className="card skills-group"
              reveal
              max={5}
              delay={`${gi * 60}ms`}
              aria-label={t('skillGroup', { name: tr(group.category) })}
            >
              <header className="skills-group-head">
                <span className="skills-group-kw mono" aria-hidden="true">const</span>
                <h3 className="skills-group-name">{tr(group.category)}</h3>
                <span className="skills-group-count" aria-hidden="true">
                  [{group.items.length}]
                </span>
              </header>

              <ul className="skills-pills">
                {group.items.map((skill) => {
                  const n = skill.endorsements
                  const hasEnd = n > 0
                  return (
                    <li key={skill.name}>
                      <span
                        className="skills-pill"
                        title={
                          hasEnd
                            ? `${tr(skill.name)} — ${t(n > 1 ? 'endorsements' : 'endorsement', { count: n })}`
                            : tr(skill.name)
                        }
                      >
                        <span className="skills-pill-name">{tr(skill.name)}</span>
                        {hasEnd && (
                          <span
                            className="skills-badge mono"
                          >
                            <span className="sr-only">{t(n > 1 ? 'endorsements' : 'endorsement', { count: n })}</span>
                            <span className="skills-meter" aria-hidden="true">
                              {Array.from({ length: Math.min(n, 4) }).map((_, i) => (
                                <span key={i} className="skills-meter-dot" />
                              ))}
                            </span>
                            <span aria-hidden="true">x{n}</span>
                          </span>
                        )}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  )
}
