import type { Metadata } from 'next'

import { FormBlockPage } from './client_page'

export default (props) => {
  return <FormBlockPage {...props} />
}

export const metadata: Metadata = {
  title: 'Forms',
}
