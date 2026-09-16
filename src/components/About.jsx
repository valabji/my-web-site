import profile from '../data/profile.json';
import Reveal from './Reveal';
import TiltCard from './TiltCard';
import './About.css';
import { useLanguage } from '../i18n/LanguageContext.jsx';

const TECH_GROUPS = [
  { key: 'frontend', label: 'Front-End' },
  { key: 'backend', label: 'Back-End' },
  { key: 'design', label: 'Design' },
  { key: 'tools', label: 'Tools' },
];

export default function About() {
  const { t, tr } = useLanguage();
  const { about, alternateGivenNames, alternateFamilyNames } = profile.identity;
  const { softSkills, techStack, languages, education } = profile;

  return (
    <section id="about" className="section" aria-labelledby="about-heading">
      <div className="container">
        <Reveal as="header" className="about-head">
          <p className="about-kicker mono">
            <span className="about-command" dir="ltr"><span className="about-prompt">$ </span>whoami</span>
          </p>
          <h2 id="about-heading" className="about-title">
            <span className="gradient-text">{t('about')}</span>
            <span className="about-comment mono">// {t('aboutEngineer')}</span>
          </h2>
        </Reveal>

        <div className="about-grid">
          {/* Prose + soft skills */}
          <Reveal as="div" className="about-block" delay=".05s">
            <p className="about-prose mono">
              <span className="about-command" dir="ltr"><span className="about-prompt">&gt; </span>cat about.md</span>
            </p>
            <p className="about-bio">{tr(about)}</p>
            <p className="about-name-variants">
              {t('nameVariants', { given: alternateGivenNames.join(', '), family: alternateFamilyNames.join(', ') })}
            </p>
          </Reveal>

          <Reveal as="div" className="about-block" delay=".12s">
            <p className="about-label mono">
              <span className="about-code-label" dir="ltr">
                <span className="about-sym">const</span>
                <span className="about-key">softSkills</span>
                <span className="about-sym">=</span>
              </span>
            </p>
            <ul className="about-pills" aria-label={t('softSkills')}>
              {softSkills.map((skill) => (
                <li key={skill}>
                  <span className="tag">{tr(skill)}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Tech stack */}
        <Reveal as="div" className="about-tech" delay=".16s">
          <p className="about-label mono">
            <span className="about-sym">//</span>
            <span className="about-key">{t('techStack')}</span>
          </p>
          <div className="about-tech-grid">
            {TECH_GROUPS.map(({ key, label }) => {
              const items = techStack[key] || [];
              return (
                <TiltCard as="div" key={key} className="card about-techcard" max={5}>
                  <h3 className="about-grouphead mono">
                    <span className="about-dot" aria-hidden="true" />
                    {tr(label)}
                    <span className="about-count">{items.length}</span>
                  </h3>
                  <ul className="about-pills" aria-label={t('technologies', { name: tr(label) })}>
                    {items.map((t) => (
                      <li key={t}>
                        <span className="tag">{t}</span>
                      </li>
                    ))}
                  </ul>
                </TiltCard>
              );
            })}
          </div>
        </Reveal>

        {/* Languages + Education */}
        <div className="about-meta-grid" id="about-meta">
          <TiltCard as="div" className="card about-minicard" reveal delay=".18s" max={5}>
            <p className="about-label mono">
              <span className="about-sym">//</span>
              <span className="about-key">{t('languages')}</span>
            </p>
            <ul className="about-list">
              {languages.map((lang) => (
                <li key={lang.name} className="about-li">
                  <span className="about-li-title">{tr(lang.name)}</span>
                  <span className="about-li-sub">{tr(lang.level)}</span>
                </li>
              ))}
            </ul>
          </TiltCard>

          <TiltCard as="div" className="card about-minicard" reveal delay=".22s" max={5}>
            <p className="about-label mono">
              <span className="about-sym">//</span>
              <span className="about-key">{t('education')}</span>
            </p>
            <ul className="about-list">
              {education.map((edu) => (
                <li key={`${edu.school}-${edu.start}`} className="about-li">
                  <span className="about-li-title">{tr(edu.school)}</span>
                  <span className="about-li-sub">
                    {tr(edu.degree)}
                    {edu.field ? ` · ${tr(edu.field)}` : ''}
                  </span>
                  <span className="about-li-meta">
                    {edu.start} — {edu.end}
                    {edu.grade ? ` · ${tr(edu.grade)}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
