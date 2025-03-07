import type { Metadata } from 'next'

import { MediaContentPage } from './client_page'

export default (props) => {
  return <MediaContentPage {...props} />
}

export const metadata: Metadata = {
  title: 'Media Content',
}
