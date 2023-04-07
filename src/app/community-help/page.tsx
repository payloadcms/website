import React from 'react'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { CommunityHelpPage } from './client_page'

const Page = async props => {
  return <CommunityHelpPage {...props} />
}

export default Page

export const metadata: Metadata = {
  title: {
    absolute: 'Community Help | Payload CMS',
    template: '%s | Community Help | Payload CMS',
  },
  description:
    'Find what you need faster. The Payload Community Help archive is a great place to start.',
  openGraph: mergeOpenGraph({
    url: '/community-help',
  }),
}
