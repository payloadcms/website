import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { Signup } from './client_page'

export default props => {
  return <Signup {...props} />
}

export const metadata: Metadata = {
  title: 'Signup | Payload Cloud',
  description: 'Signup for Payload Cloud',
  openGraph: mergeOpenGraph({
    url: '/signup',
  }),
}
