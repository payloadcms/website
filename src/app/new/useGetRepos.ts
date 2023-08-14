import React, { useEffect } from 'react'
import type { Install } from '@cloud/_api/fetchInstalls'
import type { Endpoints } from '@octokit/types'

import { useAuth } from '@root/providers/Auth'
import { qs } from '../../utilities/qs'

type GitHubResponse =
  Endpoints['GET /user/installations/{installation_id}/repositories']['response']

export type Repo = GitHubResponse['data']['repositories'][0]

interface Results {
  total_count: GitHubResponse['data']['total_count']
  repos: GitHubResponse['data']['repositories']
}

export const useGetRepos = (props: {
  selectedInstall: Install | undefined
  delay?: number
  perPage?: number
}): {
  error: string | undefined
  loading: boolean
  results: Results
  page: number
  perPage: number
  setPage: React.Dispatch<React.SetStateAction<number>>
} => {
  const { selectedInstall, delay = 250, perPage = 30 } = props
  const prevSelectedInstall = React.useRef<number | undefined>(selectedInstall?.id)
  const [page, setPage] = React.useState<number>(1)
  const prevPage = React.useRef<number>(page)
  const [error, setError] = React.useState<string | undefined>()
  const [loading, setLoading] = React.useState<boolean>(true)
  const [results, setResults] = React.useState<Results>({
    total_count: 0,
    repos: [],
  })
  const { user } = useAuth()
  const hasRequested = React.useRef(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    let pageToUse = page

    // have to track `prevPage` here because we need fire `setPage` from within the effect
    // and we don't want to trigger the effect again
    const scopeChanged = prevSelectedInstall.current !== selectedInstall?.id
    const pageChanged = prevPage.current !== page

    if (user && selectedInstall && (scopeChanged || pageChanged)) {
      prevPage.current = page
      prevSelectedInstall.current = selectedInstall.id

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

          const query = qs.stringify({
            per_page: perPage,
            page: pageToUse,
          })

          const reposReq = await fetch(
            `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/github`,
            {
              method: 'POST',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                route: `GET /user/installations/${selectedInstall.id}/repositories?${query}`,
              }),
            },
          )

          const res: GitHubResponse = await reposReq.json()

          if (reposReq.ok) {
            timeout = setTimeout(() => {
              setResults({
                total_count: res.data.total_count,
                repos: res.data.repositories,
              })
              setLoading(false)
              setError(undefined)
            }, delay)
          } else {
            setError(`Error getting repos: ${res.status}`)
            setLoading(false)
          }

          hasRequested.current = false
        }
      }

      getRepos()
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [user, selectedInstall, delay, perPage, page])

  const memoizedState = React.useMemo(
    () => ({ results, error, loading, perPage, setPage, page }),
    [results, error, loading, perPage, setPage, page],
  )

  return memoizedState
}
