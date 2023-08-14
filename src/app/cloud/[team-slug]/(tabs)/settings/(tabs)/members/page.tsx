import { fetchTeamWithCustomer } from '@cloud/_api/fetchTeam'
import { Metadata } from 'next'

import { TeamMembersPage } from './page_client'

export default async function TeamMembersWrapper({ params: { 'team-slug': teamSlug } }) {
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
