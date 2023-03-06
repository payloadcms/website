import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'

import type { Plan, Project, Team } from '@root/payload-cloud-types'

export type UseCloud<T, A = null> = (args?: A) => {
  result: T[]
  isLoading: boolean
  error: string
  reload: () => void
}

export const useCloud = <T>(url: string): ReturnType<UseCloud<T>> => {
  const hasMadeRequest = useRef(false)
  const [result, setResult] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [requestTicker, dispatchRequestTicker] = useReducer((state: number) => state + 1, 0)

  useEffect(() => {
    if (hasMadeRequest.current) return
    hasMadeRequest.current = true

    const makeRequest = async (): Promise<void> => {
      try {
        setIsLoading(true)

        const plansReq = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}${url}`, {
          credentials: 'include',
        })

        const json: {
          message: string
          docs: T[]
        } = await plansReq.json()

        if (plansReq.ok) {
          setResult(json.docs)
          setIsLoading(false)
        } else {
          throw new Error(json.message)
        }
      } catch (err: unknown) {
        const message = (err as Error)?.message || 'Something went wrong'
        setError(message)
        setIsLoading(false)
      }
    }

    makeRequest()
  }, [url, requestTicker])

  const reload = useCallback(() => {
    hasMadeRequest.current = false
    dispatchRequestTicker()
  }, [])

  const memoizedState = useMemo(
    () => ({ result, isLoading, error, reload }),
    [result, isLoading, error, reload],
  )

  return memoizedState
}

export const useGetPlans: UseCloud<Plan> = () => {
  return useCloud<Plan>('/api/plans?where[slug][not_equals]=enterprise&sort=order')
}

export const useGetProjects: UseCloud<Project, Team> = team => {
  return useCloud<Project>(`/api/projects?where[team][equals]=${team.id}`)
}
