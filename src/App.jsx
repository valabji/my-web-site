import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout.jsx'
import Home from './pages/Home.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ExperiencePage from './pages/ExperiencePage.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import ProjectPage from './pages/ProjectPage.jsx'
import SkillsPage from './pages/SkillsPage.jsx'
import OpenSourcePage from './pages/OpenSourcePage.jsx'
import CertificationsPage from './pages/CertificationsPage.jsx'
import RecommendationsPage from './pages/RecommendationsPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import ErrorPage from './pages/Error.jsx'
import { LanguageProvider } from './i18n/LanguageContext.jsx'

const children = [
  { index: true, element: <Home /> },
  { path: 'about', element: <AboutPage /> },
  { path: 'experience', element: <ExperiencePage /> },
  { path: 'projects', element: <ProjectsPage /> },
  { path: 'projects/:slug', element: <ProjectPage /> },
  { path: 'skills', element: <SkillsPage /> },
  { path: 'opensource', element: <OpenSourcePage /> },
  { path: 'certifications', element: <CertificationsPage /> },
  { path: 'recommendations', element: <RecommendationsPage /> },
  { path: 'contact', element: <ContactPage /> },
  { path: '*', element: <ErrorPage /> },
]

function LocalizedLayout({ language }) {
  return (
    <LanguageProvider language={language}>
      <Layout />
    </LanguageProvider>
  )
}

const router = createBrowserRouter([
  { path: '/', element: <LocalizedLayout language="en" />, children },
  { path: '/ar', element: <LocalizedLayout language="ar" />, children },
])

export default function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  )
}
