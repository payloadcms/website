import { Metadata } from 'next'

import { FormBlockPage } from './client_page.js'

export default props => {
  return <FormBlockPage {...props} />
}

export const metadata: Metadata = {
  title: 'Forms',
}
