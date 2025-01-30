import type { Endpoints } from '@octokit/types'

type GitHubResponse = Endpoints['GET /user']['response']

export const checkGitHubToken = async (): Promise<boolean> => {
  try {
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
      return true
    } else {
      const message = `Unable to authorize GitHub: ${res.status}`
      console.error(message) // eslint-disable-line no-console
    }
  } catch (err: unknown) {
    const message = `Unable to authorize GitHub: ${err}`
    console.error(message) // eslint-disable-line no-console
  }

  return false
}
