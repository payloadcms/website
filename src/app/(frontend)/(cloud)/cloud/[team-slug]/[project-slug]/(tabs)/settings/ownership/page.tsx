import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject.js'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import React from 'react'

import { ProjectOwnershipPage } from './page_client.js'

export default async ({
  params,
}: {
  params: Promise<{
    'project-slug': string
    'team-slug': string
  }>
}) => {
  const { 'project-slug': projectSlug, 'team-slug': teamSlug } = await params
  const { project, team } = await fetchProjectAndRedirect({ projectSlug, teamSlug })
  return <ProjectOwnershipPage project={project} team={team} />
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
