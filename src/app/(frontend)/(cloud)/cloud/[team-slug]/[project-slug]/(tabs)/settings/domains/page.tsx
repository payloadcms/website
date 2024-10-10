import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject.js'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { generateRoutePath } from '@root/utilities/generate-route-path.js'
import React from 'react'

import { ProjectDomainsPage } from './page_client.js'

export default async ({
  params: {
    'environment-slug': environmentSlug,
    'project-slug': projectSlug,
    'team-slug': teamSlug,
  },
}) => {
  const { project, team } = await fetchProjectAndRedirect({
    environmentSlug,
    projectSlug,
    teamSlug,
  })
  return <ProjectDomainsPage environmentSlug={environmentSlug} project={project} team={team} />
}

export async function generateMetadata({
  params: {
    'environment-slug': environmentSlug,
    'project-slug': projectSlug,
    'team-slug': teamSlug,
  },
}) {
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
