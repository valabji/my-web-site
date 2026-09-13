import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import ScrollUp from './components/ScrollUp.jsx'
import { usePointerScene } from './hooks/usePointerScene'

export default function Layout() {
  usePointerScene()
  const location = useLocation()

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
  }, [location.pathname, location.hash])

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="scene-bg" aria-hidden="true">
        <div className="scene-bg__glow" />
        <div className="scene-bg__grid" />
        <div className="scene-bg__near" />
      </div>
      <Nav />
      <main id="main-content" tabIndex={-1} aria-label="Main content">
        <Outlet />
      </main>
      <ScrollUp />
    </>
  )
}
