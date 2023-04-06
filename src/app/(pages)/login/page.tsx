import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { Login } from './client_page'

export default () => {
  return <Login />
}

export const metadata: Metadata = {
  title: 'Cloud Login | Payload CMS',
  description: 'Login to Payload Cloud',
  openGraph: mergeOpenGraph({
    url: '/login',
  }),
}
