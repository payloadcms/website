import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject.js'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { ProjectBuildSettingsPage } from './page_client.js'
import { generateRoutePath } from '@root/utilities/generate-route-path.js'
import { PRODUCTION_ENVIRONMENT_SLUG } from '@root/constants.js'

export default async ({
  params,
}: {
  params: Promise<{
    'team-slug': string
    'project-slug': string
    'environment-slug': string
  }>
}) => {
  const {
    'team-slug': teamSlug,
    'project-slug': projectSlug,
    'environment-slug': environmentSlug = PRODUCTION_ENVIRONMENT_SLUG,
  } = await params
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
  params,
}: {
  params: Promise<{
    'team-slug': string
    'project-slug': string
    'environment-slug': string
  }>
}): Promise<Metadata> {
  const {
    'team-slug': teamSlug,
    'project-slug': projectSlug,
    'environment-slug': environmentSlug = PRODUCTION_ENVIRONMENT_SLUG,
  } = await params
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
