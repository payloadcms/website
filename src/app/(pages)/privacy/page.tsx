import React from 'react'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { PrivacyClientPage } from './page_client'

export default props => {
  return <PrivacyClientPage {...props} />
}

export const metadata: Metadata = {
  title: 'Privacy Policy | Payload',
  description: 'Payload Privacy Policy',
  openGraph: mergeOpenGraph({
    title: 'Privacy Policy | Payload',
    url: '/privacy',
  }),
}
