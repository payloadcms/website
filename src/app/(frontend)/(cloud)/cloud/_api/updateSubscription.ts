import type { ProjectWithSubscription } from './fetchProject.js'
import type { Subscription } from './fetchSubscriptions.js'
import type { TeamWithCustomer } from './fetchTeam.js'

export const updateSubscription = async (
  team: TeamWithCustomer,
  project: ProjectWithSubscription,
  subscription: Partial<Subscription>,
): Promise<Subscription> => {
  const sub = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team?.id}/subscriptions/${project?.stripeSubscriptionID}`,
    {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscription),
    },
  )?.then(res => {
    if (!res.ok) throw new Error('Failed to update subscription')
    return res.json()
  })

  return sub
}
