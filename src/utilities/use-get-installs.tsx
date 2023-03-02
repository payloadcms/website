import React, { useCallback, useEffect, useMemo } from 'react'

import { useAuth } from '@root/providers/Auth'

export interface Install {
  id: number
  account: {
    id: string
    login: string
  }
  html_url: string
  target_type: 'User' | 'Organization'
}

type Add = {
  type: 'add'
  payload: Install
}

type Set = {
  type: 'set'
  payload: Install[]
}

type Action = Add | Set

const installReducer = (state: Install[], action: Action) => {
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

    const res = await installsReq.json()

    if (!installsReq.ok) {
      setError(res.error)
    }

    return res.data?.installations
  }, [])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (user) {
      const getInstalls = async () => {
        timeout = setTimeout(() => {
          setInstallsLoading(true)
        }, 250)

        const installations = await loadInstalls()
        clearTimeout(timeout)
        dispatchInstalls({ type: 'set', payload: installations })
        setInstallsLoading(false)
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
