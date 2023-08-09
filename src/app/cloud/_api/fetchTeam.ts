import { TEAM_QUERY } from '@root/graphql/team'
import type { Team } from '@root/payload-cloud-types'
import { payloadCloudToken } from './token'

export const fetchTeam = async (teamSlug?: string): Promise<Team> => {
  const { cookies } = await import('next/headers')

  const token = cookies().get(payloadCloudToken)?.value ?? null

  const doc: Team = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `JWT ${token}` } : {}),
    },
    body: JSON.stringify({
      query: TEAM_QUERY,
      variables: {
        slug: teamSlug,
      },
    }),
  })
    ?.then(res => res.json())
    ?.then(res => {
      if (res.errors) throw new Error(res?.errors?.[0]?.message ?? 'Error fetching doc')
      return res?.data?.Teams?.docs?.[0]
    })

  return doc
}

export const fetchTeamClient = async (slug: string): Promise<Team> => {
  const { data } = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql?teams=${slug}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        query: TEAM_QUERY,
        variables: {
          slug: slug.toLowerCase(),
        },
      }),
    },
  ).then(res => {
    return res.json()
  })

  return data?.Teams?.docs[0]
}
