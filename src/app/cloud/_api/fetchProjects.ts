import { PROJECT_QUERY, PROJECTS_QUERY } from '@root/graphql/project'
import type { Project } from '@root/payload-cloud-types'

export interface ProjectsRes {
  docs: Project[]

  totalDocs: number
  totalPages: number
  page: number
  limit: number
}

export const fetchProjects = async (teamID?: string): Promise<ProjectsRes> => {
  const { cookies } = await import('next/headers')
  const token = cookies().get('payload-cloud-token')?.value ?? null

  const res: ProjectsRes = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `JWT ${token}` } : {}),
    },
    body: JSON.stringify({
      query: PROJECTS_QUERY,
      variables: {
        teamID,
        limit: 9,
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
  limit = 9,
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
