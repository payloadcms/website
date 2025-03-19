import type { Metadata } from 'next'

import { CallToActionPage } from './client_page'

export default (props) => {
  return <CallToActionPage {...props} />
}

export const metadata: Metadata = {
  title: 'Call to Action',
}
