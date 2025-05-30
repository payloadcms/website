import type { CheckoutState } from '@root/app/(frontend)/(cloud)/new/(checkout)/reducer'
import type { Project } from '@root/payload-cloud-types'

export interface PayloadStripeSubscription {
  client_secret: string
  error?: string
  paid?: boolean
  subscription?: string
}

export const createSubscription = async (args: {
  checkoutState: CheckoutState
  project: Pick<Project, 'id' | 'plan' | 'team'>
}): Promise<PayloadStripeSubscription> => {
  const {
    checkoutState: { freeTrial, paymentMethod, plan, team },
    project,
  } = args

  try {
    const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/create-subscription`, {
      body: JSON.stringify({
        freeTrial,
        paymentMethod,
        project: {
          id: project.id,
          // flatten relationships to only the ID
          plan: typeof plan === 'string' ? plan : plan.id,
          team: typeof team === 'string' ? team : team.id,
        },
      }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const res: PayloadStripeSubscription = await req.json()

    if (!req.ok) {
      throw new Error(res.error)
    }
    return res
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    throw new Error(`Could not create subscription: ${message}`)
  }
}
