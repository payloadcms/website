import { Metadata } from 'next'

import { ProjectDatabasePage } from './client_page'

export default props => {
  return <ProjectDatabasePage {...props} />
}

export const metadata: Metadata = {
  title: 'Database',
}
