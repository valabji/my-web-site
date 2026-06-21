import profile from '../data/profile.json'
import './Contact.css'

export default function Contact() {
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
      aria: `Email ${identity.name}`,
    },
    waUrl && {
      label: 'whatsapp',
      value: whatsapp,
      href: waUrl,
      icon: 'lni lni-whatsapp',
      external: true,
      aria: 'Message on WhatsApp',
    },
    links?.linkedin && {
      label: 'linkedin',
      value: 'in/valabji',
      href: links.linkedin,
      icon: 'lni lni-linkedin',
      external: true,
      aria: 'LinkedIn profile',
    },
    links?.github && {
      label: 'github',
      value: '@valabji',
      href: links.github,
      icon: 'lni lni-github',
      external: true,
      aria: 'GitHub profile',
    },
    links?.mostaql && {
      label: 'mostaql',
      value: 'u/valabji',
      href: links.mostaql,
      icon: 'lni lni-link',
      external: true,
      aria: 'Mostaql profile',
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
        <div className="contact-head reveal">
          <span className="contact-eyebrow mono">
            <b>//</b> contact
          </span>
          <span className="contact-prompt mono">
            <span className="sigil">$</span>./say-hi
            <span className="cursor" aria-hidden="true" />
          </span>
          <h2 id="contact-heading" className="contact-cta">
            Let&apos;s build <span className="gradient-text">something</span>.
          </h2>
        </div>

        <ul className="contact-grid">
          {channels.map((c) => (
            <li key={c.label} className="reveal">
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
                  <span className="contact-link-value">{c.value}</span>
                </span>
                <span className="contact-link-arrow mono" aria-hidden="true">
                  -&gt;
                </span>
              </a>
            </li>
          ))}
        </ul>

        {location && (
          <p className="contact-location">
            <span className="dot" aria-hidden="true" />
            <span className="sigil" aria-hidden="true">const</span>
            <span>location = &quot;{location}&quot;</span>
          </p>
        )}

        <footer className="contact-footer">
          <p className="contact-copy mono">
            <span className="sigil">//</span> &copy; 2026 {identity.name} &mdash; built with React + Vite
          </p>
          <nav className="contact-socials" aria-label="Social links">
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
