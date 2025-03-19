import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject'
import { PRODUCTION_ENVIRONMENT_SLUG } from '@root/constants'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { generateRoutePath } from '@root/utilities/generate-route-path'
import React from 'react'

import { ProjectDomainsPage } from './page_client'

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
  const { project, team } = await fetchProjectAndRedirect({
    environmentSlug,
    projectSlug,
    teamSlug,
  })
  return <ProjectDomainsPage environmentSlug={environmentSlug} project={project} team={team} />
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    'environment-slug': string
    'project-slug': string
    'team-slug': string
  }>
}) {
  const {
    'environment-slug': environmentSlug = PRODUCTION_ENVIRONMENT_SLUG,
    'project-slug': projectSlug,
    'team-slug': teamSlug,
  } = await params
  return {
    openGraph: mergeOpenGraph({
      title: 'Domains',
      url: generateRoutePath({
        environmentSlug,
        projectSlug,
        suffix: 'settings/domains',
        teamSlug,
      }),
    }),
    title: 'Domains',
  }
}
