import React from 'react'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { PrivacyClientPage } from './client_page'

export default props => {
  return <PrivacyClientPage {...props} />
}

export const metadata: Metadata = {
  title: 'Privacy Policy | Payload CMS',
  description: 'Payload CMS Privacy Policy',
  openGraph: mergeOpenGraph({
    title: 'Privacy Policy | Payload CMS',
    url: '/privacy',
  }),
}
