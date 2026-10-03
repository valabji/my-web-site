export const PAGE_SIZE = 6
export const PUBLISHED_FILTER = `_type == "post" && defined(slug.current) && defined(title) && defined(publishedAt) && dateTime(publishedAt) <= dateTime(now()) && !(_id in path("drafts.**"))`
const IMAGE = `alt, caption, hotspot, crop, "url": asset->url, "dimensions": asset->metadata.dimensions`
export const POST_FIELDS = `_id, title, "slug": slug.current, excerpt, publishedAt, _updatedAt, tags, language, coverImage{${IMAGE}}, "readingMinutes": math::max([1, round(length(pt::text(body)) / 1200)])`
const FILTER = `${PUBLISHED_FILTER} && ($tag == "" || $tag in tags) && ($search == "" || title match $search || excerpt match $search || tags match $search)`
export function postsQuery(sort = 'newest') {
  return `{"posts": *[${FILTER}] | order(publishedAt ${sort === 'oldest' ? 'asc' : 'desc'}, _id asc)[$start...$end]{${POST_FIELDS}}, "total": count(*[${FILTER}]), "tags": array::unique(*[${PUBLISHED_FILTER}].tags[]) | order(@ asc)}`
}
export const POST_QUERY = `{"post": *[${PUBLISHED_FILTER} && slug.current == $slug][0]{${POST_FIELDS}, body[]{..., _type == "image" => {${IMAGE}}}}, "related": *[${PUBLISHED_FILTER} && slug.current != $slug] | order(publishedAt desc, _id asc)[0...3]{${POST_FIELDS}}}`
export const ARCHIVE_QUERY = `*[${PUBLISHED_FILTER}] | order(publishedAt desc, _id asc){${POST_FIELDS}}`
export function readFilters(params) {
  const rawPage = Number(params.get('page'))
  return {
    page:
      Number.isSafeInteger(rawPage) && rawPage > 0
        ? Math.min(rawPage, 100000)
        : 1,
    search: (params.get('q') || '').trim().slice(0, 120),
    tag: (params.get('tag') || '').slice(0, 100),
    sort: params.get('sort') === 'oldest' ? 'oldest' : 'newest',
  }
}
export function searchPattern(search) {
  return search
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => `${word}*`)
    .join(' ')
}
export function pageNumbers(page, count) {
  return [...new Set([1, page - 1, page, page + 1, count])]
    .filter((n) => n > 0 && n <= count)
    .sort((a, b) => a - b)
    .flatMap((n, i, all) => (i && n - all[i - 1] > 1 ? ['gap-' + n, n] : [n]))
}
export function imageUrl(image, width = 1000) {
  if (!image?.url || !image.url.startsWith('https://cdn.sanity.io/images/'))
    return undefined
  const url = new URL(image.url)
  url.searchParams.set('w', String(width))
  url.searchParams.set('auto', 'format')
  url.searchParams.set('fit', 'max')
  return url.href
}
export function safeHref(href) {
  if (
    typeof href !== 'string' ||
    href.includes('\\') ||
    /[\u0000-\u0020]/.test(href)
  )
    return undefined
  return /^(https?:\/\/|mailto:|tel:|\/(?!\/)|#)/i.test(href) ? href : undefined
}
export function headingId(block) {
  return `section-${block._key}`
}
export function blockText(block) {
  return (block.children || []).map((child) => child.text || '').join('')
}
export function formatDate(date, language = 'en') {
  if (!date || Number.isNaN(Date.parse(date))) return ''
  return new Intl.DateTimeFormat(language, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
}
