import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject.js'
import { Metadata } from 'next'

import { ProjectDatabasePage } from './page_client.js'

export default async ({
  params,
}: {
  params: Promise<{
    'team-slug': string
    'project-slug': string
  }>
}) => {
  const { 'team-slug': teamSlug, 'project-slug': projectSlug } = await params
  const { team, project } = await fetchProjectAndRedirect({ teamSlug, projectSlug })

  return <ProjectDatabasePage project={project} team={team} />
}

export const metadata: Metadata = {
  title: 'Database',
}
