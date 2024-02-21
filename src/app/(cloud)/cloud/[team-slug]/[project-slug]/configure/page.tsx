import React from 'react'
import { fetchGitHubToken } from '@cloud/_api/fetchGitHubToken'
import { fetchInstalls } from '@cloud/_api/fetchInstalls'
import { fetchMe } from '@cloud/_api/fetchMe'
import { fetchPaymentMethods } from '@cloud/_api/fetchPaymentMethods'
import { fetchPlans } from '@cloud/_api/fetchPlans'
import { fetchProjectWithSubscription } from '@cloud/_api/fetchProject'
import { fetchTemplates } from '@cloud/_api/fetchTemplates'
import { Metadata } from 'next'
import { Params } from 'next/dist/shared/lib/router/utils/route-matcher'
import { redirect } from 'next/navigation'

import Checkout from '@root/app/(cloud)/new/(checkout)/Checkout'

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
