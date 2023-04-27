import type { Project } from '@root/payload-cloud-types'

// TODO: type this using the Stripe module
export interface Subscription {
  id: string
  default_payment_method: string
  plan: {
    id: string
    nickname: string
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
  // `project` this is a custom property injected by the reducer
  // this does not originate from the Stripe API
  project?: Project | null
}

export interface SubscriptionsResult {
  data: Subscription[]
  has_more: boolean
}

const matchProjectsToSubscriptions = (
  subscriptions?: SubscriptionsResult,
  projects?: Project[] | null,
): SubscriptionsResult => {
  const subscriptionsWithProjects = subscriptions?.data.map(subscription => {
    const foundProject = (projects || []).find(
      project => project.stripeSubscriptionID === subscription.id,
    )
    return {
      ...(subscription || {}),
      project: foundProject,
    }
  })

  return {
    ...(subscriptions || {}),
    data: subscriptionsWithProjects || [],
    has_more: subscriptions?.has_more || false,
  }
}

export const subscriptionsReducer = (
  state: SubscriptionsResult | null,
  action: {
    type: 'reset' | 'add'
    payload?: {
      subscriptions?: SubscriptionsResult
      projects?: Project[] | null
    }
  },
): SubscriptionsResult | null => {
  switch (action.type) {
    case 'reset':
      return matchProjectsToSubscriptions(action.payload?.subscriptions, action.payload?.projects)
    case 'add':
      return matchProjectsToSubscriptions(
        {
          ...(state || {}),
          data: [...(state?.data || []), ...(action?.payload?.subscriptions?.data || [])],
          has_more: action?.payload?.subscriptions?.has_more || false,
        },
        action.payload?.projects,
      )
    default:
      return state
  }
}
