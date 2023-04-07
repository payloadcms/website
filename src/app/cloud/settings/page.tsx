import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { SettingsPage } from './client_page'

export default props => {
  return <SettingsPage {...props} />
}

export async function generateMetadata({ params: { 'team-slug': teamSlug } }): Promise<Metadata> {
  return {
    title: `${teamSlug} - My Account`,
    openGraph: mergeOpenGraph({
      url: `/cloud/settings`,
    }),
  }
}
