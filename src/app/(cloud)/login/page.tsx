import { fetchMe } from '@cloud/_api/fetchMe'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { Login } from './page_client'

export default async () => {
  const { user } = await fetchMe()

  if (user) {
    redirect(`/cloud?warning=${encodeURIComponent('You are already logged in')}`)
  }

  return <Login />
}

export const metadata: Metadata = {
  title: 'Login | Payload Cloud',
  description: 'Login to Payload Cloud',
  openGraph: mergeOpenGraph({
    title: 'Login | Payload Cloud',
    url: '/login',
  }),
}
