import Certifications from '../components/Certifications.jsx';
import SEO from '../components/SEO.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function CertificationsPage() {
  const { isArabic } = useLanguage();
  return <><SEO title={isArabic ? 'الشهادات' : 'Certifications'} description={isArabic ? 'الشهادات المهنية وشهادات الخبرة لعبدالرحمن فلبجي.' : 'Professional certifications and credentials of Abdalrahman Valabji.'} canonical="/certifications" /><Certifications /></>;
}
