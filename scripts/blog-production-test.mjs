import assert from 'node:assert/strict'
import { readFileSync, mkdirSync } from 'node:fs'
import puppeteer from 'puppeteer'

const origin = process.env.BLOG_TEST_URL || 'http://127.0.0.1:4173'
const posts = JSON.parse(readFileSync('dist/blog-data/index.json', 'utf8'))
const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox'],
})
const page = await browser.newPage()
const errors = []
const remoteContent = []
page.on('pageerror', (error) => errors.push(error.message))
page.on('request', (request) => {
  if (/\.sanity\.io\/.*data\/query/.test(request.url()))
    remoteContent.push(request.url())
})
mkdirSync('reports/blog', { recursive: true })
try {
  await page.setViewport({ width: 1440, height: 1000 })
  await page.goto(`${origin}/blog`)
  await page.waitForSelector('[data-blog-status="ready"]')
  assert.equal(
    await page.$$eval('.blog-card', (cards) => cards.length),
    Math.min(6, posts.length),
  )
  await page.waitForFunction(
    () =>
      [...document.images]
        .filter((image) => image.loading !== 'lazy')
        .every((image) => image.complete),
    { timeout: 20000 },
  )
  await page.screenshot({
    path: 'reports/blog/production-desktop.png',
    fullPage: true,
  })
  for (const post of posts) {
    const html = readFileSync(`dist/blog/${post.slug}/index.html`, 'utf8')
    assert.ok(html.includes('BlogPosting'))
    assert.ok(!html.includes('name="robots" content="noindex,follow"'))
    assert.match(
      readFileSync('dist/sitemap.xml', 'utf8'),
      new RegExp(`/blog/${post.slug}`),
    )
    assert.ok(readFileSync('dist/feed.xml', 'utf8').includes(post.slug))
    await page.goto(`${origin}/blog/${post.slug}`)
    await page.waitForSelector('article[data-blog-status="ready"]')
    assert.equal(await page.$eval('h1', (el) => el.textContent), post.title)
    assert.equal(
      await page.$$eval('link[rel="canonical"]', (elements) => elements.length),
      1,
    )
    assert.equal(
      await page.$eval('link[rel="canonical"]', (el) => el.href),
      `https://valabji.com/blog/${post.slug}`,
    )
    const schemas = await page.$$eval(
      'script[type="application/ld+json"]',
      (elements) => elements.map((el) => JSON.parse(el.textContent)),
    )
    assert.ok(
      schemas.some(
        (schema) =>
          schema['@type'] === 'BlogPosting' && schema.headline === post.title,
      ),
    )
    await page.setViewport({ width: 390, height: 844 })
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    )
  }
  await page.goto(`${origin}/ar/blog`)
  await page.waitForSelector('[data-blog-status="ready"]')
  assert.equal(await page.$eval('html', (el) => el.dir), 'rtl')
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  )
  await page.screenshot({
    path: 'reports/blog/production-arabic-mobile.png',
    fullPage: true,
  })
  await page.goto(`${origin}/blog`)
  await page.waitForSelector('[data-blog-status="ready"]')
  await page.screenshot({
    path: 'reports/blog/production-mobile.png',
    fullPage: true,
  })
  const feed = await page.goto(`${origin}/feed.xml`)
  assert.equal(feed.status(), 200)
  assert.match(await feed.text(), /<rss version="2.0"/)
  assert.deepEqual(errors, [])
  assert.deepEqual(remoteContent, [])
  console.log(
    `PASS: ${posts.length} published articles, prerendered HTML, metadata, sitemap, RSS, mobile/RTL, and zero remote CMS requests in production.`,
  )
} finally {
  await browser.close()
}
