import { Metadata } from 'next'

import { fetchProjectAndRedirect } from '@root/app/(cloud)/cloud/_api/fetchProject'
import { ProjectFileStoragePage } from './page_client'

export default async ({ params: { 'team-slug': teamSlug, 'project-slug': projectSlug } }) => {
  const { team, project } = await fetchProjectAndRedirect({ teamSlug, projectSlug })
  return <ProjectFileStoragePage project={project} team={team} />
}

export const metadata: Metadata = {
  title: 'File Storage',
}
