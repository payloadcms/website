import type { Subscription } from '@cloud/_api/fetchSubscriptions.js'

export const updatePaymentMethod = async (args: {
  teamID: string
  subscriptionID: string
  paymentMethod: string
}): Promise<Subscription> => {
  const { teamID, subscriptionID, paymentMethod } = args

  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/${teamID}/subscriptions/${subscriptionID}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          default_payment_method: paymentMethod,
        }),
      },
    )

    const res: Subscription & {
      error?: string
    } = await req.json()

    if (!req.ok) {
      throw new Error(res.error)
    }
    return res
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    throw new Error(`Could not update subscription: ${message}`)
  }
}
