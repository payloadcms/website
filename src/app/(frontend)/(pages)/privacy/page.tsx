import type { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import React from 'react'

import { PrivacyClientPage } from './page_client'

export default (props) => {
  return <PrivacyClientPage {...props} />
}

export const metadata: Metadata = {
  description: 'Payload Privacy Policy',
  openGraph: mergeOpenGraph({
    title: 'Privacy Policy | Payload',
    url: '/Privacy/index',
  }),
  title: 'Privacy Policy | Payload',
}
