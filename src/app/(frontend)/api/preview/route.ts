import { payloadToken } from '@data/token'
import { cookies, draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(
  req: {
    cookies: {
      get: (name: string) => {
        value: string
      }
    }
  } & Request,
): Promise<Response> {
  const cookieStore = await cookies()
  const token = cookieStore.get(payloadToken)
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')
  const secret = searchParams.get('secret')

  if (!url) {
    return new Response('No URL provided', { status: 404 })
  }

  if (!token) {
    new Response('No token. You are not allowed to preview this page', { status: 403 })
  }

  // validate the Payload token
  const userReq = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users/me`, {
    headers: {
      Authorization: `JWT ${token?.value}`,
    },
  })

  const userRes = await userReq.json()
  const parsedDraftMode = await draftMode()

  if (!userReq.ok || !userRes?.user) {
    parsedDraftMode.disable()
    return new Response('Invalid token. You are not allowed to preview this page', { status: 403 })
  }

  if (secret !== process.env.NEXT_PRIVATE_DRAFT_SECRET) {
    return new Response('Invalid secret.', { status: 401 })
  }

  parsedDraftMode.enable()

  redirect(url)
}
