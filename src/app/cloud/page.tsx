import { Metadata } from 'next'

import { CloudHomePage } from './client_page'

export default props => {
  return <CloudHomePage {...props} />
}

export const metadata: Metadata = {
  title: 'Home | Payload Cloud',
}
