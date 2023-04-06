import { Metadata } from 'next'

import { ResetPassword } from './client_page'

export default () => {
  return <ResetPassword />
}

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset your Payload Cloud password',
  openGraph: {
    url: '/reset-password',
  },
}
