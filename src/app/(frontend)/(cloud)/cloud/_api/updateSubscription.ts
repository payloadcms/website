import type { ProjectWithSubscription } from './fetchProject'
import type { Subscription } from './fetchSubscriptions'
import type { TeamWithCustomer } from './fetchTeam'

export const updateSubscription = async (
  team: TeamWithCustomer,
  project: ProjectWithSubscription,
  subscription: Partial<Subscription>,
): Promise<Subscription> => {
  const sub = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team?.id}/subscriptions/${project?.stripeSubscriptionID}`,
    {
      body: JSON.stringify(subscription),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'PATCH',
    },
  )?.then((res) => {
    if (!res.ok) {
      throw new Error('Failed to update subscription')
    }
    return res.json()
  })

  return sub
}
