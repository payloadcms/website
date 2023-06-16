import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { ThanksForSubscribingPage } from './client_page'

export default props => {
  return <ThanksForSubscribingPage {...props} />
}

export const metadata: Metadata = {
  title: 'Thanks for Subscribing | Payload CMS',
  openGraph: mergeOpenGraph({
    title: 'Thanks for Subscribing | Payload CMS',
    url: '/thanks-for-subscribing',
  }),
}
