import { useEffect, useState } from 'react'
import { sanity } from '../lib/sanity.js'
import { fetchPublishedBlog } from '../lib/blogArchive.js'

export function useSanityQuery(query, params) {
  const key = JSON.stringify(params)
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState({ key: '', data: null, status: 'loading' })
  const requestKey = query + key + attempt
  useEffect(() => {
    const controller = new AbortController()
    setState({ key: requestKey, data: null, status: 'loading' })
    const fetchContent = import.meta.env.PROD
      ? fetchPublishedBlog
      : sanity.fetch.bind(sanity)
    fetchContent(query, JSON.parse(key), { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted)
          setState({ key: requestKey, data, status: 'ready' })
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setState({ key: requestKey, data: null, status: 'error' })
      })
    return () => controller.abort()
  }, [query, key, requestKey])
  return {
    ...(state.key === requestKey ? state : { data: null, status: 'loading' }),
    retry: () => setAttempt((value) => value + 1),
  }
}
