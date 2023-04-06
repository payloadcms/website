import { Metadata } from 'next'

import { ContentGridPage } from './client_page'

export default () => {
  return <ContentGridPage />
}

export const metadata: Metadata = {
  title: 'Content Grid',
}
