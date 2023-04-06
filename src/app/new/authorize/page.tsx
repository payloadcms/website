import { Metadata } from 'next'

import { AuthorizePage } from './client_page'

export default () => {
  return <AuthorizePage />
}

export const metadata: Metadata = {
  title: 'Authorize | Payload Cloud',
  openGraph: {
    url: '/new/authorize',
  },
}
