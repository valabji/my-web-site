import test from 'node:test'
import assert from 'node:assert/strict'
import {
  pageNumbers,
  readFilters,
  safeHref,
  searchPattern,
  formatDate,
  imageUrl,
} from './blog.js'
import { xml } from '../../scripts/blog-build.mjs'

test('pagination handles invalid input and preserves valid filters', () => {
  for (const page of ['-1', '0', 'NaN', '2.5', 'Infinity', '9007199254740993'])
    assert.equal(readFilters(new URLSearchParams({ page })).page, 1)
  assert.deepEqual(
    readFilters(new URLSearchParams('page=3&q=React&tag=web&sort=oldest')),
    { page: 3, search: 'React', tag: 'web', sort: 'oldest' },
  )
  assert.deepEqual(pageNumbers(5, 10), [1, 'gap-4', 4, 5, 6, 'gap-10', 10])
  assert.deepEqual(pageNumbers(1, 1), [1])
})
test('content URLs reject executable and protocol-relative links', () => {
  for (const href of [
    'javascript:alert(1)',
    'data:text/html,test',
    '//evil.test',
    'java\nscript:test',
    undefined,
  ])
    assert.equal(safeHref(href), undefined)
  for (const href of [
    'https://example.com',
    '/blog/story',
    '#section-one',
    'mailto:hello@example.com',
  ])
    assert.equal(safeHref(href), href)
  assert.equal(imageUrl({ url: 'https://evil.test/img.jpg' }), undefined)
})
test('search escapes query patterns and supports Arabic', () => {
  assert.equal(searchPattern('React* [test]'), 'React* test*')
  assert.equal(searchPattern('هندسة البرمجيات'), 'هندسة* البرمجيات*')
})
test('dates and feed text serialize safely', () => {
  assert.equal(formatDate('not-a-date'), '')
  assert.equal(formatDate('2026-01-01T00:00:00Z'), 'Jan 1, 2026')
  assert.equal(xml('<code>&"'), '&lt;code&gt;&amp;&quot;')
})

test('published snapshots preserve filtering, pagination, and deterministic order', async () => {
  const { selectArchive } = await import('./blogArchive.js')
  const posts = Array.from({ length: 14 }, (_, i) => ({
    _id: String(i),
    title: `React guide ${i}`,
    tags: i % 2 ? ['web'] : ['mobile'],
    publishedAt: new Date(Date.UTC(2026, 8, 28 - i)).toISOString(),
  }))
  assert.equal(selectArchive(posts, { start: 6, end: 12 }).posts[0]._id, '6')
  assert.equal(
    selectArchive(posts, { tag: 'web', start: 6, end: 12 }).posts.length,
    1,
  )
  assert.equal(selectArchive(posts, { search: 'missing*' }).total, 0)
  assert.equal(selectArchive(posts, { search: 'React* guide*' }).total, 14)
  assert.equal(selectArchive(posts, {}, true).posts[0]._id, '13')
  assert.equal(posts[0]._id, '0')
})
