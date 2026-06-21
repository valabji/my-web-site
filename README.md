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

## History

The previous Create React App (`react-scripts`) version of this site is archived
under [`old/`](old/) for reference.
