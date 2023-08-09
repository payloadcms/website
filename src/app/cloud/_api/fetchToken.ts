import type { Endpoints } from '@octokit/types'
import { cookies } from 'next/headers'

import { payloadCloudToken } from './token'

type GitHubResponse = Endpoints['GET /user']['response']

export const fetchToken = async (): Promise<string | null> => {
  const token = cookies().get(payloadCloudToken)?.value ?? null

  const reposReq = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/github`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify({
      route: `GET /user`,
    }),
  })

  const res: GitHubResponse = await reposReq.json()

  if (reposReq.ok) {
    return res.data.login
  }

  return null
}
