import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject.js'
import { Metadata } from 'next'

import { ProjectFileStoragePage } from './page_client.js'

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
  return <ProjectFileStoragePage project={project} team={team} environmentSlug={environmentSlug} />
}

export const metadata: Metadata = {
  title: 'File Storage',
}
