import { fetchProject } from '@cloud/_api/fetchProject'
import { fetchTeam } from '@cloud/_api/fetchTeam'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { ProjectDomainsPage } from './page_client'

export default async function ProjectDomainsPageWrapper({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}) {
  const team = await fetchTeam(teamSlug)

  const project = await fetchProject({
    teamID: team.id,
    projectSlug,
  })

  return <ProjectDomainsPage project={project} team={team} />
}

export async function generateMetadata({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}) {
  return {
    title: 'Domains',
    openGraph: mergeOpenGraph({
      title: 'Domains',
      url: `/cloud/${teamSlug}/${projectSlug}/settings/domains`,
    }),
  }
}
