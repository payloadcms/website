import { Metadata } from 'next'

import { TeamBillingPage } from './client_page'

export default props => {
  return <TeamBillingPage {...props} />
}

export async function generateMetadata({ params: { 'team-slug': slug } }): Promise<Metadata> {
  return {
    title: `${slug} - Team Billing`,
  }
}
