# My Personal Website

Personal website for Abdalrahman Valabji, live at [valabji.com](https://valabji.com/).

Rebuilt with **Vite + React**. Styled with **Bootstrap 5** (installed via npm) plus
the LineIcons icon font and Roboto.

## Develop

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build -> dist/
npm run preview  # preview the production build locally
```

## Deploy

Pushing to `master` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml),
which builds the site and publishes `dist/` to GitHub Pages (custom domain
`valabji.com` via `public/CNAME`).

The deployment compares the new sitemap and rendered pages with the previous
`gh-pages` deployment, keeps `lastmod` dates for unchanged pages, and submits
added, changed, and deleted URLs to IndexNow after the new site is live.

## History

The previous Create React App (`react-scripts`) version of this site is archived
under [`old/`](old/) for reference.

## Blog

The journal lives at `/blog` (and `/ar/blog`). It serves a build-time snapshot of published Sanity posts, with six articles per page, topic filters, search, and date sorting in shareable URL parameters. Article language is independent of the navigation language; existing posts default to English. Drafts and future-dated posts are excluded.

- Copy `.env.example` to `.env.local` only if using a different public Sanity project or dataset. No browser API token is needed or supported.
- Development uses a local read-only Vite proxy to query Sanity. Production reads same-origin files in `dist/blog-data/`, generated from the public API during the build, so it does not depend on a Sanity browser CORS allowlist. Run `npm run dev` in `studio/` to edit posts. Set title, stable slug, excerpt, language, publication date, body, and optional cover image/topics. Images support alt text and captions; the body supports code blocks.
- `npm run build` discovers published posts and prerenders the archive and every article in both navigation languages, then generates `dist/sitemap.xml`, `dist/feed.xml`, and `dist/blog-data/`. Archive responses contain summaries only; article bodies load separately. Sanity must be reachable and a headless browser available during the build; failures stop the build rather than silently emitting an incomplete archive. Publish changes in Studio and rebuild to refresh static HTML, RSS, and sitemap. A future publication date also needs a rebuild at publication time for those artifacts.
- `npm run preview` serves the complete build, including RSS. Vite development does not generate `feed.xml`.
- The static host must serve generated route directories and route unknown client-side paths to the SPA entry point. Missing articles render an explicit not-found state with `noindex`; true HTTP 404 responses for unknown article routes require host routing rules or a server.
- `npm test` runs regression checks. `npm run test:blog` checks archive navigation, search/filter/sort, pagination, article rendering, error recovery, Arabic navigation, mobile layout, and keyboard navigation against isolated browser fixtures. Run the local dev server first; set `BLOG_TEST_URL` to use a different origin. With `npm run preview` running, `npm run test:blog:production` validates the actual built articles, metadata, RSS, sitemap, responsive layout, and absence of runtime CMS requests.

The Sanity client uses the explicit published perspective and cancellable requests, following [Sanity’s client documentation](https://www.sanity.io/docs/apis-and-sdks/js-client-querying).
