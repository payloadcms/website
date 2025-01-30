import type { Metadata } from 'next'

import { fetchGitHubToken } from '@cloud/_api/fetchGitHubToken.js'
import { fetchInstalls } from '@cloud/_api/fetchInstalls.js'
import { fetchMe } from '@cloud/_api/fetchMe.js'
import { fetchPaymentMethods } from '@cloud/_api/fetchPaymentMethods.js'
import { fetchPlans } from '@cloud/_api/fetchPlans.js'
import { fetchProjectWithSubscription } from '@cloud/_api/fetchProject.js'
import { fetchTemplates } from '@cloud/_api/fetchTemplates.js'
import Checkout from '@root/app/(frontend)/(cloud)/new/(checkout)/Checkout.js'
import { redirect } from 'next/navigation'
import React from 'react'

export const dynamic = 'force-dynamic'

export default async ({
  params,
}: {
  params: Promise<{
    'project-slug': string
    'team-slug': string
  }>
}) => {
  const { 'project-slug': projectSlug, 'team-slug': teamSlug } = await params
  const { user } = await fetchMe()
  const project = await fetchProjectWithSubscription({ projectSlug, teamSlug })

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
      initialPaymentMethods={paymentMethods}
      installs={installs}
      plans={plans}
      project={project}
      team={project.team}
      templates={templates}
      token={token}
      user={user}
    />
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    'project-slug': string
    'team-slug': string
  }>
}): Promise<Metadata> {
  const { 'project-slug': projectSlug, 'team-slug': teamSlug } = await params
  return {
    openGraph: {
      title: 'Checkout | Payload Cloud',
      url: `/cloud/${teamSlug}/${projectSlug}/configure`,
    },
    title: 'Checkout | Payload Cloud',
  }
}
