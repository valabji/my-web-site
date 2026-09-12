import SEO from '../components/SEO';
import Projects from '../components/Projects';

export default function ProjectsPage() {
  return (
    <>
      <SEO
        title="Projects"
        description="Selected portfolio projects by Abdalrahman Valabji \u2014 mobile apps, web platforms, and systems built with React Native, React, Ionic, and more."
        canonical="/projects"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Projects \u2014 Abdalrahman Valabji',
          description:
            'Selected portfolio projects by Abdalrahman Valabji.',
          url: 'https://valabji.com/projects',
        }}
      />
      <Projects />
    </>
  );
}
