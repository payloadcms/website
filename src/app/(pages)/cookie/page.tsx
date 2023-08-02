import React from 'react'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { CookieClientPage } from './client_page'

export default props => {
  return <CookieClientPage {...props} />
}

export const metadata: Metadata = {
  title: 'Cookie Policy | Payload CMS',
  description: 'Payload CMS Cookie Policy',
  openGraph: mergeOpenGraph({
    title: 'Cookie Policy | Payload CMS',
    url: '/cookie',
  }),
}
