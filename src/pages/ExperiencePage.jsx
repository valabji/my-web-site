import SEO from '../components/SEO';
import Experience from '../components/Experience';
import profile from '../data/profile.json';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function ExperiencePage() {
  const { isArabic, tr } = useLanguage();
  const jobs = (profile.experience || []).map((j) => ({
    '@type': 'Occupation',
    name: tr(j.title),
    occupationLocation: j.location
      ? { '@type': 'Place', name: tr(j.location) }
      : undefined,
    estimatedSalary: undefined,
  }));

  return (
    <>
      <SEO
        title={isArabic ? 'الخبرة المهنية' : 'Experience'}
        description={isArabic ? 'الخبرة المهنية لعبدالرحمن فلبجي — أكثر من 13 عامًا في تطوير البرمجيات، شملت قيادة فرق التطوير وتطوير الواجهات الأمامية والخلفية والإدارة التقنية.' : 'Professional experience of Abdalrahman Valabji \u2014 13+ years of software development including Lead Developer, Full-Stack Developer, and CTO roles.'}
        canonical="/experience"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          mainEntity: {
            '@type': 'Person',
            name: isArabic ? 'عبدالرحمن فلبجي' : 'Abdalrahman Valabji',
            url: `https://valabji.com${isArabic ? '/ar' : ''}`,
            hasOccupation: jobs,
          },
        }}
      />
      <Experience />
    </>
  );
}
