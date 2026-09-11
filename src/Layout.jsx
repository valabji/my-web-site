import { Outlet } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import { usePointerScene } from './hooks/usePointerScene'

export default function Layout() {
  usePointerScene()
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
    </>
  )
}
