import type { Install } from '@cloud/_api/fetchInstalls'
import type { Endpoints } from '@octokit/types'

import { fetchInstallsClient } from '@cloud/_api/fetchInstalls'
import React, { useCallback, useEffect, useMemo } from 'react'

export type GitHubOrgsResponse = Endpoints['GET /user/memberships/orgs']['response']

export type GitHubOrg = GitHubOrgsResponse['data'][0]

interface Add {
  payload: Install
  type: 'add'
}

interface Set {
  payload: Install[]
  type: 'set'
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
  installs?: Install[]
  permissions?: Install['permissions']['administration']
}) => {
  error: string | undefined
  installs: Install[]
  loading: boolean
  reload: () => void
}

export const useGetInstalls: UseGetInstalls = (args) => {
  const { installs: initialInstalls, permissions } = args || {}
  const [error, setError] = React.useState<string | undefined>()
  const [installsLoading, setInstallsLoading] = React.useState(false)
  const [installs, dispatchInstalls] = React.useReducer(installReducer, initialInstalls || [])
  const hasRequested = React.useRef(false)

  const loadInstalls = useCallback(async (): Promise<Install[]> => {
    try {
      const installations = await fetchInstallsClient()

      // filter these based on the given permissions and user role
      const installationsWithPermission = installations.filter((install) => {
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
    () => ({ error, installs, loading: installsLoading, reload }),
    [installs, error, installsLoading, reload],
  )

  return memoizedState
}
