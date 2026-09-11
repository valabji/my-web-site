import Hero from '../components/Hero.jsx'
import About from '../components/About.jsx'
import Skills from '../components/Skills.jsx'
import Experience from '../components/Experience.jsx'
import Projects from '../components/Projects.jsx'
import OpenSource from '../components/OpenSource.jsx'
import Certifications from '../components/Certifications.jsx'
import Recommendations from '../components/Recommendations.jsx'
import Contact from '../components/Contact.jsx'

export default function Home() {
  return (
    <>
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
