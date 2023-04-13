import React, { useCallback, useEffect, useMemo } from 'react'
import type { Endpoints } from '@octokit/types'

import { useAuth } from '@root/providers/Auth'

type GitHubResponse = Endpoints['GET /user/installations']['response']

export type Install = GitHubResponse['data']['installations'][0]

interface Add {
  type: 'add'
  payload: Install
}

interface Set {
  type: 'set'
  payload: Install[]
}

type Action = Add | Set

const installReducer = (state: Install[], action: Action): Install[] => {
  switch (action.type) {
    case 'add':
      return [...state, action.payload]
    case 'set':
      return action.payload
    default:
      return state
  }
}

export type UseGetInstalls = () => {
  error: string | undefined
  loading: boolean
  installs: Install[]
  reload: () => void
}

export const useGetInstalls: UseGetInstalls = () => {
  const [error, setError] = React.useState<string | undefined>()
  const [installsLoading, setInstallsLoading] = React.useState(true)
  const [installs, dispatchInstalls] = React.useReducer(installReducer, [])
  const { user } = useAuth()
  const hasRequested = React.useRef(false)

  const loadInstalls = useCallback(async (): Promise<Install[]> => {
    const installsReq = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/github`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route: `GET /user/installations`,
      }),
    })

    const res: GitHubResponse = await installsReq.json()

    if (!installsReq.ok) {
      setError(`Error getting installations: ${res.status}`)
    }

    return res.data?.installations
  }, [])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (user) {
      const getInstalls = async (): Promise<void> => {
        if (!hasRequested.current) {
          hasRequested.current = true

          timeout = setTimeout(() => {
            setInstallsLoading(true)
          }, 250)

          const installations = await loadInstalls()
          clearTimeout(timeout)
          dispatchInstalls({ type: 'set', payload: installations })
          setInstallsLoading(false)

          hasRequested.current = false
        }
      }

      getInstalls()
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [user, loadInstalls])

  const reload = useCallback(async () => {
    const installations = await loadInstalls()
    dispatchInstalls({ type: 'set', payload: installations })
  }, [loadInstalls])

  const memoizedState = useMemo(
    () => ({ installs, error, loading: installsLoading, reload }),
    [installs, error, installsLoading, reload],
  )

  return memoizedState
}
