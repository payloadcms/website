import { fetchGitHubToken } from '@cloud/_api/fetchGitHubToken'
import { fetchMe } from '@cloud/_api/fetchMe'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { AuthorizePage } from './page_client'

export default async function NewProjectAuthorizePage() {
  const { user } = await fetchMe()

  if (!user) {
    redirect(
      `/login?redirect=${encodeURIComponent(`/new/authorize`)}?error=${encodeURIComponent(
        'You must be logged in to authorize with GitHub',
      )}`,
    )
  }

  // NOTE: cannot redirect here because we need to know the `redirect` param
  // instead, pass the token to the client and redirect there
  const githubToken = await fetchGitHubToken()

  return <AuthorizePage githubToken={githubToken} />
}

export const metadata: Metadata = {
  title: 'Authorize | Payload Cloud',
  openGraph: mergeOpenGraph({
    title: 'Authorize | Payload Cloud',
    url: '/new/authorize',
  }),
}
