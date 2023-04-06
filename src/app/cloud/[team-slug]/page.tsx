import { Metadata } from 'next'

import { TeamPage } from './client_page'

export default props => {
  return <TeamPage {...props} />
}

export async function generateMetadata({ params: { 'team-slug': slug } }): Promise<Metadata> {
  return {
    title: `${slug} - Team Projects`,
  }
}
