import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PortableText } from '@portabletext/react'
import { Helmet } from 'react-helmet-async'
import SEO from '../components/SEO.jsx'
import {
  BlogFooter,
  BlogState,
  PostCard,
  PostMeta,
  useBlogCopy,
} from '../components/blog/BlogUI.jsx'
import { useSanityQuery } from '../hooks/useSanityQuery.js'
import {
  POST_QUERY,
  blockText,
  headingId,
  imageUrl,
  safeHref,
} from '../lib/blog.js'
import './Blog.css'

function ArticleImage({ value }) {
  const src = imageUrl(value, 1400)
  if (!src) return null
  return (
    <figure>
      <img
        src={src}
        alt={value.alt || ''}
        width={value.dimensions?.width}
        height={value.dimensions?.height}
        loading="lazy"
        decoding="async"
      />
      {value.caption && <figcaption>{value.caption}</figcaption>}
    </figure>
  )
}
function CodeBlock({ value }) {
  return (
    <figure className="blog-code">
      <figcaption>{value.filename || value.language || 'Code'}</figcaption>
      <pre dir="ltr">
        <code>{value.code}</code>
      </pre>
    </figure>
  )
}
const components = {
  block: {
    h1: ({ children, value }) => <h2 id={headingId(value)}>{children}</h2>,
    h2: ({ children, value }) => <h2 id={headingId(value)}>{children}</h2>,
    h3: ({ children, value }) => <h3 id={headingId(value)}>{children}</h3>,
  },
  types: { image: ArticleImage, codeBlock: CodeBlock },
  marks: {
    link: ({ children, value }) => {
      const href = safeHref(value?.href)
      return href ? (
        <a
          href={href}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      ) : (
        <>{children}</>
      )
    },
  },
}
export default function BlogPost() {
  const { slug } = useParams()
  const { pathFor, copy } = useBlogCopy()
  const { data, status, retry } = useSanityQuery(POST_QUERY, { slug })
  const [shareStatus, setShareStatus] = useState('')
  useEffect(() => {
    setShareStatus('')
  }, [slug])
  const post = data?.post
  const url = `https://valabji.com${pathFor(`/blog/${slug}`)}`
  async function share() {
    try {
      await navigator.clipboard.writeText(url)
      setShareStatus(copy('Link copied', 'تم نسخ الرابط'))
    } catch {
      setShareStatus(
        copy(
          'Copy the address from your browser to share this story.',
          'انسخ العنوان من المتصفح لمشاركة المقال.',
        ),
      )
    }
  }
  if (status !== 'ready' || !post)
    return (
      <div className="blog-shell">
        <SEO
          title={copy('Engineering notes', 'ملاحظات هندسية')}
          canonical={`/blog/${slug}`}
        />
        <Helmet>
          <meta name="robots" content="noindex,follow" />
        </Helmet>
        <Link className="blog-back" to={pathFor('/blog')}>
          ← {copy('All stories', 'كل المقالات')}
        </Link>
        <div data-blog-status={status}>
          <BlogState
            status={status}
            retry={retry}
            emptyTitle={copy('This story isn’t here.', 'هذا المقال غير موجود.')}
            emptyDescription={copy(
              'It may have moved or hasn’t been published yet.',
              'ربما نُقل أو لم يُنشر بعد.',
            )}
          >
            <Link className="blog-button" to={pathFor('/blog')}>
              {copy('Explore the journal', 'تصفّح المدونة')}
            </Link>
          </BlogState>
        </div>
        <BlogFooter />
      </div>
    )
  const headings = (post.body || []).filter(
    (block) =>
      block._type === 'block' && ['h1', 'h2', 'h3'].includes(block.style),
  )
  const cover = imageUrl(post.coverImage, 1600)
  const postLanguage = post.language || 'en'
  return (
    <div className="blog-shell">
      <SEO
        title={post.title}
        description={post.excerpt}
        canonical={`/blog/${slug}`}
        image={cover}
        imageAlt={post.coverImage?.alt || post.title}
        type="article"
        contentLanguage={postLanguage}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          dateModified: post._updatedAt,
          image: cover,
          mainEntityOfPage: url,
          author: {
            '@type': 'Person',
            name: 'Abdalrahman Valabji',
            url: 'https://valabji.com/about',
          },
          publisher: {
            '@type': 'Person',
            name: 'Abdalrahman Valabji',
            url: 'https://valabji.com',
          },
        }}
      />
      <Helmet>
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:modified_time" content={post._updatedAt} />
        <meta property="article:author" content="Abdalrahman Valabji" />
        {post.tags?.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Valabji — Engineering notes"
          href="/feed.xml"
        />
      </Helmet>
      <nav
        className="blog-breadcrumb"
        aria-label={copy('Breadcrumb', 'مسار التصفح')}
      >
        <Link to={pathFor('/blog')}>
          ← {copy('All stories', 'كل المقالات')}
        </Link>
        <span aria-hidden="true">/</span>
        <span>{post.tags?.[0] || copy('Journal', 'المدونة')}</span>
      </nav>
      <article
        data-blog-status="ready"
        lang={postLanguage}
        dir={postLanguage === 'ar' ? 'rtl' : 'ltr'}
      >
        <header className="blog-article-header">
          <div className="blog-eyebrow">
            {copy('Engineering notes', 'ملاحظات هندسية')}
          </div>
          <h1>{post.title}</h1>
          {post.excerpt && (
            <p className="blog-article-excerpt">{post.excerpt}</p>
          )}
          <div className="blog-byline">
            <Link to={pathFor('/about')}>
              <img
                src="/assets/imgs/me-thumb.webp"
                width="44"
                height="44"
                alt=""
              />
              <span>
                Abdalrahman Valabji
                <span className="blog-byline__role">
                  {copy(
                    'Software engineer & curious builder',
                    'مهندس برمجيات وشغوف بالبناء',
                  )}
                </span>
              </span>
            </Link>
            <PostMeta post={post} />
          </div>
        </header>
        {cover && (
          <figure className="blog-cover">
            <img
              src={cover}
              alt={post.coverImage.alt || ''}
              width={post.coverImage.dimensions?.width}
              height={post.coverImage.dimensions?.height}
              fetchPriority="high"
            />
            {post.coverImage.caption && (
              <figcaption>{post.coverImage.caption}</figcaption>
            )}
          </figure>
        )}
        <div
          className={`blog-reading-layout${headings.length ? '' : ' blog-reading-layout--single'}`}
        >
          {headings.length > 0 && (
            <aside className="blog-toc">
              <nav aria-label={copy('On this page', 'في هذه الصفحة')}>
                <p className="blog-eyebrow">
                  {copy('On this page', 'في هذه الصفحة')}
                </p>
                <ol>
                  {headings.map((heading) => (
                    <li
                      key={heading._key}
                      className={
                        heading.style === 'h3' ? 'blog-toc__nested' : ''
                      }
                    >
                      <a href={`#${headingId(heading)}`}>
                        {blockText(heading)}
                      </a>
                    </li>
                  ))}
                </ol>
                <a className="blog-text-link" href="#main-content">
                  {copy('Back to top', 'العودة للأعلى')} ↑
                </a>
              </nav>
            </aside>
          )}
          <div>
            <div className="blog-prose">
              <PortableText value={post.body || []} components={components} />
            </div>
            <div className="blog-article-end">
              <div className="blog-topics">
                {post.tags?.map((tag) => (
                  <Link
                    key={tag}
                    to={`${pathFor('/blog')}?tag=${encodeURIComponent(tag)}`}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
              <button className="blog-button" onClick={share}>
                {copy('Copy story link', 'نسخ رابط المقال')} ↗
              </button>
              <p className="blog-share-status" role="status">
                {shareStatus}
              </p>
            </div>
            <aside className="blog-author">
              <img
                src="/assets/imgs/me-thumb.webp"
                width="64"
                height="64"
                alt=""
              />
              <div>
                <p className="blog-eyebrow">{copy('Written by', 'بقلم')}</p>
                <h2>Abdalrahman Valabji</h2>
                <p>
                  {copy(
                    'Building mobile, web, and backend systems. Sharing the thinking behind the code.',
                    'أطوّر تطبيقات الجوال والويب والأنظمة الخلفية. وأشارك الأفكار وراء الكود.',
                  )}
                </p>
                <Link className="blog-text-link" to={pathFor('/contact')}>
                  {copy('Start a conversation', 'لنتحدث')} →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </article>
      {data.related?.length > 0 && (
        <section className="blog-related">
          <div className="blog-results-heading">
            <h2>{copy('Keep exploring', 'واصل القراءة')}</h2>
            <Link className="blog-text-link" to={pathFor('/blog')}>
              {copy('All stories', 'كل المقالات')} →
            </Link>
          </div>
          <div className="blog-grid">
            {data.related.map((related, index) => (
              <PostCard key={related._id} post={related} index={index} />
            ))}
          </div>
        </section>
      )}
      <BlogFooter />
    </div>
  )
}
