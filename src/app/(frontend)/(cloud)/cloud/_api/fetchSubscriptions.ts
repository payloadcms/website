import type { Project, Team } from '@root/payload-cloud-types'

import { payloadCloudToken } from './token'

// TODO: type this using the Stripe module
export interface Subscription {
  default_payment_method: string
  id: string
  items: {
    data: Array<{
      id: string
      price: {
        currency: string
        id: string
        nickname: string
        product: string
        recurring: {
          interval: string
          interval_count: number
        }
        type: string
        unit_amount: number
      }
    }>
  }
  metadata: {
    payload_project_id: string
  }
  plan: {
    amount: number
    id: string
    nickname: string
  }
  // this is an additional property added y the Payload API
  // this is _not_ a property of the Stripe API
  project: Project
  status: string
  trial_end: number
}

export interface SubscriptionsResult {
  data: Subscription[]
  has_more: boolean
}

export const fetchSubscriptions = async (team?: string | Team): Promise<SubscriptionsResult> => {
  const teamID = typeof team === 'string' ? team : team?.id
  if (!teamID) {
    throw new Error('No team ID provided')
  }

  const { cookies } = await import('next/headers')
  const token = (await cookies()).get(payloadCloudToken)?.value ?? null
  if (!token) {
    throw new Error('No token provided')
  }

  const res: SubscriptionsResult = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${teamID}/subscriptions`,
    {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `JWT ${token}` } : {}),
      },
      method: 'POST',
    },
  )?.then((r) => r.json())

  return res
}

export const fetchSubscriptionsClient = async ({
  starting_after,
  team,
}: {
  starting_after?: string
  team?: null | string | Team
}): Promise<SubscriptionsResult> => {
  const teamID = typeof team === 'string' ? team : team?.id

  if (!teamID) {
    throw new Error('No team ID provided')
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${teamID}/subscriptions`,
    {
      body: JSON.stringify({
        starting_after,
      }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
  ).then((r) => r.json())

  return res
}
