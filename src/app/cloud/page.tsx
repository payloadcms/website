import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { CloudHomePage } from './client_page'

export default props => {
  return <CloudHomePage {...props} />
}

export const metadata: Metadata = {
  title: 'Home | Payload Cloud',
  openGraph: mergeOpenGraph({
    url: '/cloud',
  }),
}
