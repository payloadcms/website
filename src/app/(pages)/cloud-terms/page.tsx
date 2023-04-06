import React from 'react'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { TermsClientPage } from './client_page'

export const metadata: Metadata = {
  title: 'Terms of Service | Payload Cloud',
  description: 'Payload Cloud Terms of Service',
  openGraph: mergeOpenGraph({
    url: '/cloud/terms',
  }),
}

export default () => {
  return <TermsClientPage />
}
