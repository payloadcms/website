import { Metadata } from 'next'

import { TeamSettingsPage } from './client_page'

export default props => {
  return <TeamSettingsPage {...props} />
}

export async function generateMetadata({ params: { 'team-slug': slug } }): Promise<Metadata> {
  return {
    title: `${slug} - Team Settings`,
  }
}
