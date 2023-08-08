import { fetchPlans } from '@cloud/_api/fetchPlans'
import { fetchTeam } from '@cloud/_api/fetchTeam'
import { Metadata } from 'next'

import { TeamSubscriptionsPage } from './page_client'

export default async function TeamSubscriptionsWrapper({ params: { 'team-slug': teamSlug } }) {
  const team = await fetchTeam(teamSlug)
  const plans = await fetchPlans()
  return <TeamSubscriptionsPage team={team} plans={plans} />
}

export async function generateMetadata({ params: { 'team-slug': teamSlug } }): Promise<Metadata> {
  return {
    title: `${teamSlug} - Team Subscriptions`,
    openGraph: {
      title: `${teamSlug} - Team Subscriptions`,
      url: `/cloud/${teamSlug}/subscriptions`,
    },
  }
}
