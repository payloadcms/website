import { fetchTeamWithCustomer } from '@cloud/_api/fetchTeam.js'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { TeamSettingsPage } from './page_client.js'

export default async ({ params: { 'team-slug': teamSlug } }) => {
  const team = await fetchTeamWithCustomer(teamSlug)
  return <TeamSettingsPage team={team} />
}

export async function generateMetadata({ params: { 'team-slug': teamSlug } }): Promise<Metadata> {
  return {
    title: `${teamSlug} - Team Settings`,
    openGraph: mergeOpenGraph({
      title: `${teamSlug} - Team Settings`,
      url: `/cloud/${teamSlug}/settings`,
    }),
  }
}
