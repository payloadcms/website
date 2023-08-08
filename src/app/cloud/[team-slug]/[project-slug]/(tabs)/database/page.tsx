import { fetchProject } from '@cloud/_api/fetchProject'
import { fetchTeam } from '@cloud/_api/fetchTeam'
import { Metadata } from 'next'

import { ProjectDatabasePage } from './page_client'

export default async function ProjectDatabasePageWrapper({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}) {
  const team = await fetchTeam(teamSlug)

  const project = await fetchProject({
    teamID: team.id,
    projectSlug,
  })

  return <ProjectDatabasePage project={project} team={team} />
}

export const metadata: Metadata = {
  title: 'Database',
}
