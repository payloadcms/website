import { Metadata } from 'next'

import { ProjectLogsPage } from './client_page'

export default props => {
  return <ProjectLogsPage {...props} />
}

export const metadata: Metadata = {
  title: 'Logs',
}
