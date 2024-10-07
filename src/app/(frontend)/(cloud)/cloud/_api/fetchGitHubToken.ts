import type { Endpoints } from '@octokit/types'

type GitHubResponse = Endpoints['GET /user']['response']

export const fetchGitHubToken = async (): Promise<null | string> => {
  const { cookies } = await import('next/headers')
  const token = (await cookies()).get('payload-cloud-token')?.value ?? null

  if (!token) {
    return null
  }

  const reposReq = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/github`, {
    body: JSON.stringify({
      route: `GET /user`,
    }),
    cache: 'no-store',
    headers: {
      Authorization: `JWT ${token}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  const res: GitHubResponse = await reposReq.json()

  if (reposReq.ok) {
    return res.data.login
  }

  return null
}

export const fetchGithubTokenClient = async (): Promise<null | string> => {
  const reposReq = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/github`, {
    body: JSON.stringify({
      route: `GET /user`,
    }),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  const res: GitHubResponse = await reposReq.json()

  if (reposReq.ok) {
    return res.data.login
  }

  return null
}
