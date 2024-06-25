import { fetchMe } from '@cloud/_api/fetchMe.js'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { SettingsPage } from './page_client.js'

export default async () => {
  const { user } = await fetchMe()
  return <SettingsPage user={user} />
}

export const metadata: Metadata = {
  title: 'My Account',
  openGraph: mergeOpenGraph({
    title: 'My Account',
    url: `/cloud/settings`,
  }),
}
