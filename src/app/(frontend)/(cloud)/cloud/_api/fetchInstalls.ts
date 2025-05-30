import type { Endpoints } from '@octokit/types'

import { payloadCloudToken } from './token'

export type GitHubInstallationsResponse = Endpoints['GET /user/installations']['response']

export type Install = GitHubInstallationsResponse['data']['installations'][0]

export const fetchInstalls = async (): Promise<Install[]> => {
  const { cookies } = await import('next/headers')
  const token = (await cookies()).get(payloadCloudToken)?.value ?? null
  if (!token) {
    throw new Error('No token provided')
  }

  const docs: Install[] = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/github`, {
    body: JSON.stringify({
      route: `GET /user/installations`,
    }),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `JWT ${token}` } : {}),
    },
    method: 'POST',
    next: {
      tags: ['installs'],
    },
  })
    ?.then((res) => {
      if (!res.ok) {
        throw new Error(`Error getting installations: ${res.status}`)
      }
      return res.json()
    })
    ?.then((res) => {
      if (res.errors) {
        throw new Error(res?.errors?.[0]?.message ?? 'Error fetching docs')
      }
      return res?.data?.installations
    })

  return docs
}

export const fetchInstallsClient: () => Promise<Install[]> = async () => {
  const docs: Install[] = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/github`, {
    body: JSON.stringify({
      route: `GET /user/installations`,
    }),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })
    ?.then((res) => {
      if (!res.ok) {
        throw new Error(`Error getting installations: ${res.status}`)
      }
      return res.json()
    })
    ?.then((res) => {
      if (res.errors) {
        throw new Error(res?.errors?.[0]?.message ?? 'Error fetching docs')
      }
      return res?.data?.installations
    })

  return docs
}
