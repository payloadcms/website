import React from 'react'
import { fetchGitHubToken } from '@cloud/_api/fetchGitHubToken'
import { fetchInstalls } from '@cloud/_api/fetchInstalls'
import { fetchPlans } from '@cloud/_api/fetchPlans'
import { fetchProject, fetchProjectAndRedirect } from '@cloud/_api/fetchProject'
import { fetchTeam } from '@cloud/_api/fetchTeam'
import { fetchTemplates } from '@cloud/_api/fetchTemplates'
import { Metadata } from 'next'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'
import { redirect } from 'next/navigation'

import Checkout from '@root/app/new/(checkout)/Checkout'

export default async function CheckoutPageWrapper({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}) {
  const team = await fetchTeam(teamSlug)
  const project = await fetchProject({ teamID: team.id, projectSlug })

  if (project.status === 'published') {
    redirect(`/cloud/${team.slug}/${project.slug}`)
  }

  const token = await fetchGitHubToken()

  if (!token) {
    redirect(
      `/new/authorize?redirect=${encodeURIComponent(
        `/cloud/${team.slug}/${project.slug}/configure`,
      )}`,
    )
  }

  const plans = await fetchPlans()
  const installs = await fetchInstalls()
  const templates = await fetchTemplates()

  return (
    <Checkout
      team={team}
      project={project}
      token={token}
      plans={plans}
      installs={installs}
      templates={templates}
    />
  )
}

export async function generateMetadata({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}: {
  params: Params
}): Promise<Metadata> {
  return {
    title: 'Checkout | Payload Cloud',
    openGraph: {
      title: 'Checkout | Payload Cloud',
      url: `/cloud/${teamSlug}/${projectSlug}/configure`,
    },
  }
}
