import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'

// force this component to use dynamic search params, see https://github.com/vercel/next.js/issues/43077
// this is only an issue in production
export const dynamic = 'force-dynamic'

export default async ({ searchParams }) => {
  const { token, redirect: redirectParam, email: emailParam } = searchParams

  if (token) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation {
            verifyEmailUser(token: "${token}")
        }`,
        }),
      })

      if (res.ok) {
        const { data, errors } = await res.json()
        if (errors) throw new Error(errors[0].message)
      } else {
        throw new Error('Invalid login')
      }
    } catch (e) {
      throw new Error(`Error verifying email: ${e.message}`)
    }

    redirect(
      `/login?success=${encodeURIComponent('Your email has been verified. You may now log in.')}${
        redirectParam ? `&redirect=${redirectParam}` : ''
      }${emailParam ? `&email=${emailParam}` : ''}`,
    )
  }

  redirect(
    `/login?error=${encodeURIComponent('Invalid verification token. Please try again.')}${
      redirectParam ? `&redirect=${redirectParam}` : ''
    }${emailParam ? `&email=${emailParam}` : ''}`,
  )
}

export const metadata: Metadata = {
  title: 'Verify Email | Payload Cloud',
  openGraph: mergeOpenGraph({
    title: 'Verify Email | Payload Cloud',
    url: '/verify',
  }),
}
