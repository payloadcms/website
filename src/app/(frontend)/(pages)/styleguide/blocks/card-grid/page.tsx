import { Metadata } from 'next'

import { CardGridPage } from './client_page.js'

export default props => {
  return <CardGridPage {...props} />
}

export const metadata: Metadata = {
  title: 'Card Grid',
}
