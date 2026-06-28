import { useEffect, useState } from 'react'

/**
 * Minimal data-fetching hook. Returns { data, loading, error, refresh }.
 * Ponytail: same shape as swr/react-query would give, but ~12 lines.
 */
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = () => {
    setLoading(true)
    setError(null)
    fetcher()
      .then((d) => setData(d))
      .catch((e) => setError(e?.response?.data?.detail || e.message || 'Error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error, refresh: run }
}
