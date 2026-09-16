import profile from '../data/profile.json'
import Reveal from './Reveal'
import './Contact.css'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function Contact() {
  const { t, tr } = useLanguage()
  const { identity } = profile
  const { email, whatsapp, location, links } = identity

  const waDigits = (whatsapp || '').replace(/\D/g, '')
  const waUrl = waDigits ? `https://wa.me/${waDigits}` : null

  const channels = [
    {
      label: 'mailto',
      value: email,
      href: `mailto:${email}`,
      icon: 'lni lni-envelope',
      aria: `Email ${tr(identity.name)}`,
    },
    waUrl && {
      label: 'whatsapp',
      value: whatsapp,
      href: waUrl,
      icon: 'lni lni-whatsapp',
      external: true,
      aria: t('messageWhatsapp'),
    },
    links?.linkedin && {
      label: 'linkedin',
      value: 'in/valabji',
      href: links.linkedin,
      icon: 'lni lni-linkedin',
      external: true,
      aria: t('linkedinProfile'),
    },
    links?.github && {
      label: 'github',
      value: '@valabji',
      href: links.github,
      icon: 'lni lni-github',
      external: true,
      aria: t('githubProfile'),
    },
    links?.mostaql && {
      label: 'mostaql',
      value: 'u/valabji',
      href: links.mostaql,
      icon: 'lni lni-link',
      external: true,
      aria: t('mostaqlProfile'),
    },
  ].filter(Boolean)

  const socials = [
    links?.linkedin && { href: links.linkedin, icon: 'lni lni-linkedin', aria: 'LinkedIn' },
    links?.github && { href: links.github, icon: 'lni lni-github', aria: 'GitHub' },
    waUrl && { href: waUrl, icon: 'lni lni-whatsapp', aria: 'WhatsApp' },
    { href: `mailto:${email}`, icon: 'lni lni-envelope', aria: 'Email' },
    links?.mostaql && { href: links.mostaql, icon: 'lni lni-link', aria: 'Mostaql' },
  ].filter(Boolean)

  return (
    <section id="contact" className="section" aria-labelledby="contact-heading">
      <div className="container">
        <Reveal as="div" className="contact-head">
          <span className="contact-eyebrow mono">
            <b>//</b> {t('contact')}
          </span>
          <span className="contact-prompt mono">
            <span className="contact-prompt-code" dir="ltr">
              <span className="sigil">$</span>./say-hi
              <span className="cursor" aria-hidden="true" />
            </span>
          </span>
          <h2 id="contact-heading" className="contact-cta">
            {t('letsBuild')} <span className="gradient-text">{t('something')}</span>.
          </h2>
        </Reveal>

        <ul className="contact-grid">
          {channels.map((c, i) => (
            <Reveal as="li" key={c.label} delay={`${i * 60}ms`}>
              <a
                className="contact-link"
                href={c.href}
                aria-label={c.aria}
                {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <span className="contact-link-icon" aria-hidden="true">
                  <span className={c.icon} />
                </span>
                <span className="contact-link-body">
                  <span className="contact-link-label mono">{c.label}</span>
                  <span className="contact-link-value" dir="ltr">{c.value}</span>
                </span>
                <span className="contact-link-arrow mono" dir="ltr" aria-hidden="true">
                  -&gt;
                </span>
              </a>
            </Reveal>
          ))}
        </ul>

        {location && (
          <p className="contact-location">
            <span className="dot" aria-hidden="true" />
            <span className="contact-location-code" dir="ltr">
              <span className="sigil" aria-hidden="true">const</span>
              <span>location = &quot;</span>
              <span dir="auto">{tr(location)}</span>
              <span>&quot;</span>
            </span>
          </p>
        )}

        <footer className="contact-footer">
          <p className="contact-copy mono">
            <span className="sigil">//</span> &copy; 2026 {tr(identity.name)} &mdash; {t('builtWith')}
          </p>
          <nav className="contact-socials" aria-label={t('socialLinks')}>
            {socials.map((s, i) => (
              <a
                key={i}
                className="contact-social"
                href={s.href}
                aria-label={s.aria}
                {...(s.href.startsWith('mailto:')
                  ? {}
                  : { target: '_blank', rel: 'noopener noreferrer' })}
              >
                <span className={s.icon} aria-hidden="true" />
              </a>
            ))}
          </nav>
        </footer>
      </div>
    </section>
  )
}
