import { Helmet } from 'react-helmet-async';
import profile from '../data/profile.json';
import { addPersonAliases } from '../utils/identity.js';
import { useLanguage, localePath } from '../i18n/LanguageContext.jsx';
import { dynamicArabic } from '../i18n/translations.js';

const SITE = 'https://valabji.com';
const DEFAULT_IMG = `${SITE}/assets/imgs/me.jpeg`;
const DEFAULT_DESC =
  'Lead Software Engineer with 13+ years building mobile, web, and backend systems. React, React Native, Next.js, Node.js, and Django.';
const DEFAULT_DESC_AR =
  `${dynamicArabic['Lead Software Engineer']} بخبرة تتجاوز 13 عامًا في تطوير تطبيقات الجوال والويب والأنظمة الخلفية باستخدام React وReact Native وNext.js وNode.js وDjango.`;

const { identity } = profile;

export default function SEO({
  title,
  description,
  canonical,
  image,
  type = 'website',
  jsonLd,
}) {
  const { language } = useLanguage();
  const localizedCanonical = localePath(canonical, language);
  const url = `${SITE}${localizedCanonical}`;
  const englishUrl = `${SITE}${localePath(canonical, 'en')}`;
  const arabicUrl = `${SITE}${localePath(canonical, 'ar')}`;
  const fullTitle = title
    ? `${title} \u2014 ${language === 'ar' ? 'عبدالرحمن فلبجي' : 'Abdalrahman Valabji'}`
    : language === 'ar'
      ? `عبدالرحمن فلبجي — ${dynamicArabic['Lead Software Engineer']}`
      : 'Abdalrahman Valabji \u2014 Lead Software Engineer';
  const desc = description || (language === 'ar' ? DEFAULT_DESC_AR : DEFAULT_DESC);
  const img = image || DEFAULT_IMG;
  const enrichedJsonLd = jsonLd
    ? { ...addPersonAliases(jsonLd, identity), inLanguage: language }
    : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="en" href={englishUrl} />
      <link rel="alternate" hrefLang="ar" href={arabicUrl} />
      <link rel="alternate" hrefLang="x-default" href={englishUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Abdalrahman Valabji" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:image:alt" content="Abdalrahman Valabji" />
      <meta property="og:locale" content={language === 'ar' ? 'ar_AR' : 'en_US'} />
      <meta property="og:locale:alternate" content={language === 'ar' ? 'en_US' : 'ar_AR'} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />

      {enrichedJsonLd && (
        <script type="application/ld+json">{JSON.stringify(enrichedJsonLd)}</script>
      )}
    </Helmet>
  );
}
