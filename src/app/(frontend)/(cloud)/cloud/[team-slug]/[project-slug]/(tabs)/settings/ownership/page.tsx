import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject.js'
import { PRODUCTION_ENVIRONMENT_SLUG } from '@root/constants.js'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import React from 'react'

import { ProjectOwnershipPage } from './page_client.js'

export default async ({
  params,
}: {
  params: Promise<{
    'environment-slug': string
    'project-slug': string
    'team-slug': string
  }>
}) => {
  const {
    'environment-slug': environmentSlug = PRODUCTION_ENVIRONMENT_SLUG,
    'project-slug': projectSlug,
    'team-slug': teamSlug,
  } = await params
  const { team } = await fetchProjectAndRedirect({ environmentSlug, projectSlug, teamSlug })
  return <ProjectOwnershipPage environmentSlug={environmentSlug} team={team} />
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    'project-slug': string
    'team-slug': string
  }>
}) {
  const { 'project-slug': projectSlug, 'team-slug': teamSlug } = await params
  return {
    openGraph: mergeOpenGraph({
      title: 'Ownership',
      url: `/cloud/${teamSlug}/${projectSlug}/settings/ownership`,
    }),
    title: 'Ownership',
  }
}
