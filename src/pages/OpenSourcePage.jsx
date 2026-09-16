import OpenSource from '../components/OpenSource.jsx';
import SEO from '../components/SEO.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function OpenSourcePage() {
  const { isArabic } = useLanguage();
  return <><SEO title={isArabic ? 'المصدر المفتوح' : 'Open Source'} description={isArabic ? 'مشاريع ومساهمات عبدالرحمن فلبجي مفتوحة المصدر.' : 'Open source contributions and projects by Abdalrahman Valabji.'} canonical="/opensource" /><OpenSource /></>;
}
