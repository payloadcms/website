import type { Project, Team } from '@root/payload-cloud-types.js'
import { payloadCloudToken } from './token.js'

// TODO: type this using the Stripe module
export interface Subscription {
  id: string
  default_payment_method: string
  plan: {
    id: string
    nickname: string
    amount: number
  }
  status: string
  trial_end: number
  items: {
    data: Array<{
      id: string
      price: {
        id: string
        nickname: string
        unit_amount: number
        currency: string
        type: string
        recurring: {
          interval: string
          interval_count: number
        }
        product: string
      }
    }>
  }
  metadata: {
    payload_project_id: string
  }
  // this is an additional property added y the Payload API
  // this is _not_ a property of the Stripe API
  project: Project
}

export interface SubscriptionsResult {
  data: Subscription[]
  has_more: boolean
}

export const fetchSubscriptions = async (team?: Team | string): Promise<SubscriptionsResult> => {
  const teamID = typeof team === 'string' ? team : team?.id
  if (!teamID) throw new Error('No team ID provided')

  const { cookies } = await import('next/headers')
  const token = cookies().get(payloadCloudToken)?.value ?? null
  if (!token) throw new Error('No token provided')

  const res: SubscriptionsResult = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${teamID}/subscriptions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `JWT ${token}` } : {}),
      },
    },
  )?.then(r => r.json())

  return res
}

export const fetchSubscriptionsClient = async ({
  team,
  starting_after,
}: {
  team?: Team | string | null
  starting_after?: string
}): Promise<SubscriptionsResult> => {
  const teamID = typeof team === 'string' ? team : team?.id

  if (!teamID) throw new Error('No team ID provided')

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${teamID}/subscriptions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        starting_after,
      }),
    },
  ).then(r => r.json())

  return res
}
