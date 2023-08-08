import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject'
import { Metadata } from 'next'

import { InfraOffline } from './InfraOffline'
import { InfraOnline } from './InfraOnline'

export default async function ProjectPageWrapper({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}) {
  const { team, project } = await fetchProjectAndRedirect({ teamSlug, projectSlug })

  if (project?.infraStatus === 'done') {
    return <InfraOnline project={project} />
  }

  return <InfraOffline project={project} team={team} />
}

export const metadata: Metadata = {
  title: 'Overview',
}
