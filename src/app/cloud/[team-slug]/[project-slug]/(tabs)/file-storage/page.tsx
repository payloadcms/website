import { fetchProject } from '@cloud/_api/fetchProject'
import { fetchTeam } from '@cloud/_api/fetchTeam'
import { Metadata } from 'next'

import { ProjectFileStoragePage } from './page_client'

export default async function ProjectFileStoragePageWrapper({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}) {
  const team = await fetchTeam(teamSlug)

  const project = await fetchProject({
    teamID: team.id,
    projectSlug,
  })

  return <ProjectFileStoragePage project={project} team={team} />
}

export const metadata: Metadata = {
  title: 'File Storage',
}
