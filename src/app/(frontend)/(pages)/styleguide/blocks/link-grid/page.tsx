import { Metadata } from 'next'

import { LinkGridPage } from './client_page.js'

export default props => {
  return <LinkGridPage {...props} />
}

export const metadata: Metadata = {
  title: 'Link Grid',
}
