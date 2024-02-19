import { Metadata } from 'next'

import { fetchProjectAndRedirect } from '@root/app/(cloud)/cloud/_api/fetchProject'
import { InfraOffline } from './InfraOffline'
import { InfraOnline } from './InfraOnline'

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
