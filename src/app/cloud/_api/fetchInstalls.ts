// import type { Endpoints } from '@octokit/types'
import { cookies } from 'next/headers'

import type { Install } from '@components/InstallationSelector/useGetInstalls'
import { payloadCloudToken } from './token'

// type GitHubInstallationsResponse = Endpoints['GET /user/installations']['response']

export const fetchInstalls = async (): Promise<Install[]> => {
  const token = cookies().get(payloadCloudToken)?.value ?? null

  const docs: Install[] = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/github`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `JWT ${token}` } : {}),
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
