import SEO from '../components/SEO';
import About from '../components/About';
import Skills from '../components/Skills';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function AboutPage() {
  const { isArabic } = useLanguage();
  return (
    <>
      <SEO
        title={isArabic ? 'نبذة عني' : 'About'}
        description={isArabic ? 'مطور برمجيات هندي سوداني بخبرة مهنية تتجاوز 13 عامًا في تطوير تطبيقات الجوال والويب والأنظمة، ومتخصص في React وReact Native وNode.js وغيرها.' : 'Indian-Sudanese Software Developer with 13+ years of professional experience in mobile, web, and system development. Skilled in React, React Native, Node.js, and more.'}
        canonical="/about"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ProfilePage',
          mainEntity: {
            '@type': 'Person',
            name: isArabic ? 'عبدالرحمن فلبجي' : 'Abdalrahman Valabji',
            url: `https://valabji.com${isArabic ? '/ar' : ''}`,
            image: 'https://valabji.com/assets/imgs/me.jpeg',
            jobTitle: isArabic ? 'مطور برمجيات قائد' : 'Lead Software Developer',
            description:
              isArabic ? 'مطور برمجيات هندي سوداني بخبرة مهنية تتجاوز 13 عامًا في تطوير تطبيقات الجوال والويب والأنظمة.' : 'Indian-Sudanese Software Developer with 13+ years of professional experience in mobile, web, and system development.',
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
