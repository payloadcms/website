import { Metadata } from 'next'

import { ContentGridPage } from './client_page.js'

export default props => {
  return <ContentGridPage {...props} />
}

export const metadata: Metadata = {
  title: 'Content Grid',
}
