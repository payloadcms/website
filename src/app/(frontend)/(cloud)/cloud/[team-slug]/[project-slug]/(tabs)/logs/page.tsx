import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject.js'
import { Metadata } from 'next'

import { ProjectLogsPage } from './page_client.js'

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
    'environment-slug': environmentSlug,
  } = await params
  const { team, project } = await fetchProjectAndRedirect({
    teamSlug,
    projectSlug,
    environmentSlug,
  })
  return <ProjectLogsPage project={project} team={team} environmentSlug={environmentSlug} />
}

export const metadata: Metadata = {
  title: 'Logs',
}
