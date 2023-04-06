import { Metadata } from 'next'

import { ProjectBillingPage } from './client_page'

export default props => {
  return <ProjectBillingPage {...props} />
}

export const metadata: Metadata = {
  title: 'Billing',
}
