import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { JoinTeam } from './page_client'

// TODO: server render the `JoinTeam` page
// see the `verify` page for an example
export default props => {
  return <JoinTeam {...props} />
}

export const metadata: Metadata = {
  title: 'Join Team | Payload Cloud',
  description: 'Join a Payload team',
  openGraph: mergeOpenGraph({
    title: 'Join Team | Payload Cloud',
    url: '/join-team',
  }),
}
