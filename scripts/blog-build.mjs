import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { createClient } from '@sanity/client'
import { loadEnv } from 'vite'
import { ARCHIVE_QUERY, POST_QUERY, imageUrl } from '../src/lib/blog.js'

export function xml(value = '') {
  return String(value).replace(
    /[<>&"']/g,
    (char) =>
      ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&apos;',
      })[char],
  )
}
export function createBlogClient(root) {
  const env = { ...loadEnv('production', root, ''), ...process.env }
  return createClient({
    projectId: env.VITE_SANITY_PROJECT_ID || 'pdvy8mfz',
    dataset: env.VITE_SANITY_DATASET || 'production',
    apiVersion: '2026-10-02',
    useCdn: false,
    perspective: 'published',
    timeout: 15000,
  })
}
export async function discoverBlog(root) {
  const posts = await createBlogClient(root).fetch(ARCHIVE_QUERY)
  for (const post of posts) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug))
      throw new Error(
        `Invalid blog slug: ${post.slug}. Use lowercase letters, numbers, and hyphens.`,
      )
  }
  return posts
}
export function blogPages(posts) {
  return [
    {
      route: '/blog',
      waitFor: '[data-blog-status="ready"]',
      preserveMeta: true,
      meta: { lang: 'en' },
    },
    ...posts.map((post) => ({
      route: `/blog/${post.slug}`,
      waitFor: 'article[data-blog-status="ready"]',
      preserveMeta: true,
      meta: { lang: 'en' },
    })),
  ].flatMap((page) => [
    page,
    { ...page, route: `/ar${page.route}`, meta: { lang: 'ar' } },
  ])
}
export function writeFeed(posts, dist) {
  const items = posts
    .map(
      (post) =>
        `<item><title>${xml(post.title)}</title><link>https://valabji.com/blog/${xml(post.slug)}</link><guid isPermaLink="true">https://valabji.com/blog/${xml(post.slug)}</guid><description>${xml(post.excerpt || '')}</description><pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>${(post.tags || []).map((tag) => `<category>${xml(tag)}</category>`).join('')}${imageUrl(post.coverImage) ? `<media:content url="${xml(imageUrl(post.coverImage))}" medium="image" />` : ''}</item>`,
    )
    .join('\n')
  writeFileSync(
    path.join(dist, 'feed.xml'),
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/"><channel><title>Valabji — Engineering notes</title><link>https://valabji.com/blog</link><description>Notes on building software, solving problems, and the lessons in between.</description><atom:link href="https://valabji.com/feed.xml" rel="self" type="application/rss+xml"/><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}</channel></rss>\n`,
  )
}

export async function writeBlogData(posts, root, dist) {
  const client = createBlogClient(root)
  const directory = path.join(dist, 'blog-data')
  mkdirSync(path.join(directory, 'posts'), { recursive: true })
  writeFileSync(path.join(directory, 'index.json'), JSON.stringify(posts))
  // Bound concurrency to keep build traffic predictable for large archives.
  for (let start = 0; start < posts.length; start += 5) {
    await Promise.all(
      posts.slice(start, start + 5).map(async (post) => {
        const result = await client.fetch(POST_QUERY, { slug: post.slug })
        if (!result.post)
          throw new Error(`Post disappeared during build: ${post.slug}`)
        writeFileSync(
          path.join(directory, 'posts', `${post.slug}.json`),
          JSON.stringify(result.post),
        )
      }),
    )
  }
}
