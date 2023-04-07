import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { TeamPage } from './client_page'

export default props => {
  return <TeamPage {...props} />
}

export async function generateMetadata({ params: { 'team-slug': teamSlug } }): Promise<Metadata> {
  return {
    title: `${teamSlug} - Team Projects`,
    openGraph: mergeOpenGraph({
      url: `/cloud/${teamSlug}`,
    }),
  }
}
