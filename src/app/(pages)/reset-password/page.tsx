import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { ResetPassword } from './client_page'

export default () => {
  return <ResetPassword />
}

export const metadata: Metadata = {
  title: 'Reset Password | Payload CMS',
  description: 'Reset your Payload Cloud password',
  openGraph: mergeOpenGraph({
    url: '/reset-password',
  }),
}
