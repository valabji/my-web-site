import { Link } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { formatDate, imageUrl } from '../../lib/blog.js'

export function useBlogCopy() {
  const context = useLanguage()
  return { ...context, copy: (en, ar) => (context.isArabic ? ar : en) }
}
export function PostMeta({ post }) {
  const { language, copy } = useBlogCopy()
  return (
    <div className="blog-meta">
      <time dateTime={post.publishedAt}>
        {formatDate(post.publishedAt, language)}
      </time>
      <span aria-hidden="true">·</span>
      <span>
        {post.readingMinutes || 1} {copy('min read', 'دقائق للقراءة')}
      </span>
    </div>
  )
}
export function PostCard({ post, featured = false, index = 0 }) {
  const { pathFor, copy } = useBlogCopy()
  const cover = imageUrl(post.coverImage, featured ? 1200 : 640)
  return (
    <article
      className={`blog-card${featured ? ' blog-card--featured' : ''}`}
      lang={post.language || 'en'}
      dir={post.language === 'ar' ? 'rtl' : 'ltr'}
    >
      <Link
        className="blog-card__visual"
        to={pathFor(`/blog/${post.slug}`)}
        tabIndex={-1}
        aria-hidden="true"
      >
        {cover ? (
          <img
            src={cover}
            alt=""
            width="1200"
            height="750"
            loading={featured ? 'eager' : 'lazy'}
            decoding="async"
            style={{
              objectPosition: `${(post.coverImage.hotspot?.x ?? 0.5) * 100}% ${(post.coverImage.hotspot?.y ?? 0.5) * 100}%`,
            }}
          />
        ) : (
          <div className={`blog-art blog-art--${index % 3}`}>
            <span className="blog-art__code">
              {'{ '}
              <span>{post.tags?.[0] || 'notes'}</span>
              {' }'}
            </span>
            <span className="blog-art__label">VALABJI / ENGINEERING NOTES</span>
          </div>
        )}
      </Link>
      <div className="blog-card__content">
        <div className="blog-eyebrow">
          {featured
            ? copy('Latest story', 'أحدث المقالات')
            : post.tags?.[0] || copy('Engineering', 'هندسة البرمجيات')}
          <span aria-hidden="true">↗</span>
        </div>
        <h2>
          <Link to={pathFor(`/blog/${post.slug}`)}>{post.title}</Link>
        </h2>
        {post.excerpt && <p className="blog-card__excerpt">{post.excerpt}</p>}
        <PostMeta post={post} />
        {featured && (
          <Link className="blog-text-link" to={pathFor(`/blog/${post.slug}`)}>
            {copy('Read the story', 'اقرأ المقال')}{' '}
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </article>
  )
}
export function BlogState({
  status,
  retry,
  emptyTitle,
  emptyDescription,
  children,
}) {
  const { copy } = useBlogCopy()
  if (status === 'loading')
    return (
      <div className="blog-loading" role="status">
        <span className="blog-eyebrow">
          {copy('Loading stories…', 'جارٍ تحميل المقالات…')}
        </span>
        <div className="blog-skeleton" />
        <div className="blog-skeleton blog-skeleton--short" />
      </div>
    )
  return (
    <div className="blog-state" role={status === 'error' ? 'alert' : 'status'}>
      <span className="blog-state__symbol" aria-hidden="true">
        {status === 'error' ? '↻' : '✳'}
      </span>
      <h2>
        {status === 'error'
          ? copy('A small interruption.', 'تعذّر التحميل.')
          : emptyTitle}
      </h2>
      <p>
        {status === 'error'
          ? copy(
              'The stories couldn’t be loaded. Please try again in a moment.',
              'تعذّر تحميل المقالات. يُرجى المحاولة مرة أخرى.',
            )
          : emptyDescription}
      </p>
      {status === 'error' ? (
        <button className="blog-button" onClick={retry}>
          {copy('Try again', 'حاول مرة أخرى')}
        </button>
      ) : (
        children
      )}
    </div>
  )
}
export function BlogFooter() {
  const { pathFor, copy } = useBlogCopy()
  return (
    <footer className="blog-footer">
      <div>
        <Link className="mono" to={pathFor('/')}>
          ~/valabji
        </Link>
        <p>
          {copy(
            'Thoughtfully built. Always learning.',
            'أبني بعناية. وأتعلّم باستمرار.',
          )}
        </p>
      </div>
      <div className="blog-footer__links">
        <a href="/feed.xml">
          RSS <span aria-hidden="true">↗</span>
        </a>
        <Link to={pathFor('/about')}>{copy('About', 'نبذة عني')}</Link>
        <Link to={pathFor('/contact')}>
          {copy('Let’s talk', 'لنتحدث')} <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </footer>
  )
}
