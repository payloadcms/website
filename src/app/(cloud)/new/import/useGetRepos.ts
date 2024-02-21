import React, { useEffect } from 'react'
import type { Install } from '@cloud/_api/fetchInstalls'
import type { Repo, RepoResults } from '@cloud/_api/fetchRepos'
import { fetchReposClient } from '@cloud/_api/fetchRepos'

import { useAuth } from '@root/providers/Auth'

export const useGetRepos = (props: {
  selectedInstall: Install | undefined
  delay?: number
  perPage?: number
  repos?: Repo[]
  reloadTicker?: number
}): {
  error: string | undefined
  loading: boolean
  results: RepoResults
  page: number
  perPage: number
  setPage: React.Dispatch<React.SetStateAction<number>>
} => {
  const { selectedInstall, delay = 250, perPage = 30, repos: initialRepos, reloadTicker } = props

  const prevSelectedInstall = React.useRef<number | undefined>(selectedInstall?.id)
  const [page, setPage] = React.useState<number>(1)
  const prevPage = React.useRef<number>(page)
  const prevReloadTicker = React.useRef<number | undefined>(reloadTicker)
  const [error, setError] = React.useState<string | undefined>()
  const [loading, setLoading] = React.useState<boolean>(initialRepos === undefined)

  const [results, setResults] = React.useState<RepoResults>({
    total_count: initialRepos?.length ?? 0,
    repositories: initialRepos ?? [],
  })

  const { user } = useAuth()
  const hasRequested = React.useRef(false)
  const requestRef = React.useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // keep a timer reference so that we can cancel the old request
    // this is if the old request takes longer than the debounce time
    if (requestRef.current) clearTimeout(requestRef.current)

    let pageToUse = page

    // we don't want to trigger this effect accidentally
    // so we keep track of the previous props and compare their values
    // I know this is disgusting, but it works
    const scopeChanged = prevSelectedInstall.current !== selectedInstall?.id
    if (scopeChanged) prevSelectedInstall.current = selectedInstall?.id
    const pageChanged = prevPage.current !== page
    if (pageChanged) prevPage.current = page
    const reloadChanged =
      typeof reloadTicker === 'number' &&
      reloadTicker <= 0 &&
      prevReloadTicker.current !== reloadTicker
    if (reloadChanged) prevReloadTicker.current = reloadTicker

    if (user && selectedInstall && (scopeChanged || pageChanged || reloadChanged)) {
      // scroll to the top of the page while the results are updating
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      })

      requestRef.current = setTimeout(() => {
        // when changing installs, reset page to 1
        // this is to prevent the user from being on page 2 of one install
        // and then switching to another install and being on page 2 of that install
        if (scopeChanged) {
          pageToUse = 1
          setPage(1)
        }

        setLoading(true)
        setError(undefined)

        const getRepos = async (): Promise<void> => {
          if (!hasRequested.current) {
            hasRequested.current = true

            try {
              const reposRes = await fetchReposClient({
                install: selectedInstall,
                page: pageToUse,
                per_page: perPage,
              })

              setResults({
                total_count: reposRes.total_count,
                repositories: reposRes.repositories,
              })

              setLoading(false)
              setError(undefined)
            } catch (err: unknown) {
              const msg = err instanceof Error ? err.message : 'Unknown error'
              setError(`Error getting repos: ${msg}`)
              setLoading(false)
            }

            hasRequested.current = false
          }
        }

        getRepos()
      }, 0)
    }

    return () => {
      if (requestRef.current) clearTimeout(requestRef.current)
    }
  }, [user, selectedInstall, delay, perPage, page, reloadTicker])

  const memoizedState = React.useMemo(
    () => ({ results, error, loading, perPage, setPage, page }),
    [results, error, loading, perPage, setPage, page],
  )

  return memoizedState
}
