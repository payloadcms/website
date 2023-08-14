import { fetchTeamWithCustomer } from '@cloud/_api/fetchTeam'
import { Metadata } from 'next'

import { TeamBillingPage } from './page_client'

export default async function TeamBillingWrapper({ params: { 'team-slug': teamSlug } }) {
  const team = await fetchTeamWithCustomer(teamSlug)
  return <TeamBillingPage team={team} />
}

export async function generateMetadata({ params: { 'team-slug': teamSlug } }): Promise<Metadata> {
  return {
    title: `${teamSlug} - Team Billing`,
    openGraph: {
      title: `${teamSlug} - Team Billing`,
      url: `/cloud/${teamSlug}/settings/billing`,
    },
  }
}
