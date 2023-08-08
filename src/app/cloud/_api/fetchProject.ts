import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { PROJECT_QUERY } from '@root/graphql/project'
import type { Project, Team } from '@root/payload-cloud-types'
import { fetchTeam } from './fetchTeam'

export const fetchProject = async (args: {
  teamID?: string
  projectSlug?: string
}): Promise<Project> => {
  const { teamID, projectSlug } = args || {}
  const token = cookies().get('payload-cloud-token')?.value ?? null

  const doc: Project = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `JWT ${token}` } : {}),
    },
    body: JSON.stringify({
      query: PROJECT_QUERY,
      variables: {
        teamID,
        projectSlug,
      },
    }),
  })
    ?.then(res => res.json())
    ?.then(res => {
      if (res.errors) throw new Error(res?.errors?.[0]?.message ?? 'Error fetching doc')
      return res?.data?.Projects?.docs?.[0]
    })

  return doc
}

export const fetchProjectAndRedirect = async (args: {
  teamSlug?: string
  projectSlug?: string
}): Promise<{
  team: Team
  project: Project
}> => {
  const { teamSlug, projectSlug } = args || {}
  const team = await fetchTeam(teamSlug)
  const project = await fetchProject({ teamID: team.id, projectSlug })

  if (!project) {
    redirect('/404')
  }

  return {
    team,
    project,
  }
}
