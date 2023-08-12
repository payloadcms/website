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

  const token = await fetchGitHubToken()

  if (token) {
    // TODO: redirect back to the `?redirect=` param
    // search params are not available on the server though
    redirect(`/new?success=${encodeURIComponent('You are already authorized with GitHub')}`)
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
