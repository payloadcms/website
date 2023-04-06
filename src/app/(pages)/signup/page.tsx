import { Metadata } from 'next'

import { Signup } from './client_page'

export default () => {
  return <Signup />
}

export const metadata: Metadata = {
  title: 'Cloud Signup',
  description: 'Signup for Payload Cloud',
  openGraph: {
    url: '/signup',
  },
}
