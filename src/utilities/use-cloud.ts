import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import type { PaymentMethod } from '@stripe/stripe-js'

import type { Plan, Project, Team } from '@root/payload-cloud-types'
import { qs } from '@utilities/qs'

export type UseCloud<T, A = null> = (args?: A) => {
  result: T[]
  isLoading: null | boolean
  error: string
  reload: () => void
}

export const useCloud = <T>(args: {
  url?: string
  delay?: number
  method?: 'GET' | 'POST'
  body?: string
}): ReturnType<UseCloud<T>> => {
  const { url, delay = 250, method = 'GET', body } = args
  const hasMadeRequest = useRef(false)
  const [result, setResult] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState<boolean | null>(null)
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
    team?: string
    search?: string
  }
> = args => {
  const { team, search } = args || {}

  const query = qs.stringify({
    ...(team && team !== 'none'
      ? {
          where: {
            team: {
              equals: team,
            },
          },
        }
      : {}),
    ...(search && search?.length >= 3
      ? {
          name: {
            like: search,
          },
        }
      : {}),
  })

  return useCloud<Project>({
    url: `/api/projects${query ? `?${query}` : ''}`,
  })
}

type ProjectWithTeam = Omit<Project, 'team'> & {
  team: Team
}

export const useGetProject: UseCloud<
  ProjectWithTeam,
  {
    teamSlug?: string
    projectSlug?: string
    projectID?: string
  }
> = args => {
  const { teamSlug, projectSlug, projectID } = args || {}
  const query = qs.stringify({
    where: {
      and: [
        {
          team: {
            slug: {
              equals: teamSlug,
            },
          },
        },
        {
          slug: {
            equals: projectSlug,
          },
        },
      ],
    },
  })
  let url = teamSlug && projectSlug ? `/api/projects?${query}&limit=1` : ''

  if (projectID) {
    url = `/api/projects?where[id][equals]=${projectID}&limit=1`
  }

  return useCloud<ProjectWithTeam>({
    url,
  })
}

export const useGetTeam: UseCloud<Team, string> = teamSlug => {
  return useCloud<Team>({
    url: teamSlug ? `/api/teams?where[slug][equals]=${teamSlug.toLowerCase()}&limit=1` : '',
  })
}

export const useGetPaymentMethods: UseCloud<PaymentMethod, Team> = team => {
  return useCloud<PaymentMethod>({
    url: team ? `/api/stripe/rest` : '',
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
