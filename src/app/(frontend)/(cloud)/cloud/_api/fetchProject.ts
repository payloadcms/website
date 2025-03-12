import type { Project } from '@root/payload-cloud-types'

import { PROJECT_QUERY } from '@data/project'
import { mergeProjectEnvironment } from '@root/utilities/merge-project-environment'
import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'

import type { Subscription } from './fetchSubscriptions'
import type { Customer, TeamWithCustomer } from './fetchTeam'

import { payloadCloudToken } from './token'

export type ProjectWithSubscription = {
  stripeSubscription: Subscription
} & Project

export const fetchProject = async (args: {
  projectSlug?: string
  teamID?: string
}): Promise<Project> => {
  const { projectSlug, teamID } = args || {}
  const token = (await cookies()).get(payloadCloudToken)?.value ?? null
  if (!token) {
    throw new Error('No token provided')
  }

  const doc: Project = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
    body: JSON.stringify({
      query: PROJECT_QUERY,
      variables: {
        projectSlug,
        teamID,
      },
    }),
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `JWT ${token}` } : {}),
    },
    method: 'POST',
    next: { tags: [`project_${projectSlug}`] },
  })
    ?.then((res) => res.json())
    ?.then((res) => {
      if (res.errors) {
        throw new Error(res?.errors?.[0]?.message ?? 'Error fetching doc')
      }
      return res?.data?.Projects?.docs?.[0]
    })

  return doc
}

export const fetchProjectAndRedirect = async (args: {
  environmentSlug?: string
  projectSlug?: string
  teamSlug?: string
}): Promise<{
  project: ProjectWithSubscription
  team: TeamWithCustomer
}> => {
  const { environmentSlug, projectSlug, teamSlug } = args || {}
  try {
    const project = await fetchProjectWithSubscription({ environmentSlug, projectSlug, teamSlug })

    if (!project) {
      notFound()
    }

    if (project?.status === 'draft') {
      redirect(`/cloud/${teamSlug}/${projectSlug}/configure`)
    }

    return {
      project,
      team: project?.team,
    }
  } catch (error) {
    console.error(error)
    notFound()
  }
}

type ProjectWithSubscriptionWithTeamAndCustomer = {
  customer: Customer
  team: TeamWithCustomer
} & ProjectWithSubscription

export const fetchProjectWithSubscription = async (args: {
  environmentSlug?: string
  projectSlug?: string
  teamSlug?: string
}): Promise<
  {
    customer: Customer
    team: TeamWithCustomer
  } & ProjectWithSubscription
> => {
  const { environmentSlug, projectSlug, teamSlug } = args || {}
  const token = (await cookies()).get(payloadCloudToken)?.value ?? null
  if (!token) {
    throw new Error('No token provided')
  }

  const projectWithSubscription = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${projectSlug}/with-subscription`,
    {
      body: JSON.stringify({
        projectSlug,
        teamSlug,
      }),
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `JWT ${token}` } : {}),
      },
      method: 'POST',
    },
  )
    ?.then((res) => res.json())
    ?.then((res) => {
      if (res.errors) {
        throw new Error(res?.errors?.[0]?.message ?? 'Error fetching doc')
      }
      if (res.error) {
        throw new Error(res.error ?? 'Error fetching doc')
      }
      return res
    })

  if (environmentSlug) {
    return mergeProjectEnvironment({
      environmentSlug,
      project: projectWithSubscription,
    }) as ProjectWithSubscriptionWithTeamAndCustomer
  }

  return projectWithSubscription
}
