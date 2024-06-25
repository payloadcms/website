import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { qs } from '@utilities/qs.js'

import type { Deployment, Plan, Project, Team } from '@root/payload-cloud-types.js'
import { useAuth } from '@root/providers/Auth/index.js'

export type UseCloudAPI<R, A = null> = (args?: A) => {
  result: R
  isLoading: null | boolean
  error: string
  reload: () => void
  reqStatus?: number
}

export const useCloudAPI = <R>(args: {
  url?: string
  delay?: number
  method?: 'GET' | 'POST'
  body?: string
  interval?: number
  initialState?: R
}): ReturnType<UseCloudAPI<R>> => {
  const { url, delay = 250, interval, method = 'GET', body, initialState } = args
  const isRequesting = useRef(false)
  const [result, setResult] = useState<R>(initialState as unknown as R)
  const [isLoading, setIsLoading] = useState<boolean | null>(null)
  const [error, setError] = useState('')
  const [requestTicker, dispatchRequestTicker] = useReducer((state: number) => state + 1, 0)
  const [reqStatus, setReqStatus] = useState<number | undefined>()

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (url) {
      if (isRequesting.current) return
      isRequesting.current = true

      const makeRequest = async (): Promise<void> => {
        try {
          setIsLoading(true)

          const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}${url}`, {
            method,
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body,
          })

          setReqStatus(req.status)

          const json: R = await req.json()

          if (req.ok) {
            setTimeout(() => {
              setResult(json)
              setError('')
              setIsLoading(false)
            }, delay)
          } else {
            // @ts-expect-error
            setError(json?.message || 'Something went wrong')
          }
        } catch (err: unknown) {
          const message = (err as Error)?.message || 'Something went wrong'
          setError(message)
          setIsLoading(false)
        }

        isRequesting.current = false
      }

      makeRequest()
    }

    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(timer)
    }
  }, [url, requestTicker, delay, method, body])

  const reload = useCallback(() => {
    isRequesting.current = false
    dispatchRequestTicker()
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (url && interval) {
      timer = setTimeout(() => {
        reload()
      }, interval)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [url, requestTicker, reload, interval])

  const memoizedState = useMemo(
    () => ({ result, isLoading, error, reload, reqStatus }),
    [result, isLoading, error, reload, reqStatus],
  )

  return memoizedState
}

export const useGetPlans: UseCloudAPI<Plan[]> = () => {
  const response = useCloudAPI<{
    docs: Plan[]
  }>({
    url: '/api/plans?where[slug][not_equals]=enterprise&sort=order',
  })

  return useMemo(() => {
    return {
      ...response,
      result: response.result?.docs,
    }
  }, [response])
}

interface ProjectsData {
  docs: Project[]
  totalPages: number
  totalDocs: number
}

export const useGetProjects: UseCloudAPI<
  ProjectsData,
  {
    teams?: string[]
    search?: string
    delay?: number
    page?: number
    initialState?: ProjectsData
  }
> = args => {
  const { user } = useAuth()
  const { teams: teamsFromArgs, search, delay, page, initialState } = args || {}

  const teamsWithoutNone = teamsFromArgs?.filter(team => team !== 'none') || []

  const userTeams =
    user?.teams?.map(({ team }) =>
      team && typeof team === 'object' && team !== null && 'id' in team ? team.id : team,
    ) || [].filter(Boolean) // eslint-disable-line function-paren-newline

  const teams = teamsWithoutNone && teamsWithoutNone?.length > 0 ? teamsWithoutNone : userTeams

  const query = qs.stringify({
    where: {
      team: {
        in: teams,
      },
      ...(search
        ? {
            name: {
              like: search,
            },
          }
        : {}),
    },
    page,
  })

  return useCloudAPI<ProjectsData>({
    url: `/api/projects${query ? `?${query}` : ''}`,
    delay,
    initialState,
  })
}

type ProjectWithTeam = Omit<Project, 'team'> & {
  team: Team
}

// you can get projects with either the `id` or `teamSlug` and `projectSlug`
export const useGetProject: UseCloudAPI<
  ProjectWithTeam | undefined | null,
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
          'team.slug': {
            equals: teamSlug,
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

  const response = useCloudAPI<{
    docs: ProjectWithTeam[]
  }>({
    url,
  })

  return useMemo(() => {
    return {
      ...response,
      // `undefined` and `null` results are needed for loading states and 404 redirects
      result:
        (projectSlug || projectID) && response?.result?.docs
          ? response.result.docs?.[0] || null
          : undefined,
    }
  }, [response, projectSlug, projectID])
}

export const useGetProjectDeployments: UseCloudAPI<
  Deployment[],
  {
    projectID?: string
    page?: number
    interval?: number
  }
> = args => {
  const { projectID, page = 0, interval } = args || {}

  const query = qs.stringify({
    where: {
      and: [
        {
          project: {
            equals: projectID,
          },
        },
      ],
    },
  })
  let url = `/api/deployments?${query}&limit=10&page=${page}&sort=-createdAt`

  const response = useCloudAPI<{
    docs: Deployment[]
  }>({
    url,
    interval: interval,
  })

  return useMemo(() => {
    return {
      ...response,
      result: response.result?.docs,
    }
  }, [response])
}

export const useGetActiveProjectDeployment: UseCloudAPI<
  Deployment,
  {
    projectID?: string
  }
> = args => {
  const { projectID } = args || {}

  const query = qs.stringify({
    where: {
      and: [
        {
          project: {
            equals: projectID,
          },
        },
        {
          deploymentStatus: {
            equals: 'ACTIVE',
          },
        },
      ],
    },
  })
  let url = `/api/deployments?${query}&limit=1`

  const response = useCloudAPI<{
    docs: Deployment[]
  }>({
    url,
  })

  return useMemo(() => {
    return {
      ...response,
      result: response.result?.docs?.[0],
    }
  }, [response])
}

export const useGetTeam: UseCloudAPI<Team | null | undefined, string> = teamSlug => {
  const response = useCloudAPI<{
    docs: Team[]
  }>({
    url: teamSlug ? `/api/teams?where[slug][equals]=${teamSlug.toLowerCase()}&limit=1` : '',
  })

  return useMemo(() => {
    return {
      ...response,
      // `undefined` and `null` results are needed for loading states and 404 redirects
      result: teamSlug && response?.result?.docs ? response.result.docs?.[0] || null : undefined,
    }
  }, [response, teamSlug])
}
