import Contact from '../components/Contact.jsx';
import SEO from '../components/SEO.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function ContactPage() {
  const { isArabic } = useLanguage();
  return <><SEO title={isArabic ? 'تواصل معي' : 'Contact'} description={isArabic ? 'تواصل مع عبدالرحمن فلبجي بشأن العمل الحر أو التعاون أو الاستفسارات.' : 'Get in touch with Abdalrahman Valabji for freelance work, collaborations, or inquiries.'} canonical="/contact" /><Contact /></>;
}
