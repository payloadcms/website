import { Metadata } from 'next'

import { TeamMembersPage } from './client_page'

export default props => {
  return <TeamMembersPage {...props} />
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
