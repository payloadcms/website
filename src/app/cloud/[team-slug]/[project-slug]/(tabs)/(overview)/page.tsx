import { Metadata } from 'next'

import { ProjectOverviewPage } from './client_page'

export default props => {
  return <ProjectOverviewPage {...props} />
}

export const metadata: Metadata = {
  title: 'Overview',
}
