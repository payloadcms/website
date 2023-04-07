import { Metadata } from 'next'

import { ProjectFileStoragePage } from './client_page'

export default props => {
  return <ProjectFileStoragePage {...props} />
}

export const metadata: Metadata = {
  title: 'File Storage',
}
