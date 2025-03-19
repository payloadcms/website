import type { Team } from '@root/payload-cloud-types'
import type { PaymentMethod } from '@stripe/stripe-js'

export const fetchPaymentMethod = async (args: {
  paymentMethodID: null | string | undefined
  team: null | Team | undefined
}): Promise<null | PaymentMethod> => {
  const { paymentMethodID, team } = args

  if (!team) {
    throw new Error('Cannot fetch payment method without team')
  }
  if (!paymentMethodID) {
    throw new Error('Cannot fetch payment method without payment method ID')
  }

  const paymentMethod: PaymentMethod = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team?.id}/payment-methods/${paymentMethodID}`,
    {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    },
  ).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch payment method')
    }
    return res.json()
  })

  return paymentMethod
}
