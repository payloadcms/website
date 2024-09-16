import { PROJECT_QUERY, PROJECTS_QUERY } from '@data/project.js'
import type { Project } from '@root/payload-cloud-types.js'
import { payloadCloudToken } from './token.js'

export interface ProjectsRes {
  docs: Project[]

  totalDocs: number
  totalPages: number
  page: number
  limit: number
}

export const fetchProjects = async (teamIDs: string[]): Promise<ProjectsRes> => {
  const { cookies } = await import('next/headers')
  const token = cookies().get(payloadCloudToken)?.value ?? null
  if (!token) throw new Error('No token provided')

  const res: ProjectsRes = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `JWT ${token}` } : {}),
    },
    next: { tags: ['projects'] },
    body: JSON.stringify({
      query: PROJECTS_QUERY,
      variables: {
        teamIDs: teamIDs.filter(Boolean),
        limit: 8,
        page: 1,
      },
    }),
  })
    ?.then(r => r.json())
    ?.then(data => {
      if (data.errors) throw new Error(data?.errors?.[0]?.message ?? 'Error fetching doc')
      return data?.data?.Projects
    })

  return res
}

export const fetchProjectsClient = async ({
  teamIDs,
  page = 1,
  limit = 8,
  search,
}: {
  teamIDs: Array<string | undefined>
  page: number
  limit?: number
  search?: string
}): Promise<ProjectsRes> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      query: PROJECTS_QUERY,
      variables: {
        teamIDs: teamIDs.filter(Boolean),
        page,
        limit,
        search,
      },
    }),
  })
    .then(r => r.json())
    ?.then(data => data?.data?.Projects)

  return res
}

export const fetchProjectClient = async ({
  teamID,
  projectSlug,
}: {
  teamID: string
  projectSlug?: string
}): Promise<Project> => {
  const { data } = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      query: PROJECT_QUERY,
      variables: {
        teamID,
        projectSlug,
      },
    }),
  }).then(res => res.json())

  return data?.Projects?.docs?.[0]
}
