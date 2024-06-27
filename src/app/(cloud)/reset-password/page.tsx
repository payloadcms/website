import { fetchMe } from '@cloud/_api/fetchMe.js'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { ResetPassword } from './page_client.js'

export default async props => {
  const { user } = await fetchMe()

  if (user) {
    redirect(`/cloud?error=${encodeURIComponent('You must be logged out to reset your password')}`)
  }

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
