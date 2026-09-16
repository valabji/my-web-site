import SEO from '../components/SEO';
import Projects from '../components/Projects';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function ProjectsPage() {
  const { isArabic } = useLanguage();
  return (
    <>
      <SEO
        title={isArabic ? 'المشاريع' : 'Projects'}
        description={isArabic ? 'مشاريع مختارة من أعمال عبدالرحمن فلبجي — تطبيقات جوال ومنصات ويب وأنظمة مبنية باستخدام React Native وReact وIonic وغيرها.' : 'Selected portfolio projects by Abdalrahman Valabji \u2014 mobile apps, web platforms, and systems built with React Native, React, Ionic, and more.'}
        canonical="/projects"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: isArabic ? 'المشاريع — عبدالرحمن فلبجي' : 'Projects \u2014 Abdalrahman Valabji',
          description:
            isArabic ? 'مشاريع مختارة من أعمال عبدالرحمن فلبجي.' : 'Selected portfolio projects by Abdalrahman Valabji.',
          url: `https://valabji.com${isArabic ? '/ar' : ''}/projects`,
        }}
      />
      <Projects />
    </>
  );
}
