import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'

export default function Layout() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Outlet />
    </div>
  )
}
