import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { SettingsPage } from './client_page'

export default props => {
  return <SettingsPage {...props} />
}

export const metadata: Metadata = {
  title: 'My Account',
  openGraph: mergeOpenGraph({
    url: `/cloud/settings`,
  }),
}
