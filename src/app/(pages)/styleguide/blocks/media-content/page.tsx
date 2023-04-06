import { Metadata } from 'next'

import { MediaContentPage } from './client_page'

export default () => {
  return <MediaContentPage />
}

export const metadata: Metadata = {
  title: 'Media Content',
}
