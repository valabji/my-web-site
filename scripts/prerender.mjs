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

function buildMeta({ title, description, canonical, image, type = 'website', jsonLd }) {
  const fullTitle = title || 'Abdalrahman Valabji — Lead Software Developer'
  const url = `${SITE}${canonical}`
  const img = image || OG_IMAGE
  const desc = (description || '').replace(/"/g, '"')

  let tags = ''
  tags += `    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />\n`
  tags += `    <title>${fullTitle}</title>\n`
  tags += `    <meta name="description" content="${desc}" />\n`
  tags += `    <link rel="canonical" href="${url}" />\n`
  tags += `    <meta property="og:type" content="${type}" />\n`
  tags += `    <meta property="og:url" content="${url}" />\n`
  tags += `    <meta property="og:site_name" content="Abdalrahman Valabji" />\n`
  tags += `    <meta property="og:title" content="${fullTitle.replace(/"/g, '&quot;')}" />\n`
  tags += `    <meta property="og:description" content="${desc}" />\n`
  tags += `    <meta property="og:image" content="${img}" />\n`
  tags += `    <meta property="og:image:alt" content="Abdalrahman Valabji" />\n`
  tags += `    <meta property="og:locale" content="en_US" />\n`
  tags += `    <meta name="twitter:card" content="summary" />\n`
  tags += `    <meta name="twitter:title" content="${fullTitle.replace(/"/g, '&quot;')}" />\n`
  tags += `    <meta name="twitter:description" content="${desc}" />\n`
  tags += `    <meta name="twitter:image" content="${img}" />\n`
  if (jsonLd) {
    tags += `    <script type="application/ld+json">${JSON.stringify(addPersonAliases(jsonLd, identity))}</script>\n`
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

const pages = [
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
    waitFor: '#skills .skills-grid',
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
    waitFor: '#opensource .oss-grid',
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
    waitFor: '#contact .contact-form',
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
  console.log('\nPrerendering complete!')
}

main().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
