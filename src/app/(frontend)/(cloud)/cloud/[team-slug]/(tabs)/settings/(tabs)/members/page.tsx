import { fetchTeamWithCustomer } from '@cloud/_api/fetchTeam.js'
import { Metadata } from 'next'

import { TeamMembersPage } from './page_client.js'

export default async ({ params: { 'team-slug': teamSlug } }) => {
  const team = await fetchTeamWithCustomer(teamSlug)
  return <TeamMembersPage team={team} />
}

export async function generateMetadata({ params: { 'team-slug': teamSlug } }): Promise<Metadata> {
  return {
    title: `${teamSlug} - Team Members`,
    openGraph: {
      title: `${teamSlug} - Team Members`,
      url: `/cloud/${teamSlug}/settings/members`,
    },
  }
}
