import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { AuthorizePage } from './client_page'

export default props => {
  return <AuthorizePage {...props} />
}

export const metadata: Metadata = {
  title: 'Authorize | Payload Cloud',
  openGraph: mergeOpenGraph({
    url: '/new/authorize',
  }),
}
