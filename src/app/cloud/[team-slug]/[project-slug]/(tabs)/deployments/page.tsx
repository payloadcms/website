import { Metadata } from 'next'

import { ProjectDeploymentsPage } from './client_page'

export default props => {
  return <ProjectDeploymentsPage {...props} />
}

export const metadata: Metadata = {
  title: 'Deployments',
}
