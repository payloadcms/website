import React, { useCallback, useEffect, useMemo } from 'react'
import type { Install } from '@cloud/_api/fetchInstalls.js'
import { fetchInstallsClient } from '@cloud/_api/fetchInstalls.js'
import type { Endpoints } from '@octokit/types'

export type GitHubOrgsResponse = Endpoints['GET /user/memberships/orgs']['response']

export type GitHubOrg = GitHubOrgsResponse['data'][0]

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

export type UseGetInstalls = (args?: {
  permissions?: Install['permissions']['administration']
  installs?: Install[]
}) => {
  error: string | undefined
  loading: boolean
  installs: Install[]
  reload: () => void
}

export const useGetInstalls: UseGetInstalls = args => {
  const { permissions, installs: initialInstalls } = args || {}
  const [error, setError] = React.useState<string | undefined>()
  const [installsLoading, setInstallsLoading] = React.useState(false)
  const [installs, dispatchInstalls] = React.useReducer(installReducer, initialInstalls || [])
  const hasRequested = React.useRef(false)

  const loadInstalls = useCallback(async (): Promise<Install[]> => {
    try {
      const installations = await fetchInstallsClient()

      // filter these based on the given permissions and user role
      const installationsWithPermission = installations.filter(install => {
        return permissions ? permissions === install.permissions?.administration : true
      })

      return installationsWithPermission
    } catch (err: unknown) {
      setError(`Error getting installations: ${err}`)
    }

    return []
  }, [permissions])

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (!initialInstalls) {
      const loadInitialInstalls = async (): Promise<void> => {
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

      loadInitialInstalls()
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [loadInstalls, initialInstalls])

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
