import React from 'react'
import { Metadata } from 'next'

import { TermsClientPage } from './client_page'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Payload Cloud Terms of Service',
  openGraph: {
    url: '/cloud/terms',
  },
}

export default () => {
  return <TermsClientPage />
}
