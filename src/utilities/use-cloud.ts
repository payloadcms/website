import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import type { PaymentMethod } from '@stripe/stripe-js'

import type { Plan, Project, Team } from '@root/payload-cloud-types'

export type UseCloud<T, A = null> = (args?: A) => {
  result: T[]
  isLoading: boolean
  error: string
  reload: () => void
}

export const useCloud = <T>(args: {
  url: string
  delay?: number
  method?: 'GET' | 'POST'
  body?: string
}): ReturnType<UseCloud<T>> => {
  const { url, delay = 250, method = 'GET', body } = args
  const hasMadeRequest = useRef(false)
  const [result, setResult] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [requestTicker, dispatchRequestTicker] = useReducer((state: number) => state + 1, 0)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (url) {
      if (hasMadeRequest.current) return
      hasMadeRequest.current = true

      const makeRequest = async (): Promise<void> => {
        try {
          setIsLoading(true)

          const plansReq = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}${url}`, {
            method,
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body,
          })

          const json: {
            message: string
            docs: T[]
          } = await plansReq.json()

          if (plansReq.ok) {
            setTimeout(() => {
              setResult(json.docs)
              setIsLoading(false)
            }, delay)
          } else {
            throw new Error(json.message)
          }
        } catch (err: unknown) {
          const message = (err as Error)?.message || 'Something went wrong'
          setError(message)
          setIsLoading(false)
        }

        hasMadeRequest.current = false
      }

      makeRequest()
    }

    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(timer)
    }
  }, [url, requestTicker, delay, method, body])

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
  return useCloud<Plan>({
    url: '/api/plans?where[slug][not_equals]=enterprise&sort=order',
  })
}

export const useGetProjects: UseCloud<
  Project,
  {
    team?: Team
    search?: string
  }
> = args => {
  const { team, search } = args || {}
  const query = search && search?.length >= 3 ? `where[name][like]=${search}` : undefined

  return useCloud<Project>({
    url: team ? `/api/projects?where[team][equals]=${team.id}${query ? `&${query}` : ''}` : '',
  })
}

export const useGetProject: UseCloud<Project, string> = projectSlug => {
  return useCloud<Project>({
    url: projectSlug ? `/api/projects?where[slug][equals]=${projectSlug}&limit=1` : '',
  })
}

export const useGetTeam: UseCloud<Team, string> = teamSlug => {
  return useCloud<Team>({
    url: teamSlug ? `/api/teams?where[slug][equals]=${teamSlug}&limit=1` : '',
  })
}

export const useGetPaymentMethods: UseCloud<PaymentMethod, Team> = team => {
  return useCloud<PaymentMethod>({
    url: `/api/stripe/rest`,
    method: 'POST',
    body: JSON.stringify({
      stripeMethod: 'customers.listPaymentMethods',
      stripeArgs: [
        team?.stripeCustomerID,
        {
          type: 'card',
        },
      ],
    }),
  })
}
