import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject.js'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import React from 'react'

import { ProjectEmailPage } from './page_client.js'

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
    'environment-slug': environmentSlug,
    'project-slug': projectSlug,
    'team-slug': teamSlug,
  } = await params
  const { project, team } = await fetchProjectAndRedirect({
    environmentSlug,
    projectSlug,
    teamSlug,
  })
  return <ProjectEmailPage environmentSlug={environmentSlug} project={project} team={team} />
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
      url: `/cloud/${teamSlug}/${projectSlug}/settings/email`,
    }),
    title: 'Email',
  }
}
