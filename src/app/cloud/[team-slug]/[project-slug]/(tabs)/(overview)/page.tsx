import { fetchProject } from '@cloud/_api/fetchProject'
import { fetchTeam } from '@cloud/_api/fetchTeam'
import { Metadata } from 'next'

import { InfraOffline } from './InfraOffline'
import { InfraOnline } from './InfraOnline'

export default async function ProjectPageWrapper({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}) {
  const team = await fetchTeam(teamSlug)

  const project = await fetchProject({
    teamID: team.id,
    projectSlug,
  })

  if (project?.infraStatus === 'done') {
    return <InfraOnline project={project} />
  }

  return <InfraOffline project={project} team={team} />
}

export const metadata: Metadata = {
  title: 'Overview',
}
