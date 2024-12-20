import type { Metadata } from 'next'

import { fetchMe } from '@cloud/_api/fetchMe.js'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { redirect } from 'next/navigation'

import { ResetPassword } from './page_client.js'

export default async props => {
  const { user } = await fetchMe()

  if (user) {
    redirect(`/cloud?error=${encodeURIComponent('You must be logged out to reset your password')}`)
  }

  return <ResetPassword {...props} />
}

export const metadata: Metadata = {
  description: 'Reset your Payload Cloud password',
  openGraph: mergeOpenGraph({
    title: 'Reset Password | Payload Cloud',
    url: '/reset-password',
  }),
  title: 'Reset Password | Payload Cloud',
}
