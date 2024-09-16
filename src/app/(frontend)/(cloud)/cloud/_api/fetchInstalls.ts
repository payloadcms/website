import type { Endpoints } from '@octokit/types'

import { payloadCloudToken } from './token.js'

export type GitHubInstallationsResponse = Endpoints['GET /user/installations']['response']

export type Install = GitHubInstallationsResponse['data']['installations'][0]

export const fetchInstalls = async (): Promise<Install[]> => {
  const { cookies } = await import('next/headers')
  const token = cookies().get(payloadCloudToken)?.value ?? null
  if (!token) throw new Error('No token provided')

  const docs: Install[] = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/github`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `JWT ${token}` } : {}),
    },
    next: {
      tags: ['installs'],
    },
    body: JSON.stringify({
      route: `GET /user/installations`,
    }),
  })
    ?.then(res => {
      if (!res.ok) throw new Error(`Error getting installations: ${res.status}`)
      return res.json()
    })
    ?.then(res => {
      if (res.errors) throw new Error(res?.errors?.[0]?.message ?? 'Error fetching docs')
      return res?.data?.installations
    })

  return docs
}

export const fetchInstallsClient: () => Promise<Install[]> = async () => {
  const docs: Install[] = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/github`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      route: `GET /user/installations`,
    }),
  })
    ?.then(res => {
      if (!res.ok) throw new Error(`Error getting installations: ${res.status}`)
      return res.json()
    })
    ?.then(res => {
      if (res.errors) throw new Error(res?.errors?.[0]?.message ?? 'Error fetching docs')
      return res?.data?.installations
    })

  return docs
}
