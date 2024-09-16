import type { PaymentMethod } from '@stripe/stripe-js'

import type { Team } from '@root/payload-cloud-types.js'

export const fetchPaymentMethod = async (args: {
  team: Team | null | undefined
  paymentMethodID: string | null | undefined
}): Promise<PaymentMethod | null> => {
  const { team, paymentMethodID } = args

  if (!team) throw new Error('Cannot fetch payment method without team')
  if (!paymentMethodID) throw new Error('Cannot fetch payment method without payment method ID')

  const paymentMethod: PaymentMethod = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team?.id}/payment-methods/${paymentMethodID}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ).then(res => {
    if (!res.ok) throw new Error('Failed to fetch payment method')
    return res.json()
  })

  return paymentMethod
}
