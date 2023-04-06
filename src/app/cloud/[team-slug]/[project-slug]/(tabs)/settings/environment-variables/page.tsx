import { Metadata } from 'next'

import { ProjectEnvPage } from './client_page'

export default props => {
  return <ProjectEnvPage {...props} />
}

export const metadata: Metadata = {
  title: 'Environment Variables',
}
