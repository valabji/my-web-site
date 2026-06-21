import { Outlet } from 'react-router-dom'
import Nav from './components/Nav.jsx'

export default function Layout() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Nav />
      <main id="main-content" tabIndex={-1} aria-label="Main content">
        <Outlet />
      </main>
    </>
  )
}
