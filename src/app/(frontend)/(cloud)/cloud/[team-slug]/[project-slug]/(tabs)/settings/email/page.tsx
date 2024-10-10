import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject.js'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import React from 'react'

import { ProjectEmailPage } from './page_client.js'

export default async ({
  params: {
    'environment-slug': environmentSlug,
    'project-slug': projectSlug,
    'team-slug': teamSlug,
  },
}) => {
  console.log('here?')
  const { project, team } = await fetchProjectAndRedirect({
    environmentSlug,
    projectSlug,
    teamSlug,
  })
  return <ProjectEmailPage environmentSlug={environmentSlug} project={project} team={team} />
}

export async function generateMetadata({
  params: { 'project-slug': projectSlug, 'team-slug': teamSlug },
}) {
  return {
    openGraph: mergeOpenGraph({
      url: `/cloud/${teamSlug}/${projectSlug}/settings/email`,
    }),
    title: 'Email',
  }
}
