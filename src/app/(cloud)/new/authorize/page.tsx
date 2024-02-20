import { fetchGitHubToken } from '@cloud/_api/fetchGitHubToken'
import { fetchMe } from '@cloud/_api/fetchMe'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { AuthorizePage } from './page_client'

export default async ({ searchParams: { redirect: redirectParam } }) => {
  const { user } = await fetchMe()

  if (!user) {
    redirect(
      `/login?redirect=${encodeURIComponent(
        `/new/authorize?redirect=${redirectParam}`,
      )}&error=${encodeURIComponent('You must be logged in to authorize with GitHub')}`,
    )
  }

  const githubToken = await fetchGitHubToken()

  if (githubToken) {
    redirect(redirectParam || '/new')
  }

  return <AuthorizePage />
}

export const metadata: Metadata = {
  title: 'Authorize | Payload Cloud',
  openGraph: mergeOpenGraph({
    title: 'Authorize | Payload Cloud',
    url: '/new/authorize',
  }),
}
