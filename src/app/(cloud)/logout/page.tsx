import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { Logout } from './page_client.js'

export default props => {
  return <Logout {...props} />
}

export const metadata: Metadata = {
  title: 'Logout | Payload Cloud',
  description: 'Logout of Payload Cloud',
  openGraph: mergeOpenGraph({
    title: 'Logout | Payload Cloud',
    url: '/logout',
  }),
}
