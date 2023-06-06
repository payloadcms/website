import React from 'react'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { TermsClientPage } from './client_page'

export const metadata: Metadata = {
  title: 'Terms of Service | Payload Cloud',
  description: 'Payload Cloud Terms of Service',
  openGraph: mergeOpenGraph({
    title: 'Terms of Service | Payload Cloud',
    url: '/cloud/terms',
  }),
}

export default props => {
  return <TermsClientPage {...props} />
}
