import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { ThanksForSubscribingPage } from './client_page'

export default () => {
  return <ThanksForSubscribingPage />
}

export const metadata: Metadata = {
  title: 'Thanks for Subscribing | Payload CMS',
  openGraph: mergeOpenGraph({
    url: '/thanks-for-subscribing',
  }),
}
