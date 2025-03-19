import type { Subscription } from '@cloud/_api/fetchSubscriptions'

export const updatePaymentMethod = async (args: {
  paymentMethod: string
  subscriptionID: string
  teamID: string
}): Promise<Subscription> => {
  const { paymentMethod, subscriptionID, teamID } = args

  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/${teamID}/subscriptions/${subscriptionID}`,
      {
        body: JSON.stringify({
          default_payment_method: paymentMethod,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
      },
    )

    const res: {
      error?: string
    } & Subscription = await req.json()

    if (!req.ok) {
      throw new Error(res.error)
    }
    return res
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    throw new Error(`Could not update subscription: ${message}`)
  }
}
