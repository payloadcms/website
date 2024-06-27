import type { PaymentMethod } from '@stripe/stripe-js'

import type { Team } from '@root/payload-cloud-types.js'
import { payloadCloudToken } from './token.js'

export const fetchPaymentMethods = async (args: {
  team: Team | null | undefined
}): Promise<PaymentMethod[] | null> => {
  const { team } = args
  if (!team) return null

  const { cookies } = await import('next/headers')
  const token = cookies().get(payloadCloudToken)?.value ?? null
  if (!token) throw new Error('No token provided')

  const paymentMethods: PaymentMethod[] = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team?.id}/payment-methods`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
    },
  ).then(async res => {
    const json: {
      data: PaymentMethod[]
      message: string
    } = await res.json()
    if (!res.ok) throw new Error(json.message)
    return json?.data
  })

  return paymentMethods
}

export const fetchPaymentMethodsClient = async (args: {
  team: Team | null | undefined
}): Promise<PaymentMethod[] | null> => {
  const { team } = args
  if (!team) throw new Error('Cannot fetch payment method without team')

  const paymentMethods: PaymentMethod[] = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team?.id}/payment-methods`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ).then(async res => {
    const json: {
      data: PaymentMethod[]
      message: string
    } = await res.json()
    if (!res.ok) throw new Error(json.message)
    return json?.data
  })

  return paymentMethods
}
