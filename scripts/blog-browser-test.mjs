import assert from 'node:assert/strict'
import { mkdirSync } from 'node:fs'
import puppeteer from 'puppeteer'

const origin = process.env.BLOG_TEST_URL || 'http://127.0.0.1:5173'
const output = 'reports/blog'
mkdirSync(output, { recursive: true })
const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox'],
})
const page = await browser.newPage()
const errors = []
page.on('pageerror', (error) => errors.push(error.message))
const block = (key, style, text) => ({
  _type: 'block',
  _key: key,
  style,
  children: [{ _type: 'span', _key: key + 'span', text, marks: [] }],
  markDefs: [],
})
const posts = Array.from({ length: 14 }, (_, i) => ({
  _id: `post-${i}`,
  slug: `story-${i}`,
  title:
    i === 0
      ? 'Building software that stands the test of time'
      : `Engineering story ${i}`,
  excerpt:
    'Practical ideas on architecture, thoughtful interfaces, and the small decisions that make software better.',
  publishedAt: new Date(Date.UTC(2026, 8, 28 - i)).toISOString(),
  _updatedAt: '2026-09-29T00:00:00Z',
  tags: i % 2 ? ['React'] : ['Architecture'],
  readingMinutes: 5,
  body: [
    block(
      'intro',
      'normal',
      'Great software begins with clear intent. These are notes from the workbench.',
    ),
    block('principles', 'h2', 'Start with the problem'),
    block(
      'detail',
      'normal',
      'Understand the constraints, make the tradeoffs explicit, and keep the solution as simple as possible.',
    ),
    {
      _type: 'codeBlock',
      _key: 'code',
      language: 'javascript',
      filename: 'example.js',
      code: 'const clarity = complexity => simplify(complexity)\nconsole.log(clarity)',
    },
    block('next', 'h3', 'Leave room to learn'),
  ],
}))
let fail = false
let delay = 0
await page.setRequestInterception(true)
page.on('request', async (request) => {
  const url = new URL(request.url())
  if (
    (url.hostname.endsWith('.sanity.io') ||
      url.pathname.startsWith('/sanity-api/')) &&
    url.pathname.includes('/data/query/')
  ) {
    if (delay) await new Promise((resolve) => setTimeout(resolve, delay))
    if (fail)
      return request.respond({
        status: 403,
        contentType: 'application/json',
        headers: { 'access-control-allow-origin': '*' },
        body: JSON.stringify({ error: { description: 'Test unavailable' } }),
      })
    const param = (name) =>
      JSON.parse(url.searchParams.get('$' + name) || 'null')
    let result
    if (param('slug'))
      result = {
        post: posts.find((post) => post.slug === param('slug')) || null,
        related: posts
          .filter((post) => post.slug !== param('slug'))
          .slice(0, 3),
      }
    else {
      let filtered = posts.filter(
        (post) =>
          (!param('tag') || post.tags.includes(param('tag'))) &&
          (!param('search') ||
            post.title
              .toLowerCase()
              .includes(param('search').replaceAll('*', '').toLowerCase())),
      )
      if (url.searchParams.get('query').includes('publishedAt asc'))
        filtered = filtered.toReversed()
      result = {
        posts: filtered.slice(param('start'), param('end')),
        total: filtered.length,
        tags: ['Architecture', 'React'],
      }
    }
    return request.respond({
      status: 200,
      contentType: 'application/json',
      headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify({ result }),
    })
  }
  if (
    !['127.0.0.1', 'localhost'].includes(url.hostname) &&
    !url.protocol.startsWith('data')
  )
    return request.abort()
  return request.continue()
})
const ready = () => page.waitForSelector('[data-blog-status="ready"]')
const goto = async (path) => {
  await page.goto(origin + path)
  await ready()
}
const click = async (selector) => {
  await page.click(selector)
  await ready()
}
try {
  await page.setViewport({ width: 1440, height: 1050 })
  await goto('/blog')
  assert.equal(await page.$$eval('.blog-card', (cards) => cards.length), 6)
  assert.equal(
    await page.$eval('.nav__link[aria-current="page"]', (el) => el.textContent),
    'Blog',
  )
  await page.screenshot({
    path: `${output}/archive-desktop.png`,
    fullPage: true,
  })
  await click('a[aria-label="Next page"]')
  assert.match(page.url(), /page=2/)
  assert.equal(
    await page.$eval('.blog-card h2', (el) => el.textContent),
    'Engineering story 6',
  )
  await page.goBack()
  await ready()
  assert.equal(
    await page.$eval('.blog-card h2', (el) => el.textContent),
    posts[0].title,
  )
  await goto('/blog?page=999')
  await page.waitForFunction(
    () => new URL(location.href).searchParams.get('page') === '3',
  )
  await ready()
  assert.equal(await page.$$eval('.blog-card', (cards) => cards.length), 2)
  await goto('/blog?tag=React&page=2')
  assert.equal(await page.$$eval('.blog-card', (cards) => cards.length), 1)
  await page.select('.blog-sort select', 'oldest')
  await ready()
  assert.ok(!new URL(page.url()).searchParams.has('page'))
  assert.equal(
    await page.$eval('.blog-card h2', (el) => el.textContent),
    'Engineering story 13',
  )
  await goto('/blog')
  await page.type('input[name="q"]', 'no such story')
  await page.click('button[type="submit"]')
  await page.waitForFunction(
    () => new URL(location.href).searchParams.get('q') === 'no such story',
  )
  await ready()
  await page.waitForSelector('.blog-state')
  assert.match(
    await page.$eval('.blog-state', (el) => el.textContent),
    /No stories found/,
  )
  await goto('/blog/story-0')
  assert.equal(await page.$$eval('h1', (els) => els.length), 1)
  assert.ok(await page.$('#section-principles'))
  assert.ok(await page.$('.blog-code pre'))
  assert.equal(await page.$('.blog-translation'), null)
  await goto('/ar/blog/story-0')
  const translation = await page.$eval('.blog-translation a', (el) => ({
    href: el.href, text: el.textContent, target: el.target,
  }))
  assert.equal(new URL(translation.href).searchParams.get('tl'), 'ar')
  assert.match(translation.text, /ترجمة آلية إلى العربية/)
  assert.equal(translation.target, '_blank')
  assert.equal(await page.$eval('article[data-blog-status]', (el) => el.lang), 'en')
  await goto('/blog/story-0')
  await page.screenshot({
    path: `${output}/article-desktop.png`,
    fullPage: true,
  })
  await click('.blog-related .blog-card h2 a')
  await page.waitForFunction(
    () => document.querySelector('h1')?.textContent === 'Engineering story 1',
  )
  assert.equal(
    await page.$eval('h1', (el) => el.textContent),
    'Engineering story 1',
  )
  await goto('/blog/missing')
  assert.equal(
    await page.$eval('meta[name="robots"]', (el) => el.content),
    'noindex,follow',
  )
  fail = true
  await page.goto(origin + '/blog')
  await page.waitForSelector('[role="alert"]')
  fail = false
  await page.click('.blog-state button')
  await ready()
  delay = 500
  await page.goto(origin + '/blog')
  await page.waitForSelector('.blog-loading')
  await ready()
  delay = 0
  await page.setViewport({ width: 390, height: 844 })
  await goto('/blog')
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  )
  await page.click('.nav__toggle')
  await page.waitForSelector('.nav__mobile')
  await page.keyboard.press('Escape')
  assert.equal(await page.$('.nav__mobile'), null)
  assert.equal(
    await page.$eval('.nav__toggle', (el) => document.activeElement === el),
    true,
  )
  await page.screenshot({
    path: `${output}/archive-mobile.png`,
    fullPage: true,
  })
  await goto('/ar/blog')
  assert.equal(await page.$eval('html', (el) => el.dir), 'rtl')
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  )
  await page.screenshot({
    path: `${output}/archive-arabic.png`,
    fullPage: true,
  })
  await goto('/blog/story-0')
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  )
  await page.screenshot({
    path: `${output}/article-mobile.png`,
    fullPage: true,
  })
  assert.deepEqual(errors, [])
  console.log(
    'PASS: archive, pagination, history, page bounds, topics, sorting, search, articles, missing posts, retry, loading, mobile, RTL, keyboard; no browser errors.',
  )
} finally {
  await browser.close()
}
