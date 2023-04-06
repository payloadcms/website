import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { JoinTeam } from './client_page'

export default () => {
  return <JoinTeam />
}

export const metadata: Metadata = {
  title: 'Join Team | Payload CMS',
  description: 'Join a Payload team',
  openGraph: mergeOpenGraph({
    url: '/join-team',
  }),
}
