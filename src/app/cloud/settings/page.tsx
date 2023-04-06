import { Metadata } from 'next'

import { SettingsPage } from './client_page'

export default props => {
  return <SettingsPage {...props} />
}

export const metadata: Metadata = {
  title: 'My Account',
}
