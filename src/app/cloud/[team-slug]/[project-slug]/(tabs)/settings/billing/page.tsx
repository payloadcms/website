import { fetchProject } from '@cloud/_api/fetchProject'
import { fetchTeam } from '@cloud/_api/fetchTeam'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { ProjectBillingPage } from './page_client'

export default async function ProjectBillingPageWrapper({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}) {
  const team = await fetchTeam(teamSlug)

  const project = await fetchProject({
    teamID: team.id,
    projectSlug,
  })

  return <ProjectBillingPage project={project} team={team} />
}

export async function generateMetadata({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}): Promise<Metadata> {
  return {
    title: 'Billing',
    openGraph: mergeOpenGraph({
      title: 'Billing',
      url: `/cloud/${teamSlug}/${projectSlug}/settings/billing`,
    }),
  }
}
