import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject.js'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { ProjectBuildSettingsPage } from './page_client.js'
import { generateRoutePath } from '@root/utilities/generate-route-path.js'

export default async ({
  params: {
    'team-slug': teamSlug,
    'project-slug': projectSlug,
    'environment-slug': environmentSlug,
  },
}) => {
  const { team, project } = await fetchProjectAndRedirect({
    teamSlug,
    projectSlug,
    environmentSlug,
  })
  return (
    <ProjectBuildSettingsPage project={project} team={team} environmentSlug={environmentSlug} />
  )
}

export async function generateMetadata({
  params: {
    'team-slug': teamSlug,
    'project-slug': projectSlug,
    'environment-slug': environmentSlug,
  },
}): Promise<Metadata> {
  return {
    title: 'Build Settings',
    openGraph: mergeOpenGraph({
      title: 'Build Settings',
      url: generateRoutePath({
        teamSlug,
        projectSlug,
        environmentSlug,
        suffix: 'settings/build-settings',
      }),
    }),
  }
}
