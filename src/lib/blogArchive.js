// Production reads the published snapshot generated with the static HTML.
// Article bodies are fetched separately so the archive stays small.
export function selectArchive(
  posts,
  { tag = '', search = '', start = 0, end = 6 },
  oldest = false,
) {
  const terms = search
    .toLocaleLowerCase()
    .replaceAll('*', '')
    .split(/\s+/)
    .filter(Boolean)
  const filtered = posts.filter(
    (post) =>
      (!tag || post.tags?.includes(tag)) &&
      (!terms.length ||
        [post.title, post.excerpt, ...(post.tags || [])].some((value) =>
          terms.every((term) =>
            (value || '').toLocaleLowerCase().includes(term),
          ),
        )),
  )
  if (oldest)
    filtered.sort(
      (a, b) =>
        a.publishedAt.localeCompare(b.publishedAt) ||
        a._id.localeCompare(b._id),
    )
  return {
    posts: filtered.slice(start, end),
    total: filtered.length,
    tags: [...new Set(posts.flatMap((post) => post.tags || []))].sort(),
  }
}
async function readJson(path, signal) {
  const response = await fetch(path, { signal })
  if (!response.ok) throw new Error('Published content unavailable')
  return response.json()
}
export async function fetchPublishedBlog(query, params, { signal }) {
  const archive = await readJson('/blog-data/index.json', signal)
  if (!Array.isArray(archive)) throw new Error('Invalid published archive')
  if (params.slug) {
    const exists = archive.some((post) => post.slug === params.slug)
    return {
      post: exists
        ? await readJson(
            `/blog-data/posts/${encodeURIComponent(params.slug)}.json`,
            signal,
          )
        : null,
      related: archive.filter((post) => post.slug !== params.slug).slice(0, 3),
    }
  }
  return selectArchive(archive, params, query.includes('publishedAt asc'))
}
