import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject.js'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import React from 'react'

import { ProjectOwnershipPage } from './page_client.js'

export default async ({
  params: {
    'environment-slug': environmentSlug,
    'project-slug': projectSlug,
    'team-slug': teamSlug,
  },
}) => {
  const { team } = await fetchProjectAndRedirect({
    environmentSlug,
    projectSlug,
    teamSlug,
  })
  return <ProjectOwnershipPage team={team} />
}

export async function generateMetadata({
  params: { 'project-slug': projectSlug, 'team-slug': teamSlug },
}) {
  return {
    openGraph: mergeOpenGraph({
      title: 'Ownership',
      url: `/cloud/${teamSlug}/${projectSlug}/settings/ownership`,
    }),
    title: 'Ownership',
  }
}
