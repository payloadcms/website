import { Metadata } from 'next'

import { Logout } from './client_page'

export default () => {
  return <Logout />
}

export const metadata: Metadata = {
  title: 'Cloud Logout | Payload CMS',
  description: 'Logout of Payload Cloud',
  openGraph: {
    url: '/logout',
  },
}
