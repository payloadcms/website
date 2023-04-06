import { Metadata } from 'next'

import { ProjectBuildSettingsPage } from './client_page'

export default props => {
  return <ProjectBuildSettingsPage {...props} />
}

export const metadata: Metadata = {
  title: 'Build Settings',
}
