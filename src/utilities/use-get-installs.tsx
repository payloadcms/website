import React, { useCallback, useEffect } from 'react'

import { useAuth } from '@root/providers/Auth'

export interface Install {
  id: string
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

export const useGetInstalls = (): {
  error: string | undefined
  loading: boolean
  installs: Install[]
  reloadInstalls: () => void
} => {
  const [error, setError] = React.useState<string | undefined>()
  const [loading, setLoading] = React.useState(true)
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
      timeout = setTimeout(() => {
        setLoading(true)
      }, 250)
      const getInstalls = async () => {
        timeout = setTimeout(() => {
          setLoading(true)
        }, 250)

        const installations = await loadInstalls()
        dispatchInstalls({ type: 'set', payload: installations })
        clearTimeout(timeout)
        setLoading(false)
      }

      getInstalls()
    }
  }, [user, loadInstalls])

  const reloadInstalls = useCallback(async () => {
    const installations = await loadInstalls()
    dispatchInstalls({ type: 'set', payload: installations })
  }, [loadInstalls])

  return {
    installs,
    error,
    loading,
    reloadInstalls,
  }
}
