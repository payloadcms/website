import type { Metadata } from 'next'

import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject.js'
import { PRODUCTION_ENVIRONMENT_SLUG } from '@root/constants.js'

import { ProjectLogsPage } from './page_client.js'

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
  return <ProjectLogsPage environmentSlug={environmentSlug} project={project} team={team} />
}

export const metadata: Metadata = {
  title: 'Logs',
}
