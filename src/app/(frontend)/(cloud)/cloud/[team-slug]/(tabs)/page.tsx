import type { Metadata } from 'next'

import { fetchProjects } from '@cloud/_api/fetchProjects'
import { fetchTeamWithCustomer } from '@cloud/_api/fetchTeam'
import { fetchTemplates } from '@cloud/_api/fetchTemplates'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'

import { TeamPage } from './page_client'

export default async ({
  params,
}: {
  params: Promise<{
    'team-slug': string
  }>
}) => {
  const { 'team-slug': teamSlug } = await params
  const team = await fetchTeamWithCustomer(teamSlug)
  const projectsRes = await fetchProjects([team?.id])

  const templates = await fetchTemplates()

  return <TeamPage initialState={projectsRes} team={team} templates={templates} />
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    'team-slug': string
  }>
}): Promise<Metadata> {
  const { 'team-slug': teamSlug } = await params
  return {
    openGraph: mergeOpenGraph({
      title: `${teamSlug} - Team Projects`,
      url: `/cloud/${teamSlug}`,
    }),
    title: `${teamSlug} - Team Projects`,
  }
}
