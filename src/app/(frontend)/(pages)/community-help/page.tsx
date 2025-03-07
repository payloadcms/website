import type { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import React from 'react'

import { CommunityHelpPage } from './client_page'

const Page = async (props) => {
  return <CommunityHelpPage {...props} />
}

export default Page

export const metadata: Metadata = {
  description:
    'Find what you need faster. The Payload Community Help archive is a great place to start.',
  openGraph: mergeOpenGraph({
    description:
      'Find what you need faster. The Payload Community Help archive is a great place to start.',
    title: 'Community Help | Payload',
    url: '/community-help',
  }),
  title: {
    absolute: 'Community Help | Payload',
    template: '%s | Community Help | Payload',
  },
}
