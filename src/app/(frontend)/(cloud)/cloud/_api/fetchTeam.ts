import type { Team } from '@root/payload-cloud-types'

import { TEAM_QUERY, TEAMS_QUERY } from '@data/team'
import { notFound } from 'next/navigation'

import { payloadCloudToken } from './token'

export type TeamWithCustomer = {
  hasPublishedProjects: boolean
  stripeCustomer: Customer | null | undefined
} & Team

// TODO: type this using Stripe module
export interface Customer {
  deleted: boolean
  invoice_settings?: {
    default_payment_method:
      | {
          id?: string
        }
      | string
  }
}

export const fetchTeams = async (teamIDs: string[]): Promise<Team[]> => {
  const { cookies } = await import('next/headers')
  const token = (await cookies()).get(payloadCloudToken)?.value ?? null
  if (!token) {
    throw new Error('No token provided')
  }

  const res: Team[] = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
    body: JSON.stringify({
      query: TEAMS_QUERY,
      variables: {
        limit: 50,
        page: 1,
        teamIDs: teamIDs.filter(Boolean),
      },
    }),
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `JWT ${token}` } : {}),
    },
    method: 'POST',
    next: { tags: ['teams'] },
  })
    ?.then((r) => r.json())
    ?.then((data) => {
      if (data.errors) {
        throw new Error(data?.errors?.[0]?.message ?? 'Error fetching doc')
      }
      return data?.data?.Teams?.docs
    })

  return res
}

export const fetchTeam = async (teamSlug?: string): Promise<Team> => {
  const { cookies } = await import('next/headers')
  const token = (await cookies()).get(payloadCloudToken)?.value ?? null
  if (!token) {
    throw new Error('No token provided')
  }

  try {
    const doc: Team = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql`, {
      body: JSON.stringify({
        query: TEAM_QUERY,
        variables: {
          slug: teamSlug,
        },
      }),
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `JWT ${token}` } : {}),
      },
      method: 'POST',
    })
      ?.then((res) => res.json())
      ?.then((res) => {
        if (res.errors) {
          throw new Error(res?.errors?.[0]?.message ?? 'Error fetching doc')
        }
        return res?.data?.Teams?.docs?.[0]
      })

    return doc
  } catch (error) {
    console.error(error)
    notFound()
  }
}

export const fetchTeamClient = async (slug: string): Promise<Team> => {
  const { data } = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/graphql?teams=${slug}`,
    {
      body: JSON.stringify({
        query: TEAM_QUERY,
        variables: {
          slug: slug.toLowerCase(),
        },
      }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
  ).then((res) => {
    return res.json()
  })

  return data?.Teams?.docs[0]
}

export const fetchTeamWithCustomer = async (slug?: string): Promise<TeamWithCustomer> => {
  const { cookies } = await import('next/headers')
  const token = (await cookies()).get(payloadCloudToken)?.value ?? null
  if (!token) {
    throw new Error('No token provided')
  }

  if (!slug) {
    throw new Error('No slug provided')
  }

  try {
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${slug}/with-customer`,
      {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `JWT ${token}` } : {}),
        },
        method: 'GET',
        next: { tags: [`team_${slug}`] },
      },
    )
      ?.then((res) => {
        if (!res.ok) {
          throw new Error(`Error getting team with customer: ${res.statusText}`)
        }
        return res.json()
      })
      ?.then((res) => {
        if (res.errors) {
          throw new Error(res?.errors?.[0]?.message ?? 'Error fetching docs')
        }
        return res
      })

    return data
  } catch (error) {
    console.error(error)
    notFound()
  }
}
