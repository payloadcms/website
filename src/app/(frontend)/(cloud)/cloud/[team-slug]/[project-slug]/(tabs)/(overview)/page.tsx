import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject.js'
import { Metadata } from 'next'

import { InfraOffline } from './InfraOffline/index.js'
import { InfraOnline } from './InfraOnline/index.js'

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

  if (project?.infraStatus === 'done') {
    return <InfraOnline project={project} environmentSlug={environmentSlug} />
  }

  return <InfraOffline project={project} team={team} environmentSlug={environmentSlug} />
}

export const metadata: Metadata = {
  title: 'Overview',
}
