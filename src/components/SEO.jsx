import { Helmet } from 'react-helmet-async';

const SITE = 'https://valabji.com';
const DEFAULT_IMG = `${SITE}/assets/imgs/me.jpeg`;
const DEFAULT_DESC =
  'Lead Software Developer with 13+ years building mobile, web, and backend systems. React, React Native, Next.js, Node.js, and Django.';

export default function SEO({
  title,
  description,
  canonical,
  image,
  type = 'website',
  jsonLd,
}) {
  const url = `${SITE}${canonical}`;
  const fullTitle = title
    ? `${title} \u2014 Abdalrahman Valabji`
    : 'Abdalrahman Valabji \u2014 Lead Software Developer';
  const desc = description || DEFAULT_DESC;
  const img = image || DEFAULT_IMG;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Abdalrahman Valabji" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:image:alt" content="Abdalrahman Valabji" />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
