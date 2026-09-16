import Hero from '../components/Hero.jsx'
import About from '../components/About.jsx'
import Skills from '../components/Skills.jsx'
import Experience from '../components/Experience.jsx'
import Projects from '../components/Projects.jsx'
import OpenSource from '../components/OpenSource.jsx'
import Certifications from '../components/Certifications.jsx'
import Recommendations from '../components/Recommendations.jsx'
import Contact from '../components/Contact.jsx'
import SEO from '../components/SEO.jsx'
import profile from '../data/profile.json'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function Home() {
  const { isArabic, tr } = useLanguage()
  return (
    <>
      <SEO
        canonical="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          mainEntity: {
            '@type': 'Person',
            name: tr(profile.identity.name),
            url: `${profile.identity.links.website}${isArabic ? '/ar' : ''}`,
            image: `https://valabji.com${profile.identity.photo}`,
            jobTitle: tr(profile.identity.headline),
            description: tr(profile.identity.about),
            address: {
              '@type': 'PostalAddress',
              addressLocality: isArabic ? 'الإسكندرية' : 'Alexandria',
              addressCountry: 'EG',
            },
            knowsLanguage: profile.languages.map((language) => tr(language.name)),
            sameAs: [
              profile.identity.links.linkedin,
              profile.identity.links.github,
              profile.identity.links.mostaql,
            ],
          },
        }}
      />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <OpenSource />
      <Certifications />
      <Recommendations />
      <Contact />
    </>
  )
}
