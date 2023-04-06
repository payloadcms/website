import { Metadata } from 'next'

import { ProjectFromImportPage } from './client_page'

export default props => {
  return <ProjectFromImportPage {...props} />
}

export const metadata: Metadata = {
  title: 'Import Project | Payload Cloud',
}
