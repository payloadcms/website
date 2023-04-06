import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { Login } from './client_page'

export default props => {
  return <Login {...props} />
}

export const metadata: Metadata = {
  title: 'Login | Payload Cloud',
  description: 'Login to Payload Cloud',
  openGraph: mergeOpenGraph({
    url: '/login',
  }),
}
