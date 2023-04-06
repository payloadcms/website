import { Metadata } from 'next'

import { MyTeamsPage } from './client_page'

export default props => {
  return <MyTeamsPage {...props} />
}

export const metadata: Metadata = {
  title: 'Teams',
}
