import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { TeamSettingsPage } from './client_page'
export default props => {
  return <TeamSettingsPage {...props} />
}

export async function generateMetadata({ params: { 'team-slug': teamSlug } }): Promise<Metadata> {
  return {
    title: `${teamSlug} - Team Settings`,
    openGraph: mergeOpenGraph({
      url: `/cloud/${teamSlug}/settings`,
    }),
  }
}
