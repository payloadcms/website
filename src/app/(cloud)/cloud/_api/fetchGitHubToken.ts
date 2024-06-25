import type { Endpoints } from '@octokit/types'

type GitHubResponse = Endpoints['GET /user']['response']

export const fetchGitHubToken = async (): Promise<string | null> => {
  const { cookies } = await import('next/headers')
  const token = cookies().get('payload-cloud-token')?.value ?? null

  if (!token) {
    return null
  }

  const reposReq = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/github`, {
    method: 'POST',
    cache: 'no-store',
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

export const fetchGithubTokenClient = async (): Promise<string | null> => {
  const reposReq = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/github`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
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
