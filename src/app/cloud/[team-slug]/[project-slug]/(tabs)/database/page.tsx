import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject'
import { Metadata } from 'next'

import { ProjectDatabasePage } from './page_client'

export default async ({ params: { 'team-slug': teamSlug, 'project-slug': projectSlug } }) => {
  const { team, project } = await fetchProjectAndRedirect({ teamSlug, projectSlug })

  return <ProjectDatabasePage project={project} team={team} />
}

export const metadata: Metadata = {
  title: 'Database',
}
