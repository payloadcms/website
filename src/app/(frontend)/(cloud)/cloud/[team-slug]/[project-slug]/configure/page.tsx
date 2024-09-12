import React from 'react'
import { fetchGitHubToken } from '@cloud/_api/fetchGitHubToken.js'
import { fetchInstalls } from '@cloud/_api/fetchInstalls.js'
import { fetchMe } from '@cloud/_api/fetchMe.js'
import { fetchPaymentMethods } from '@cloud/_api/fetchPaymentMethods.js'
import { fetchPlans } from '@cloud/_api/fetchPlans.js'
import { fetchProjectWithSubscription } from '@cloud/_api/fetchProject.js'
import { fetchTemplates } from '@cloud/_api/fetchTemplates.js'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import Checkout from '@root/app/(frontend)/(cloud)/new/(checkout)/Checkout.js'

export const dynamic = 'force-dynamic'

export default async ({ params: { 'team-slug': teamSlug, 'project-slug': projectSlug } }) => {
  const { user } = await fetchMe()
  const project = await fetchProjectWithSubscription({ teamSlug, projectSlug })

  if (project.status === 'published') {
    redirect(`/cloud/${teamSlug}/${projectSlug}`)
  }

  const token = await fetchGitHubToken()

  if (!token) {
    redirect(
      `/new/authorize?redirect=${encodeURIComponent(
        `/cloud/${teamSlug}/${projectSlug}/configure`,
      )}`,
    )
  }

  const plans = await fetchPlans()
  const installs = await fetchInstalls()
  const templates = await fetchTemplates()
  const paymentMethods = await fetchPaymentMethods({
    team: project.team,
  })

  return (
    <Checkout
      team={project.team}
      project={project}
      token={token}
      plans={plans}
      installs={installs}
      templates={templates}
      user={user}
      initialPaymentMethods={paymentMethods}
    />
  )
}

export async function generateMetadata({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}: {
  params: {
    'team-slug': string
    'project-slug': string
  }
}): Promise<Metadata> {
  return {
    title: 'Checkout | Payload Cloud',
    openGraph: {
      title: 'Checkout | Payload Cloud',
      url: `/cloud/${teamSlug}/${projectSlug}/configure`,
    },
  }
}
