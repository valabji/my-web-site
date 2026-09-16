import path from 'path'
import { fileURLToPath } from 'url'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import http from 'http'
import { addPersonAliases } from '../src/utils/identity.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const DIST = path.join(ROOT, 'dist')

const portfolio = JSON.parse(
  readFileSync(path.join(ROOT, 'src', 'data', 'portfolio.json'), 'utf-8')
)

const profile = JSON.parse(
  readFileSync(path.join(ROOT, 'src', 'data', 'profile.json'), 'utf-8')
)

const SITE = 'https://valabji.com'
const OG_IMAGE = `${SITE}/assets/imgs/me.jpeg`
const { identity } = profile

const routes = [
  '/',
  '/about',
  '/experience',
  '/projects',
  '/skills',
  '/opensource',
  '/certifications',
  '/recommendations',
  '/contact',
  ...portfolio.projects.map((p) => `/projects/${p.slug}`),
]

function buildMeta({ title, description, canonical, image, type = 'website', jsonLd, lang = 'en', alternatePath = canonical }) {
  const fullTitle = title || 'Abdalrahman Valabji — Lead Software Developer'
  const url = `${SITE}${canonical}`
  const img = image || OG_IMAGE
  const desc = (description || '').replace(/"/g, '"')

  let tags = ''
  tags += `    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />\n`
  tags += `    <title>${fullTitle}</title>\n`
  tags += `    <meta name="description" content="${desc}" />\n`
  tags += `    <link rel="canonical" href="${url}" />\n`
  tags += `    <link rel="alternate" hreflang="en" href="${SITE}${alternatePath}" />\n`
  tags += `    <link rel="alternate" hreflang="ar" href="${SITE}/ar${alternatePath === '/' ? '' : alternatePath}" />\n`
  tags += `    <link rel="alternate" hreflang="x-default" href="${SITE}${alternatePath}" />\n`
  tags += `    <meta property="og:type" content="${type}" />\n`
  tags += `    <meta property="og:url" content="${url}" />\n`
  tags += `    <meta property="og:site_name" content="Abdalrahman Valabji" />\n`
  tags += `    <meta property="og:title" content="${fullTitle.replace(/"/g, '&quot;')}" />\n`
  tags += `    <meta property="og:description" content="${desc}" />\n`
  tags += `    <meta property="og:image" content="${img}" />\n`
  tags += `    <meta property="og:image:alt" content="Abdalrahman Valabji" />\n`
  tags += `    <meta property="og:locale" content="${lang === 'ar' ? 'ar_AR' : 'en_US'}" />\n`
  tags += `    <meta property="og:locale:alternate" content="${lang === 'ar' ? 'en_US' : 'ar_AR'}" />\n`
  tags += `    <meta name="twitter:card" content="summary" />\n`
  tags += `    <meta name="twitter:title" content="${fullTitle.replace(/"/g, '&quot;')}" />\n`
  tags += `    <meta name="twitter:description" content="${desc}" />\n`
  tags += `    <meta name="twitter:image" content="${img}" />\n`
  if (jsonLd) {
    tags += `    <script type="application/ld+json">${JSON.stringify({ ...addPersonAliases(jsonLd, identity), inLanguage: lang })}</script>\n`
  }
  return tags
}

function injectMeta(html, metaTags) {
  return html.replace(
    /(<head[^>]*>)([\s\S]*?)(<\/head>)/,
    (_, open, _c, close) => `${open}\n${metaTags}${close}`
  )
}

function extractAssets(html) {
  const scripts = html.match(/<script[^>]*type="module"[^>]*><\/script>/g) || []
  const styles = html.match(/<link[^>]*rel="stylesheet"[^>]*>/g) || []
  const preconnects = html.match(/<link[^>]*rel="preconnect"[^>]*>/g) || []
  return [...preconnects, ...styles, ...scripts].join('\n')
}

function injectAssets(html, assets) {
  return html.replace(
    /(<head[^>]*>)([\s\S]*?)(<\/head>)/,
    (_, open, content, close) => `${open}\n${assets}\n${content}${close}`
  )
}

const basePages = [
  {
    route: '/',
    waitFor: '#home',
    meta: {
      title: null,
      description: 'Lead Software Developer with 13+ years building mobile, web, and backend systems. React, React Native, Next.js, Node.js, and Django.',
      canonical: '/',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        mainEntity: {
          '@type': 'Person',
          name: 'Abdalrahman Valabji',
          url: SITE,
          image: OG_IMAGE,
          jobTitle: 'Lead Software Developer',
          description: 'Lead Software Developer with 13+ years of professional experience in mobile, web, and system development.',
          address: { '@type': 'PostalAddress', addressLocality: 'Alexandria', addressCountry: 'EG' },
          knowsLanguage: ['Arabic', 'English'],
          sameAs: ['https://www.linkedin.com/in/valabji/', 'https://github.com/valabji', 'https://mostaql.com/u/valabji'],
        },
      },
    },
  },
  {
    route: '/about',
    waitFor: '#about',
    meta: {
      title: 'About — Abdalrahman Valabji',
      description: 'Indian-Sudanese Software Developer with 13+ years of professional experience in mobile, web, and system development. Skilled in React, React Native, Node.js, and more.',
      canonical: '/about',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        mainEntity: {
          '@type': 'Person',
          name: 'Abdalrahman Valabji',
          url: SITE,
          image: OG_IMAGE,
          jobTitle: 'Lead Software Developer',
          description: 'Indian-Sudanese Software Developer with 13+ years of professional experience.',
          knowsAbout: ['React', 'React Native', 'Node.js', 'JavaScript', 'Python', 'Django', 'Next.js', 'TypeScript'],
          knowsLanguage: ['Arabic', 'English'],
          sameAs: ['https://www.linkedin.com/in/valabji/', 'https://github.com/valabji', 'https://mostaql.com/u/valabji'],
        },
      },
    },
  },
  {
    route: '/experience',
    waitFor: '#experience .xp-timeline',
    meta: {
      title: 'Experience — Abdalrahman Valabji',
      description: 'Professional experience of Abdalrahman Valabji — 13+ years of software development including Lead Developer, Full-Stack Developer, and CTO roles.',
      canonical: '/experience',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        mainEntity: {
          '@type': 'Person',
          name: 'Abdalrahman Valabji',
          hasOccupation: profile.experience.map(j => ({
            '@type': 'Occupation',
            name: j.title,
            occupationLocation: j.location ? { '@type': 'Place', name: j.location } : undefined,
          })),
        },
      },
    },
  },
  {
    route: '/projects',
    waitFor: '#projects .pj-grid',
    meta: {
      title: 'Projects — Abdalrahman Valabji',
      description: 'Selected portfolio projects by Abdalrahman Valabji — mobile apps, web platforms, and systems built with React Native, React, Ionic, and more.',
      canonical: '/projects',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Projects — Abdalrahman Valabji',
        description: 'Selected portfolio projects by Abdalrahman Valabji.',
        url: `${SITE}/projects`,
      },
    },
  },
  ...portfolio.projects.map((p) => ({
    route: `/projects/${p.slug}`,
    waitFor: '.pj-detail-article',
    meta: {
      title: `${p.title} — Abdalrahman Valabji`,
      description: p.description,
      canonical: `/projects/${p.slug}`,
      image: `${SITE}/${p.cover}`,
      type: 'article',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: p.title,
        description: p.description,
        author: { '@type': 'Person', name: 'Abdalrahman Valabji', url: SITE },
        datePublished: p.date_completed || undefined,
        applicationCategory: 'MobileApplication',
      },
    },
  })),
  {
    route: '/skills',
    waitFor: '#skills .skills-groups',
    meta: {
      title: 'Skills — Abdalrahman Valabji',
      description: 'Technical skills of Abdalrahman Valabji — React, React Native, Node.js, TypeScript, Python, Django, Next.js, and more.',
      canonical: '/skills',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        mainEntity: {
          '@type': 'Person',
          name: 'Abdalrahman Valabji',
          knowsAbout: ['React', 'React Native', 'Node.js', 'JavaScript', 'TypeScript', 'Python', 'Django', 'Next.js', 'Redux', 'GraphQL', 'SQL', 'AWS'],
        },
      },
    },
  },
  {
    route: '/opensource',
    waitFor: '#opensource .os-grid',
    meta: {
      title: 'Open Source — Abdalrahman Valabji',
      description: 'Open source contributions and projects by Abdalrahman Valabji.',
      canonical: '/opensource',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Open Source — Abdalrahman Valabji',
        description: 'Open source contributions and projects.',
        url: `${SITE}/opensource`,
      },
    },
  },
  {
    route: '/certifications',
    waitFor: '#certifications .cert-grid',
    meta: {
      title: 'Certifications — Abdalrahman Valabji',
      description: 'Professional certifications and credentials of Abdalrahman Valabji.',
      canonical: '/certifications',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        mainEntity: {
          '@type': 'Person',
          name: 'Abdalrahman Valabji',
          hasCredential: [],
        },
      },
    },
  },
  {
    route: '/recommendations',
    waitFor: '#recommendations .rec-grid',
    meta: {
      title: 'Recommendations — Abdalrahman Valabji',
      description: 'Professional recommendations and testimonials for Abdalrahman Valabji.',
      canonical: '/recommendations',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Recommendations — Abdalrahman Valabji',
        description: 'Professional recommendations and testimonials.',
        url: `${SITE}/recommendations`,
      },
    },
  },
  {
    route: '/contact',
    waitFor: '#contact .contact-grid',
    meta: {
      title: 'Contact — Abdalrahman Valabji',
      description: 'Get in touch with Abdalrahman Valabji for freelance work, collaborations, or inquiries.',
      canonical: '/contact',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact Abdalrahman Valabji',
        description: 'Contact form for Abdalrahman Valabji.',
        url: `${SITE}/contact`,
      },
    },
  },
]

const arabicMeta = {
  '/': {
    title: 'عبدالرحمن فلبجي — مطور برمجيات قائد',
    description: 'مطور برمجيات قائد بخبرة تتجاوز 13 عامًا في بناء تطبيقات الجوال والويب والأنظمة الخلفية باستخدام React وReact Native وNext.js وNode.js وDjango.',
  },
  '/about': { title: 'نبذة عني — عبدالرحمن فلبجي', description: 'مطور برمجيات هندي سوداني بخبرة مهنية تتجاوز 13 عامًا في تطوير تطبيقات الجوال والويب والأنظمة.' },
  '/experience': { title: 'الخبرة المهنية — عبدالرحمن فلبجي', description: 'أكثر من 13 عامًا من الخبرة في تطوير البرمجيات، شملت أدوار المطور القائد والمطور المتكامل والمدير التقني.' },
  '/projects': { title: 'المشاريع — عبدالرحمن فلبجي', description: 'مشاريع مختارة من تطبيقات الجوال ومنصات الويب والأنظمة التي بناها عبدالرحمن فلبجي.' },
  '/skills': { title: 'المهارات — عبدالرحمن فلبجي', description: 'مهارات تقنية تشمل React وReact Native وNode.js وTypeScript وPython وDjango وNext.js وغيرها.' },
  '/opensource': { title: 'المصدر المفتوح — عبدالرحمن فلبجي', description: 'مشاريع ومساهمات عبدالرحمن فلبجي مفتوحة المصدر.' },
  '/certifications': { title: 'الشهادات — عبدالرحمن فلبجي', description: 'الشهادات المهنية وشهادات الخبرة لعبدالرحمن فلبجي.' },
  '/recommendations': { title: 'التوصيات — عبدالرحمن فلبجي', description: 'توصيات وشهادات مهنية بحق عبدالرحمن فلبجي.' },
  '/contact': { title: 'تواصل معي — عبدالرحمن فلبجي', description: 'تواصل مع عبدالرحمن فلبجي بشأن العمل الحر أو التعاون أو الاستفسارات.' },
}

function toArabicPage(page) {
  const project = page.route.startsWith('/projects/')
    ? portfolio.projects.find((item) => page.route.endsWith(`/${item.slug}`))
    : null
  const copy = project
    ? {
        title: `${project.title_ar || project.title} — عبدالرحمن فلبجي`,
        description: project.description_ar || project.description,
      }
    : arabicMeta[page.route]

  const localizedJsonLd = project ? {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.title_ar || project.title,
    description: project.description_ar || project.description,
    author: { '@type': 'Person', name: 'عبدالرحمن فلبجي', url: `${SITE}/ar` },
    datePublished: project.date_completed || undefined,
    applicationCategory: 'MobileApplication',
  } : JSON.parse(JSON.stringify(page.meta.jsonLd || {}))

  if (!project && localizedJsonLd.mainEntity) {
    localizedJsonLd.mainEntity.name = 'عبدالرحمن فلبجي'
    localizedJsonLd.mainEntity.url = `${SITE}/ar`
    if (localizedJsonLd.mainEntity.jobTitle) localizedJsonLd.mainEntity.jobTitle = 'مطور برمجيات قائد'
    if (localizedJsonLd.mainEntity.description) localizedJsonLd.mainEntity.description = copy?.description
    if (localizedJsonLd.mainEntity.knowsLanguage) localizedJsonLd.mainEntity.knowsLanguage = ['العربية', 'الإنجليزية']
    if (localizedJsonLd.mainEntity.hasOccupation) {
      const titles = {
        'Lead Developer': 'مطور قائد',
        'Sr. Full-Stack Developer': 'مطور برمجيات متكامل أول',
        'Software Developer': 'مطور برمجيات',
        'React Native Developer': 'مطور React Native',
        'Software Programming Instructor': 'مدرب برمجة',
        CTO: 'المدير التقني',
      }
      localizedJsonLd.mainEntity.hasOccupation = localizedJsonLd.mainEntity.hasOccupation.map((occupation) => ({
        ...occupation,
        name: titles[occupation.name] || occupation.name,
      }))
    }
  } else if (!project) {
    localizedJsonLd.name = copy?.title
    localizedJsonLd.description = copy?.description
    localizedJsonLd.url = `${SITE}/ar${page.route === '/' ? '' : page.route}`
  }

  return {
    ...page,
    route: `/ar${page.route === '/' ? '' : page.route}`,
    meta: {
      ...page.meta,
      ...copy,
      canonical: `/ar${page.route === '/' ? '' : page.route}`,
      lang: 'ar',
      alternatePath: page.route,
      jsonLd: localizedJsonLd,
    },
  }
}

const pages = [
  ...basePages.map((page) => ({ ...page, meta: { ...page.meta, lang: 'en', alternatePath: page.route } })),
  ...basePages.map(toArabicPage),
]

function startServer(spaShell) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = req.url.split('?')[0]
      let filePath = path.join(DIST, url === '/' ? 'index.html' : url)
      if (filePath.endsWith('/')) filePath = path.join(filePath, 'index.html')
      try {
        const data = readFileSync(filePath)
        const ext = path.extname(filePath)
        const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf' }
        res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' })
        res.end(data)
      } catch {
        // Always serve the original SPA shell for client-side routes
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(spaShell)
      }
    })
    server.listen(0, () => resolve({ server, port: server.address().port }))
  })
}

function writeSitemap() {
  const entries = basePages.map((page) => {
    const en = `${SITE}${page.route}`
    const ar = `${SITE}/ar${page.route === '/' ? '' : page.route}`
    const priority = page.route === '/' ? '1.0' : page.route.includes('/projects/') ? '0.8' : '0.9'
    return `  <url>
    <loc>${en}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${en}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${ar}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${en}" />
    <lastmod>2026-09-16</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>
  <url>
    <loc>${ar}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${en}" />
    <xhtml:link rel="alternate" hreflang="ar" href="${ar}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${en}" />
    <lastmod>2026-09-16</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`
  }).join('\n')

  writeFileSync(
    path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries}\n</urlset>\n`,
    'utf-8',
  )
}

async function main() {
  const puppeteer = await import('puppeteer')
  
  // Copy the original SPA shell before we overwrite it
  const spaShell = readFileSync(path.join(DIST, 'index.html'), 'utf-8')
  const criticalAssets = extractAssets(spaShell)
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  })

  const { server, port } = await startServer(spaShell)
  console.log(`Server on port ${port}`)
  console.log(`Prerendering ${pages.length} pages...`)

  const tab = await browser.newPage()

  // Block ad domains to prevent ad injection
  await tab.setRequestInterception(true)
  tab.on('request', (req) => {
    const url = req.url()
    const adDomains = [
      'googleads.g.doubleclick.net',
      'pagead2.googlesyndication.com',
      'googletagservices.com',
      'googlesyndication.com',
      'doubleclick.net',
      'adservice.google.com',
      'googleadservices.com'
    ]
    if (adDomains.some(d => url.includes(d))) {
      req.abort()
    } else {
      req.continue()
    }
  })

  tab.on('pageerror', (err) => console.log(`  [error] ${err.message.substring(0, 80)}`))

  for (const page of pages) {
    try {
      await tab.goto(`http://localhost:${port}${page.route}`, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      })

      if (page.waitFor) {
        await tab.waitForSelector(page.waitFor, { timeout: 15000 }).catch(() => {})
      }

      let html = await tab.content()
      html = injectMeta(html, buildMeta(page.meta))
      html = injectAssets(html, criticalAssets)
      html = html.replace(/<html[^>]*>/, `<html lang="${page.meta.lang}" dir="${page.meta.lang === 'ar' ? 'rtl' : 'ltr'}">`)

      const outputPath = page.route === '/'
        ? path.join(DIST, 'index.html')
        : path.join(DIST, page.route, 'index.html')
      mkdirSync(path.dirname(outputPath), { recursive: true })
      writeFileSync(outputPath, html, 'utf-8')

      const size = (Buffer.byteLength(html) / 1024).toFixed(0)
      console.log(`  ✓ ${page.route} (${size}KB)`)
    } catch (err) {
      console.error(`  ✗ ${page.route}: ${err.message.substring(0, 100)}`)
    }
  }

  await tab.close()
  await browser.close()
  server.close()
  writeSitemap()
  console.log('\nPrerendering complete!')
}

main().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
