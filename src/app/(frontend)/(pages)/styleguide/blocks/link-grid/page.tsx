import type { Metadata } from 'next'

import { LinkGridPage } from './client_page'

export default (props) => {
  return <LinkGridPage {...props} />
}

export const metadata: Metadata = {
  title: 'Link Grid',
}
