import type { Metadata } from 'next'

import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject'
import { PRODUCTION_ENVIRONMENT_SLUG } from '@root/constants'

import { InfraOffline } from './InfraOffline/index'
import { InfraOnline } from './InfraOnline/index'

export default async ({
  params,
}: {
  params: Promise<{
    'environment-slug': string
    'project-slug': string
    'team-slug': string
  }>
}) => {
  const {
    'environment-slug': environmentSlug = PRODUCTION_ENVIRONMENT_SLUG,
    'project-slug': projectSlug,
    'team-slug': teamSlug,
  } = await params
  const { project, team } = await fetchProjectAndRedirect({
    environmentSlug,
    projectSlug,
    teamSlug,
  })

  if (project?.infraStatus === 'done') {
    return <InfraOnline environmentSlug={environmentSlug} project={project} />
  }

  return <InfraOffline environmentSlug={environmentSlug} project={project} team={team} />
}

export const metadata: Metadata = {
  title: 'Overview',
}
