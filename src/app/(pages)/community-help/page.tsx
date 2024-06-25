import React from 'react'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { CommunityHelpPage } from './client_page.js'

const Page = async props => {
  return <CommunityHelpPage {...props} />
}

export default Page

export const metadata: Metadata = {
  title: {
    absolute: 'Community Help | Payload',
    template: '%s | Community Help | Payload',
  },
  description:
    'Find what you need faster. The Payload Community Help archive is a great place to start.',
  openGraph: mergeOpenGraph({
    title: 'Community Help | Payload',
    description:
      'Find what you need faster. The Payload Community Help archive is a great place to start.',
    url: '/community-help',
  }),
}
