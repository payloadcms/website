import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { ForgotPassword } from './client_page'

export default props => {
  return <ForgotPassword {...props} />
}

export const metadata: Metadata = {
  title: 'Forgot Password | Payload Cloud',
  description: 'If you forgot your password, reset it',
  openGraph: mergeOpenGraph({
    url: '/forgot-password',
  }),
}
