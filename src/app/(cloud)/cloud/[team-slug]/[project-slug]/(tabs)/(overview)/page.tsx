import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject.js'
import { Metadata } from 'next'

import { InfraOffline } from './InfraOffline/index.js'
import { InfraOnline } from './InfraOnline/index.js'

export default async ({ params: { 'team-slug': teamSlug, 'project-slug': projectSlug } }) => {
  const { team, project } = await fetchProjectAndRedirect({ teamSlug, projectSlug })

  if (project?.infraStatus === 'done') {
    return <InfraOnline project={project} />
  }

  return <InfraOffline project={project} team={team} />
}

export const metadata: Metadata = {
  title: 'Overview',
}
