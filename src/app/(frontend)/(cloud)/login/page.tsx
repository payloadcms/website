import type { Metadata } from 'next'

import { fetchMe } from '@cloud/_api/fetchMe.js'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { redirect } from 'next/navigation'

import { Login } from './page_client.js'

export default async () => {
  const { user } = await fetchMe()

  if (user) {
    redirect(`/cloud?warning=${encodeURIComponent('You are already logged in')}`)
  }

  return <Login />
}

export const metadata: Metadata = {
  description: 'Login to Payload Cloud',
  openGraph: mergeOpenGraph({
    title: 'Login | Payload Cloud',
    url: '/login',
  }),
  title: 'Login | Payload Cloud',
}
