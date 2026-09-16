import { createContext, useContext, useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { messages, dynamicArabic } from './translations.js'
import { resolveInitialLanguage } from './languageDetection.js'

const LanguageContext = createContext(null)
const BOT_RE = /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|linkedinbot|twitterbot|whatsapp/i

export function localePath(pathname, language) {
  const cleanPath = pathname.replace(/^\/ar(?=\/|$)/, '') || '/'
  return language === 'ar'
    ? `/ar${cleanPath === '/' ? '' : cleanPath}`
    : cleanPath
}

export function LanguageProvider({ language, children }) {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.body.dataset.language = language
  }, [language])

  useEffect(() => {
    if (language !== 'en' || typeof navigator === 'undefined') return
    if (navigator.webdriver || BOT_RE.test(navigator.userAgent)) return

    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 3000)
    let savedLanguage
    try {
      savedLanguage = window.localStorage.getItem('preferred-language')
    } catch {
      // Private browsing may make storage unavailable.
    }

    void resolveInitialLanguage({
      savedLanguage,
      systemLanguage: navigator.language || navigator.languages?.[0],
      fetchCountry: window.fetch.bind(window),
      signal: controller.signal,
    }).then((initialLanguage) => {
      window.clearTimeout(timeout)
      if (!controller.signal.aborted && initialLanguage === 'ar') {
        try {
          // A visitor may have selected English while the IP request was pending.
          if (window.localStorage.getItem('preferred-language') === 'en') return
        } catch {
          // Continue without a stored preference when storage is unavailable.
        }
        navigate(`${localePath(location.pathname, 'ar')}${location.search}${location.hash}`, {
          replace: true,
        })
      }
    })

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [language, location.hash, location.pathname, location.search, navigate])

  const value = useMemo(() => {
    const t = (key, vars = {}) => {
      const raw = messages[language]?.[key] ?? messages.en[key] ?? key
      return Object.entries(vars).reduce(
        (value, [name, replacement]) => value.replaceAll(`{${name}}`, replacement),
        raw,
      )
    }
    const tr = (value) => language === 'ar' ? (dynamicArabic[value] ?? value) : value
    const pathFor = (path) => localePath(path, language)
    const switchLanguage = (nextLanguage) => {
      window.localStorage.setItem('preferred-language', nextLanguage)
      navigate(`${localePath(location.pathname, nextLanguage)}${location.search}${location.hash}`)
    }

    return {
      language,
      isArabic: language === 'ar',
      t,
      tr,
      pathFor,
      switchLanguage,
    }
  }, [language, location.hash, location.pathname, location.search, navigate])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider')
  return context
}
