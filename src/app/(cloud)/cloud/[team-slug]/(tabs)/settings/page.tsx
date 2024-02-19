import { Metadata } from 'next'

import { fetchTeamWithCustomer } from '@root/app/(cloud)/cloud/_api/fetchTeam'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { TeamSettingsPage } from './page_client'

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
