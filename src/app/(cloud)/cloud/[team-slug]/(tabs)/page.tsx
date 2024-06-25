import { fetchProjects } from '@cloud/_api/fetchProjects.js'
import { fetchTeamWithCustomer } from '@cloud/_api/fetchTeam.js'
import { fetchTemplates } from '@cloud/_api/fetchTemplates.js'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { TeamPage } from './page_client.js'

export default async ({ params: { 'team-slug': teamSlug } }) => {
  const team = await fetchTeamWithCustomer(teamSlug)
  const projectsRes = await fetchProjects([team?.id])

  const templates = await fetchTemplates()

  return <TeamPage team={team} initialState={projectsRes} templates={templates} />
}

export async function generateMetadata({ params: { 'team-slug': teamSlug } }): Promise<Metadata> {
  return {
    title: `${teamSlug} - Team Projects`,
    openGraph: mergeOpenGraph({
      title: `${teamSlug} - Team Projects`,
      url: `/cloud/${teamSlug}`,
    }),
  }
}
