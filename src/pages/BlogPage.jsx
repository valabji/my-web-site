import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import SEO from '../components/SEO.jsx'
import {
  BlogFooter,
  BlogState,
  PostCard,
  useBlogCopy,
} from '../components/blog/BlogUI.jsx'
import { useSanityQuery } from '../hooks/useSanityQuery.js'
import {
  PAGE_SIZE,
  pageNumbers,
  postsQuery,
  readFilters,
  searchPattern,
} from '../lib/blog.js'
import './Blog.css'

export default function BlogPage() {
  const [params, setParams] = useSearchParams()
  const { page, search, tag, sort } = readFilters(params)
  const { pathFor, copy } = useBlogCopy()
  const results = useRef(null)
  const { data, status, retry } = useSanityQuery(postsQuery(sort), {
    tag,
    search: searchPattern(search),
    start: (page - 1) * PAGE_SIZE,
    end: page * PAGE_SIZE,
  })
  const count = Math.max(1, Math.ceil((data?.total || 0) / PAGE_SIZE))
  const filtered = Boolean(search || tag)
  function hrefFor(nextPage) {
    const next = new URLSearchParams(params)
    if (nextPage === 1) next.delete('page')
    else next.set('page', String(nextPage))
    return `${pathFor('/blog')}${next.size ? `?${next}` : ''}`
  }
  function update(values) {
    const next = new URLSearchParams(params)
    next.delete('page')
    Object.entries(values).forEach(([key, value]) =>
      value ? next.set(key, value) : next.delete(key),
    )
    setParams(next)
  }
  useEffect(() => {
    if (status === 'ready' && page > count) {
      const next = new URLSearchParams(params)
      if (count === 1) next.delete('page')
      else next.set('page', String(count))
      setParams(next, { replace: true })
    }
  }, [status, page, count, params, setParams])
  const featured = page === 1 && !filtered && sort === 'newest'
  return (
    <div className="blog-shell">
      <SEO
        title={copy('Engineering notes', 'ملاحظات هندسية')}
        description={copy(
          'Notes on building software, solving problems, and the lessons in between. By Abdalrahman Valabji.',
          'مقالات عن تطوير البرمجيات وحل المشكلات والدروس المستفادة، بقلم عبدالرحمن فلبجي.',
        )}
        canonical={`/blog${page > 1 ? `?page=${page}` : ''}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Engineering notes',
          url: 'https://valabji.com/blog',
        }}
      />
      <Helmet>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Valabji — Engineering notes"
          href="/feed.xml"
        />
        {(filtered || sort !== 'newest') && (
          <meta name="robots" content="noindex,follow" />
        )}
        {page > 1 && (
          <link rel="prev" href={`https://valabji.com${hrefFor(page - 1)}`} />
        )}
        {status === 'ready' && page < count && (
          <link rel="next" href={`https://valabji.com${hrefFor(page + 1)}`} />
        )}
      </Helmet>
      <header className="blog-hero">
        <div className="blog-eyebrow">
          <span className="blog-dot" />
          {copy('The developer’s journal', 'يوميات مطوّر برمجيات')}
        </div>
        <h1>
          {copy('Engineering', 'ملاحظات')}
          <br />
          <span>{copy('notes & ideas.', 'وأفكار هندسية.')}</span>
        </h1>
        <div className="blog-hero__bottom">
          <p>
            {copy(
              'On building software, solving problems, and the lessons in between. A little code. A lot of curiosity.',
              'عن تطوير البرمجيات وحل المشكلات والدروس المستفادة. قليل من الكود، وكثير من الفضول.',
            )}
          </p>
          <a className="blog-text-link" href="/feed.xml">
            {copy('Follow via RSS', 'تابع عبر RSS')}{' '}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </header>
      <section
        className="blog-library"
        aria-label={copy('Article archive', 'أرشيف المقالات')}
      >
        <div className="blog-toolbar">
          <form
            role="search"
            className="blog-search"
            onSubmit={(event) => {
              event.preventDefault()
              update({
                q: new FormData(event.currentTarget)
                  .get('q')
                  .trim()
                  .slice(0, 120),
              })
            }}
          >
            <span aria-hidden="true">⌕</span>
            <input
              key={search}
              name="q"
              type="search"
              defaultValue={search}
              maxLength={120}
              placeholder={copy('Find a story…', 'ابحث عن مقال…')}
              aria-label={copy('Search articles', 'البحث في المقالات')}
            />
            <button type="submit">
              {copy('Search', 'بحث')} <span aria-hidden="true">↵</span>
            </button>
          </form>
          <label className="blog-sort">
            {copy('Sort by', 'الترتيب')}
            <select
              value={sort}
              onChange={(event) =>
                update({
                  sort:
                    event.target.value === 'newest' ? '' : event.target.value,
                })
              }
            >
              <option value="newest">
                {copy('Newest first', 'الأحدث أولًا')}
              </option>
              <option value="oldest">
                {copy('Oldest first', 'الأقدم أولًا')}
              </option>
            </select>
          </label>
        </div>
        <div
          className="blog-topics"
          aria-label={copy('Filter by topic', 'تصفية حسب الموضوع')}
        >
          <button
            className={!tag ? 'is-active' : ''}
            aria-pressed={!tag}
            onClick={() => update({ tag: '' })}
          >
            {copy('All topics', 'كل الموضوعات')}
          </button>
          {[...new Set([...(data?.tags || []), ...(tag ? [tag] : [])])].map(
            (topic) => (
              <button
                key={topic}
                className={tag === topic ? 'is-active' : ''}
                aria-pressed={tag === topic}
                onClick={() => update({ tag: topic })}
              >
                {topic}
              </button>
            ),
          )}
        </div>
        <div ref={results} tabIndex={-1} className="blog-results-heading">
          <h2>
            {filtered
              ? copy('Search results', 'نتائج البحث')
              : copy('The latest writing', 'أحدث الكتابات')}
          </h2>
          <span aria-live="polite">
            {status === 'ready'
              ? `${data.total} ${copy(data.total === 1 ? 'story' : 'stories', 'مقالات')}`
              : copy('Loading…', 'جارٍ التحميل…')}
          </span>
        </div>
        {filtered && (
          <div className="blog-filter-summary">
            <span>
              {search && `“${search}”`}
              {search && tag && ' / '}
              {tag}
            </span>
            <button onClick={() => update({ q: '', tag: '' })}>
              {copy('Clear filters', 'إزالة التصفية')} ×
            </button>
          </div>
        )}
        <div data-blog-status={status} aria-busy={status === 'loading'}>
          {status !== 'ready' ? (
            <BlogState status={status} retry={retry} />
          ) : data.posts.length ? (
            <div className="blog-grid">
              {data.posts.map((post, index) => (
                <PostCard
                  key={post._id}
                  post={post}
                  featured={featured && index === 0}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <BlogState
              emptyTitle={
                filtered
                  ? copy('No stories found.', 'لم نعثر على مقالات.')
                  : copy(
                      'Good stories take time.',
                      'المقالات الجيدة تستحق الانتظار.',
                    )
              }
              emptyDescription={
                filtered
                  ? copy(
                      'Try another search or explore all topics.',
                      'جرّب بحثًا آخر أو تصفّح كل الموضوعات.',
                    )
                  : copy(
                      'New notes are on the way. Follow the RSS feed to catch the next one.',
                      'مقالات جديدة قريبًا. تابع موجز RSS ليصلك الجديد.',
                    )
              }
            >
              {filtered && (
                <button
                  className="blog-button"
                  onClick={() => update({ q: '', tag: '' })}
                >
                  {copy('View all stories', 'عرض كل المقالات')}
                </button>
              )}
            </BlogState>
          )}
        </div>
        {status === 'ready' && data.total > 0 && (
          <div className="blog-pagination-row">
            <span>
              {copy(
                `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, data.total)} of ${data.total}`,
                `عرض ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, data.total)} من ${data.total}`,
              )}
            </span>
            <nav
              className="blog-pagination"
              aria-label={copy('Blog pagination', 'صفحات المدونة')}
              onClick={(event) => {
                if (event.target.closest('a'))
                  requestAnimationFrame(() => {
                    results.current?.focus()
                    results.current?.scrollIntoView({ block: 'start' })
                  })
              }}
            >
              {page > 1 ? (
                <Link
                  to={hrefFor(page - 1)}
                  aria-label={copy('Previous page', 'الصفحة السابقة')}
                >
                  ←
                </Link>
              ) : (
                <span aria-disabled="true">←</span>
              )}
              {pageNumbers(page, count).map((number) =>
                typeof number === 'string' ? (
                  <span key={number}>…</span>
                ) : (
                  <Link
                    key={number}
                    to={hrefFor(number)}
                    aria-current={page === number ? 'page' : undefined}
                    aria-label={copy(`Page ${number}`, `صفحة ${number}`)}
                  >
                    {number}
                  </Link>
                ),
              )}
              {page < count ? (
                <Link
                  to={hrefFor(page + 1)}
                  aria-label={copy('Next page', 'الصفحة التالية')}
                >
                  →
                </Link>
              ) : (
                <span aria-disabled="true">→</span>
              )}
            </nav>
          </div>
        )}
      </section>
      <aside className="blog-note">
        <span className="blog-note__mark" aria-hidden="true">
          ✳
        </span>
        <div>
          <h2>
            {copy(
              'From the workbench, with curiosity.',
              'من تجربة العمل، بروح الفضول.',
            )}
          </h2>
          <p>
            {copy(
              'I’m Abdalrahman. I build mobile apps, web platforms, and the systems behind them. This is where I share what I learn along the way.',
              'أنا عبدالرحمن. أطوّر تطبيقات الجوال ومنصات الويب والأنظمة التي تشغّلها. هنا أشارك ما أتعلّمه خلال الرحلة.',
            )}
          </p>
          <Link className="blog-text-link" to={pathFor('/about')}>
            {copy('More about me', 'المزيد عني')}{' '}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </aside>
      <BlogFooter />
    </div>
  )
}
