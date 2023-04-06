import { Metadata } from 'next'

import { ProjectOwnershipPage } from './client_page'

export default props => {
  return <ProjectOwnershipPage {...props} />
}

export const metadata: Metadata = {
  title: 'Ownership',
}
