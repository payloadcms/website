import type { Project } from '@root/payload-cloud-types'

import { PROJECT_QUERY, PROJECTS_QUERY } from '@data/project'
import { mergeProjectEnvironment } from '@root/utilities/merge-project-environment'

import { payloadCloudToken } from './token'

export interface ProjectsRes {
  docs: Project[]

  limit: number
  page: number
  totalDocs: number
  totalPages: number
}

export const fetchProjects = async (teamIDs: string[]): Promise<ProjectsRes> => {
  const { cookies } = await import('next/headers')
  const token = (await cookies()).get(payloadCloudToken)?.value ?? null
  if (!token) {
    throw new Error('No token provided')
  }

  const res: ProjectsRes = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
    body: JSON.stringify({
      query: PROJECTS_QUERY,
      variables: {
        limit: 8,
        page: 1,
        teamIDs: teamIDs.filter(Boolean),
      },
    }),
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `JWT ${token}` } : {}),
    },
    method: 'POST',
    next: { tags: ['projects'] },
  })
    ?.then((r) => r.json())
    ?.then((data) => {
      if (data.errors) {
        throw new Error(data?.errors?.[0]?.message ?? 'Error fetching doc')
      }
      return data?.data?.Projects
    })

  return res
}

export const fetchProjectsClient = async ({
  limit = 8,
  page = 1,
  search,
  teamIDs,
}: {
  limit?: number
  page: number
  search?: string
  teamIDs: Array<string | undefined>
}): Promise<ProjectsRes> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
    body: JSON.stringify({
      query: PROJECTS_QUERY,
      variables: {
        limit,
        page,
        search,
        teamIDs: teamIDs.filter(Boolean),
      },
    }),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
    .then((r) => r.json())
    ?.then((data) => data?.data?.Projects)

  return res
}

export const fetchProjectClient = async ({
  environmentSlug,
  projectSlug,
  teamID,
}: {
  environmentSlug?: string
  projectSlug?: string
  teamID: string
}): Promise<Project> => {
  const { data } = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
    body: JSON.stringify({
      query: PROJECT_QUERY,
      variables: {
        projectSlug,
        teamID,
      },
    }),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  }).then((res) => res.json())

  const project = data?.Projects?.docs?.[0]

  if (!project) {
    throw new Error('Project not found')
  }

  if (environmentSlug) {
    return mergeProjectEnvironment({ environmentSlug, project })
  }

  return project
}
