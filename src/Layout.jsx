import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import ScrollUp from './components/ScrollUp.jsx'
import { usePointerScene } from './hooks/usePointerScene'
import { useLanguage } from './i18n/LanguageContext.jsx'

export default function Layout() {
  usePointerScene()
  const location = useLocation()
  const { t } = useLanguage()

  useEffect(() => {
    if (location.hash) {
      const timer = setTimeout(() => {
        const el = document.querySelector(location.hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
      return () => clearTimeout(timer)
    }
    window.scrollTo(0, 0)
  }, [location.pathname, location.hash])

  return (
    <>
      <a className="skip-link" href="#main-content">{t('skip')}</a>
      <div className="scene-bg" aria-hidden="true">
        <div className="scene-bg__glow" />
        <div className="scene-bg__grid" />
        <div className="scene-bg__near" />
      </div>
      <Nav />
      <main id="main-content" tabIndex={-1} aria-label={t('main')}>
        <Outlet />
      </main>
      <ScrollUp />
    </>
  )
}
