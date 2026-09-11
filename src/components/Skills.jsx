import profile from '../data/profile.json'
import Reveal from './Reveal'
import TiltCard from './TiltCard'
import './Skills.css'

/**
 * Skills — groups profile.skills by category and renders each group
 * as a card of mono pills. Pills with endorsements > 0 show a small
 * mono badge ("x3") plus a tiny endorsement meter.
 */
export default function Skills() {
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
            <span className="gradient-text">skills</span>
          </h2>
        </Reveal>
        <Reveal as="p" className="skills-sub mono">
          <span className="skills-prompt" aria-hidden="true">$ </span>
          grep -r &ldquo;expertise&rdquo; ./career &mdash; {profile.skills.length} matches across {groups.length} domains
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
              aria-label={`${group.category} skills`}
            >
              <header className="skills-group-head">
                <span className="skills-group-kw mono" aria-hidden="true">const</span>
                <h3 className="skills-group-name">{group.category}</h3>
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
                            ? `${skill.name} — ${n} endorsement${n > 1 ? 's' : ''}`
                            : skill.name
                        }
                      >
                        <span className="skills-pill-name">{skill.name}</span>
                        {hasEnd && (
                          <span
                            className="skills-badge mono"
                            aria-label={`${n} endorsement${n > 1 ? 's' : ''}`}
                          >
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
