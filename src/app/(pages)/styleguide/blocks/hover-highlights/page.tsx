import { Metadata } from 'next'

import { HoverHighlightsPage } from './client_page.js'

export default props => {
  return <HoverHighlightsPage {...props} />
}

export const metadata: Metadata = {
  title: 'Hover Highlights',
}
