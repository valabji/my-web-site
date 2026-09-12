import SEO from '../components/SEO';
import About from '../components/About';
import Skills from '../components/Skills';

export default function AboutPage() {
  return (
    <>
      <SEO
        title="About"
        description="Indian-Sudanese Software Developer with 13+ years of professional experience in mobile, web, and system development. Skilled in React, React Native, Node.js, and more."
        canonical="/about"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          mainEntity: {
            '@type': 'Person',
            name: 'Abdalrahman Valabji',
            url: 'https://valabji.com',
            image: 'https://valabji.com/assets/imgs/me.jpeg',
            jobTitle: 'Lead Software Developer',
            description:
              'Indian-Sudanese Software Developer with 13+ years of professional experience in mobile, web, and system development.',
            knowsAbout: [
              'React',
              'React Native',
              'Node.js',
              'JavaScript',
              'Python',
              'Django',
              'Next.js',
              'TypeScript',
            ],
            knowsLanguage: ['Arabic', 'English'],
            sameAs: [
              'https://www.linkedin.com/in/valabji/',
              'https://github.com/valabji',
              'https://mostaql.com/u/valabji',
            ],
          },
        }}
      />
      <About />
      <Skills />
    </>
  );
}
