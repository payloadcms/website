import { Metadata } from 'next'

import { ForgotPassword } from './client_page'

export default () => {
  return <ForgotPassword />
}

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'If you forgot your password, reset it',
  openGraph: {
    url: '/forgot-password',
  },
}
