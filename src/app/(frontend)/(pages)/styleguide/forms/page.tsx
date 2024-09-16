import { Metadata } from 'next'

import { FormsExample } from './client_page.js'

export default props => {
  return <FormsExample {...props} />
}

export const metadata: Metadata = {
  title: 'Forms',
}
