import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import Home from './pages/Home.jsx'
import ErrorPage from './pages/Error.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: '*', element: <ErrorPage /> },
    ],
  },
])

export default function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  )
}
