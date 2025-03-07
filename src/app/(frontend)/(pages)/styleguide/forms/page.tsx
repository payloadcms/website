import type { Metadata } from 'next'

import { FormsExample } from './client_page'

export default (props) => {
  return <FormsExample {...props} />
}

export const metadata: Metadata = {
  title: 'Forms',
}
