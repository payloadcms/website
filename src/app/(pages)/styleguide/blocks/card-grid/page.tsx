import { Metadata } from 'next'

import { CardGridPage } from './client_page'

export default () => {
  return <CardGridPage />
}

export const metadata: Metadata = {
  title: 'Card Grid',
}
