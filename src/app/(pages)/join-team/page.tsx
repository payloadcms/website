import { Metadata } from 'next'

import { JoinTeam } from './client_page'

export default () => {
  return <JoinTeam />
}

export const metadata: Metadata = {
  title: 'Join Team',
  description: 'Join a Payload team',
  openGraph: {
    url: '/join-team',
  },
}
