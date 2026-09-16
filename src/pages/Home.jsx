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

export default function Home() {
  return (
    <>
      <SEO
        canonical="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          mainEntity: {
            '@type': 'Person',
            name: profile.identity.name,
            url: profile.identity.links.website,
            image: `https://valabji.com${profile.identity.photo}`,
            jobTitle: profile.identity.headline,
            description: profile.identity.about,
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Alexandria',
              addressCountry: 'EG',
            },
            knowsLanguage: profile.languages.map((language) => language.name),
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
