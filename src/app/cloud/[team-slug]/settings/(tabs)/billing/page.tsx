import { Metadata } from 'next'

import { TeamBillingPage } from './client_page'
export default props => {
  return <TeamBillingPage {...props} />
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
