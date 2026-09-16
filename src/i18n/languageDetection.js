// Countries where Arabic is an official language.
const ARABIC_COUNTRIES = new Set([
  'AE', 'BH', 'DJ', 'DZ', 'EG', 'IQ', 'JO', 'KM', 'KW', 'LB', 'LY', 'MA',
  'MR', 'OM', 'PS', 'QA', 'SA', 'SD', 'SO', 'SY', 'TD', 'TN', 'YE',
])

function supportedLanguage(value) {
  const primary = String(value || '').toLowerCase().split(/[-_]/)[0]
  return primary === 'ar' || primary === 'en' ? primary : null
}

export async function resolveInitialLanguage({ savedLanguage, systemLanguage, fetchCountry, signal }) {
  // A saved choice must be one of the site's supported languages.
  if (savedLanguage === 'ar' || savedLanguage === 'en') return savedLanguage

  const systemChoice = supportedLanguage(systemLanguage)
  if (systemChoice) return systemChoice

  try {
    const response = await fetchCountry('https://ipinfo.io/json', { signal })
    if (!response.ok) return 'en'

    const { country } = await response.json()
    return ARABIC_COUNTRIES.has(String(country || '').toUpperCase()) ? 'ar' : 'en'
  } catch {
    return 'en'
  }
}
