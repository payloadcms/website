import { Metadata } from 'next'

import { fetchMe } from '@root/app/(cloud)/cloud/_api/fetchMe'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { SettingsPage } from './page_client'

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
