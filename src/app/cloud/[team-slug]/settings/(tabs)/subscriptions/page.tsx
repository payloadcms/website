import { Metadata } from 'next'

import { TeamSubscriptionsPage } from './client_page'

export default props => {
  return <TeamSubscriptionsPage {...props} />
}

export async function generateMetadata({ params: { 'team-slug': teamSlug } }): Promise<Metadata> {
  return {
    title: `${teamSlug} - Team Subscriptions`,
    openGraph: {
      url: `/cloud/${teamSlug}/subscriptions`,
    },
  }
}
