import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveInitialLanguage } from './languageDetection.js'

test('saved language takes priority over the browser language', async () => {
  for (const [savedLanguage, systemLanguage] of [['ar', 'en-GB'], ['en', 'ar-EG']]) {
    const language = await resolveInitialLanguage({
      savedLanguage,
      systemLanguage,
      fetchCountry: () => { throw new Error('IP lookup should not run') },
    })
    assert.equal(language, savedLanguage)
  }
})

test('primary browser language takes priority over IP location', async () => {
  for (const [systemLanguage, expected] of [['en-GB', 'en'], ['ar-EG', 'ar']]) {
    const language = await resolveInitialLanguage({
      systemLanguage,
      fetchCountry: () => { throw new Error('IP lookup should not run') },
    })
    assert.equal(language, expected)
  }
})

test('IP country is used for an unsupported browser language', async () => {
  for (const [country, expected] of [['EG', 'ar'], ['FR', 'en']]) {
    const language = await resolveInitialLanguage({
      systemLanguage: 'fr-FR',
      fetchCountry: async () => ({ ok: true, json: async () => ({ country }) }),
    })
    assert.equal(language, expected)
  }
})

test('unavailable IP data defaults to English', async () => {
  const language = await resolveInitialLanguage({
    systemLanguage: undefined,
    fetchCountry: async () => { throw new Error('Network unavailable') },
  })
  assert.equal(language, 'en')
})

test('invalid saved values do not override detection', async () => {
  const language = await resolveInitialLanguage({
    savedLanguage: 'fr',
    systemLanguage: 'ar-SA',
    fetchCountry: () => { throw new Error('IP lookup should not run') },
  })
  assert.equal(language, 'ar')
})
