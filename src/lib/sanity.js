import { createClient } from '@sanity/client'

export const sanity = createClient({
  projectId: import.meta.env?.VITE_SANITY_PROJECT_ID || 'pdvy8mfz',
  dataset: import.meta.env?.VITE_SANITY_DATASET || 'production',
  apiVersion: '2026-10-02',
  useCdn: true,
  perspective: 'published',
  timeout: 15000,
  ...(import.meta.env?.DEV && typeof window !== 'undefined'
    ? {
        apiHost: `${window.location.origin}/sanity-api`,
        useProjectHostname: false,
        useCdn: false,
      }
    : {}),
})
