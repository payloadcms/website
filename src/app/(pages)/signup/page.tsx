import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { Signup } from './client_page'

export default () => {
  return <Signup />
}

export const metadata: Metadata = {
  title: 'Cloud Signup | Payload CMS',
  description: 'Signup for Payload Cloud',
  openGraph: mergeOpenGraph({
    url: '/signup',
  }),
}
