import Skills from '../components/Skills.jsx';
import SEO from '../components/SEO.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function SkillsPage() {
  const { isArabic } = useLanguage();
  return <><SEO title={isArabic ? 'المهارات' : 'Skills'} description={isArabic ? 'المهارات التقنية لعبدالرحمن فلبجي، وتشمل React وReact Native وNode.js وTypeScript وPython وDjango وNext.js وغيرها.' : 'Technical skills of Abdalrahman Valabji — React, React Native, Node.js, TypeScript, Python, Django, Next.js, and more.'} canonical="/skills" /><Skills /></>;
}
