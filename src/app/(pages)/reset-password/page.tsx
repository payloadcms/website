import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { ResetPassword } from './client_page'

export default props => {
  return <ResetPassword {...props} />
}

export const metadata: Metadata = {
  title: 'Reset Password | Payload Cloud',
  description: 'Reset your Payload Cloud password',
  openGraph: mergeOpenGraph({
    title: 'Reset Password | Payload Cloud',
    url: '/reset-password',
  }),
}
