import type { Endpoints } from '@octokit/types'

import type { Install } from './fetchInstalls.js'
import { payloadCloudToken } from './token.js'

type GitHubResponse =
  Endpoints['GET /user/installations/{installation_id}/repositories']['response']

export type RepoResults = {} & GitHubResponse['data']

export type Repo = GitHubResponse['data']['repositories'][0]

export const fetchRepos = async (args: {
  install: Install
  per_page?: number
  page?: number
}): Promise<RepoResults> => {
  const { install, per_page, page } = args
  const installID = install && typeof install === 'object' ? install.id : install
  const { cookies } = await import('next/headers')
  const token = cookies().get(payloadCloudToken)?.value ?? null
  if (!token) throw new Error('No token provided')

  const docs: RepoResults = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/github`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `JWT ${token}` } : {}),
      },
      next: {
        tags: ['repos'],
      },
      body: JSON.stringify({
        route: `GET /user/installations/${installID}/repositories?${new URLSearchParams({
          per_page: per_page?.toString() ?? '30',
          page: page?.toString() ?? '1',
        })}`,
      }),
    },
  )
    ?.then(res => {
      if (!res.ok) throw new Error(`Error getting repositories: ${res.status} ${res.statusText}`)
      return res.json()
    })
    ?.then(res => {
      if (res.errors) throw new Error(res?.errors?.[0]?.message ?? 'Error fetching docs')
      return res?.data
    })

  return docs
}

export const fetchReposClient = async ({
  install,
  per_page,
  page,
}: {
  install: Install
  per_page?: number
  page?: number
}): Promise<RepoResults> => {
  const installID = install && typeof install === 'object' ? install.id : install

  const docs = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/github`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      route: `GET /user/installations/${installID}/repositories?${new URLSearchParams({
        per_page: per_page?.toString() ?? '30',
        page: page?.toString() ?? '1',
      })}`,
    }),
  })
    ?.then(res => {
      if (!res.ok) throw new Error(`Error getting repositories: ${res.status}`)
      return res.json()
    })
    ?.then(res => {
      if (res.errors) throw new Error(res?.errors?.[0]?.message ?? 'Error fetching docs')
      return res?.data
    })

  return docs
}
