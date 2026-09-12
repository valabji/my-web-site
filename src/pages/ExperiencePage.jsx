import SEO from '../components/SEO';
import Experience from '../components/Experience';
import profile from '../data/profile.json';

export default function ExperiencePage() {
  const jobs = (profile.experience || []).map((j) => ({
    '@type': 'Occupation',
    name: j.title,
    occupationLocation: j.location
      ? { '@type': 'Place', name: j.location }
      : undefined,
    estimatedSalary: undefined,
  }));

  return (
    <>
      <SEO
        title="Experience"
        description="Professional experience of Abdalrahman Valabji \u2014 13+ years of software development including Lead Developer, Full-Stack Developer, and CTO roles."
        canonical="/experience"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          mainEntity: {
            '@type': 'Person',
            name: 'Abdalrahman Valabji',
            url: 'https://valabji.com',
            hasOccupation: jobs,
          },
        }}
      />
      <Experience />
    </>
  );
}
