import type { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import React from 'react'

import { CookieClientPage } from './client_page'

export default (props) => {
  return <CookieClientPage {...props} />
}

export const metadata: Metadata = {
  description: 'Payload Cookie Policy',
  openGraph: mergeOpenGraph({
    title: 'Cookie Policy | Payload',
    url: '/cookie',
  }),
  title: 'Cookie Policy | Payload',
}
