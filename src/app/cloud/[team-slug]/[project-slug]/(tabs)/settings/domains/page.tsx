import { Metadata } from 'next'

import { ProjectDomainsPage } from './client_page'

export default props => {
  return <ProjectDomainsPage {...props} />
}

export const metadata: Metadata = {
  title: 'Domains',
}
