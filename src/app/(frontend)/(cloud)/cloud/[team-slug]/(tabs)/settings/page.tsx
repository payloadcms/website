import { fetchTeamWithCustomer } from '@cloud/_api/fetchTeam.js'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { TeamSettingsPage } from './page_client.js'

export default async ({
  params,
}: {
  params: Promise<{
    'team-slug': string
  }>
}) => {
  const { 'team-slug': teamSlug } = await params
  const team = await fetchTeamWithCustomer(teamSlug)
  return <TeamSettingsPage team={team} />
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
    title: `${teamSlug} - Team Settings`,
    openGraph: mergeOpenGraph({
      title: `${teamSlug} - Team Settings`,
      url: `/cloud/${teamSlug}/settings`,
    }),
  }
}
