import type { Metadata } from 'next'

import { HoverHighlightsPage } from './client_page'

export default (props) => {
  return <HoverHighlightsPage {...props} />
}

export const metadata: Metadata = {
  title: 'Hover Highlights',
}
