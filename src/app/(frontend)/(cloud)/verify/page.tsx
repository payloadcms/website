import type { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { getSafeRedirect } from '@root/utilities/getSafeRedirect'
import { redirect } from 'next/navigation'

// force this component to use dynamic search params, see https://github.com/vercel/next.js/issues/43077
// this is only an issue in production
export const dynamic = 'force-dynamic'

export default async ({ searchParams }) => {
  const { email: emailParam, redirect: redirectParam, token } = searchParams

  const buildLoginRedirectURL = ({
    type,
    message,
    redirectParam,
  }: {
    message: string
    redirectParam?: string
    type: 'error' | 'success'
  }): string => {
    const base = '/login'
    const query = new URLSearchParams()

    query.set(type, message)

    const safeRedirect = getSafeRedirect(redirectParam || '', '')

    if (safeRedirect) {
      query.set('redirect', safeRedirect)
    }

    if (emailParam) {
      query.set('email', emailParam)
    }

    return `${base}?${query.toString()}`
  }

  if (token) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
        body: JSON.stringify({
          query: `mutation {
            verifyEmailUser(token: "${token}")
        }`,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (res.ok) {
        const { errors } = await res.json()
        if (errors) {
          throw new Error(errors[0].message)
        }
      } else {
        throw new Error('Invalid login')
      }

      redirect(
        buildLoginRedirectURL({
          type: 'success',
          message: 'Your email has been verified. You may now log in.',
          redirectParam,
        }),
      )
    } catch (e) {
      redirect(
        buildLoginRedirectURL({
          type: 'error',
          message: `Error verifying email: ${e.message}`,
          redirectParam,
        }),
      )
    }
  }

  redirect(
    buildLoginRedirectURL({
      type: 'error',
      message: 'Invalid verification token. Please try again.',
      redirectParam,
    }),
  )
}

export const metadata: Metadata = {
  openGraph: mergeOpenGraph({
    title: 'Verify Email | Payload Cloud',
    url: '/verify',
  }),
  title: 'Verify Email | Payload Cloud',
}
