import type { Metadata } from 'next'

import { fetchGitHubToken } from '@cloud/_api/fetchGitHubToken'
import { fetchMe } from '@cloud/_api/fetchMe'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { getSafeRedirect } from '@root/utilities/getSafeRedirect'
import { redirect } from 'next/navigation'

import { AuthorizePage } from './page_client'

export default async ({
  searchParams,
}: {
  searchParams: Promise<{
    redirect: string
  }>
}) => {
  const { redirect: redirectParam } = await searchParams
  const { user } = await fetchMe()

  if (!user) {
    redirect(
      `/login?redirect=${encodeURIComponent(
        `/new/authorize?redirect=${redirectParam}`,
      )}&error=${encodeURIComponent('You must be logged in to authorize with GitHub')}`,
    )
  }

  const githubToken = await fetchGitHubToken()

  const redirectUrl = getSafeRedirect(redirectParam, '/new')

  if (githubToken) {
    redirect(redirectUrl)
  }

  return <AuthorizePage />
}

export const metadata: Metadata = {
  openGraph: mergeOpenGraph({
    title: 'Authorize | Payload Cloud',
    url: '/new/authorize',
  }),
  title: 'Authorize | Payload Cloud',
}
