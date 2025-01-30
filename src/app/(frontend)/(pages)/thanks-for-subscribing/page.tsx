import type { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'

import { ThanksForSubscribingPage } from './client_page.js'

export default (props) => {
  return <ThanksForSubscribingPage {...props} />
}

export const metadata: Metadata = {
  openGraph: mergeOpenGraph({
    title: 'Thanks for Subscribing | Payload',
    url: '/thanks-for-subscribing',
  }),
  title: 'Thanks for Subscribing | Payload',
}
