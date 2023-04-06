import { Metadata } from 'next'

import { ThanksForSubscribingPage } from './client_page'

export default () => {
  return <ThanksForSubscribingPage />
}

export const metadata: Metadata = {
  title: 'Thanks for Subscribing!',
  openGraph: {
    url: '/thanks-for-subscribing',
  },
}
