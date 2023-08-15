import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { PROJECT_QUERY } from '@root/app/_graphql/project'
import type { Project } from '@root/payload-cloud-types'
import type { Subscription } from './fetchSubscriptions'
import type { Customer, TeamWithCustomer } from './fetchTeam'
import { payloadCloudToken } from './token'

export const fetchProject = async (args: {
  teamID?: string
  projectSlug?: string
}): Promise<Project> => {
  const { teamID, projectSlug } = args || {}
  const token = cookies().get(payloadCloudToken)?.value ?? null
  if (!token) throw new Error('No token provided')

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
  team: TeamWithCustomer
  project: Project
}> => {
  const { teamSlug, projectSlug } = args || {}
  const project = await fetchProjectWithSubscription({ teamSlug, projectSlug })

  if (!project) {
    redirect('/404')
  }

  if (project?.status === 'draft') {
    redirect(`/cloud/${teamSlug}/${projectSlug}/configure`)
  }

  return {
    team: project?.team,
    project,
  }
}

export const fetchProjectWithSubscription = async (args: {
  teamSlug?: string
  projectSlug?: string
}): Promise<
  Project & {
    team: TeamWithCustomer
    customer: Customer
    subscription: Subscription
  }
> => {
  const { teamSlug, projectSlug } = args || {}
  const token = cookies().get(payloadCloudToken)?.value ?? null
  if (!token) throw new Error('No token provided')

  const projectWithSubscription = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectSlug}/with-subscription`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `JWT ${token}` } : {}),
      },
      body: JSON.stringify({
        teamSlug,
        projectSlug,
      }),
    },
  )
    ?.then(res => res.json())
    ?.then(res => {
      if (res.errors) throw new Error(res?.errors?.[0]?.message ?? 'Error fetching doc')
      return res
    })

  return projectWithSubscription
}
