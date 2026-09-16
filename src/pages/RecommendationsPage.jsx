import Recommendations from '../components/Recommendations.jsx';
import SEO from '../components/SEO.jsx';
import { useLanguage } from '../i18n/LanguageContext.jsx';

export default function RecommendationsPage() {
  const { isArabic } = useLanguage();
  return <><SEO title={isArabic ? 'التوصيات' : 'Recommendations'} description={isArabic ? 'توصيات وشهادات مهنية بحق عبدالرحمن فلبجي.' : 'Professional recommendations and testimonials for Abdalrahman Valabji.'} canonical="/recommendations" /><Recommendations /></>;
}
