import React, { useEffect } from 'react'

import { useAuth } from '@root/providers/Auth'
import { qs } from './qs'
import { Install } from './use-get-installs'

export interface Repo {
  name: string
  full_name: string
  id: string // applies only to the `import` flow
  description: string
}

export interface Results {
  total_count?: number
  repos: Repo[]
}
export const useGetRepos = (props: {
  selectedInstall: Install | undefined
  delay?: number
  perPage?: number
}): {
  error: string | undefined
  loading: boolean
  results
  page: number
  perPage: number
  setPage: React.Dispatch<React.SetStateAction<number>>
} => {
  const { selectedInstall, delay = 250, perPage = 30 } = props
  const [page, setPage] = React.useState<number>(1)
  const [error, setError] = React.useState<string | undefined>()
  const [loading, setLoading] = React.useState<boolean>(true)
  const [results, setResults] = React.useState<Results>({
    total_count: undefined,
    repos: [],
  })
  const { user } = useAuth()
  const hasRequested = React.useRef(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (user && selectedInstall) {
      setLoading(true)
      setError(undefined)

      const getRepos = async () => {
        if (!hasRequested.current) {
          hasRequested.current = true

          const query = qs.stringify({
            per_page: perPage,
            page,
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

          const res = await reposReq.json()

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
            setError(res.error)
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
