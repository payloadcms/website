import type { Metadata } from 'next'

import { fetchMe } from '@cloud/_api/fetchMe.js'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { redirect } from 'next/navigation'

import { ForgotPassword } from './page_client.js'

export default async (props) => {
  const { user } = await fetchMe()

  if (user) {
    redirect(`/cloud?error=${encodeURIComponent('You must be logged out to reset your password')}`)
  }

  return <ForgotPassword {...props} />
}

export const metadata: Metadata = {
  description: 'If you forgot your password, reset it',
  openGraph: mergeOpenGraph({
    title: 'Forgot Password | Payload Cloud',
    url: '/forgot-password',
  }),
  title: 'Forgot Password | Payload Cloud',
}
