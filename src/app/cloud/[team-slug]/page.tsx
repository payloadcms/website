import { fetchProjects } from '@cloud/_api/fetchProjects'
import { fetchTeam } from '@cloud/_api/fetchTeam'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { TeamPage } from './page_client'

export default async function TeamPageWrapper({ params: { 'team-slug': teamSlug } }) {
  const team = await fetchTeam(teamSlug)
  const projectsRes = await fetchProjects(team?.id)

  return <TeamPage team={team} initialState={projectsRes} />
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
