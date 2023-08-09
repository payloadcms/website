import { fetchMe } from '@cloud/_api/fetchMe'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { Signup } from './page_client'

export default async () => {
  const { user } = await fetchMe()

  if (user) {
    redirect(`/cloud?warning=${encodeURIComponent('You must be logged out to sign up')}`)
  }

  return <Signup />
}

export const metadata: Metadata = {
  title: 'Signup | Payload Cloud',
  description: 'Signup for Payload Cloud',
  openGraph: mergeOpenGraph({
    title: 'Signup | Payload Cloud',
    url: '/signup',
  }),
}
