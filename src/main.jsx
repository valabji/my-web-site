import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import './icons.css'
import App from './App.jsx'

// The static template/prerender provides metadata before JavaScript loads.
// Hand ownership to Helmet on startup to avoid duplicate route metadata.
document.head
  .querySelectorAll(
    [
      'meta[name="description"]',
      'meta[name="robots"]',
      'meta[property^="og:"]',
      'meta[property^="article:"]',
      'meta[name^="twitter:"]',
      'link[rel="canonical"]',
      'link[rel="alternate"][hreflang]',
      'link[rel="alternate"][type="application/rss+xml"]',
      'script[type="application/ld+json"]',
    ].join(','),
  )
  .forEach((element) => element.remove())

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)

if (typeof document !== 'undefined') {
  document.dispatchEvent(new Event('app-ready'))
}
