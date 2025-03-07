import type { Team } from '@root/payload-cloud-types'
import type { PaymentMethod } from '@stripe/stripe-js'

import { payloadCloudToken } from './token'

export const fetchPaymentMethods = async (args: {
  team: null | Team | undefined
}): Promise<null | PaymentMethod[]> => {
  const { team } = args
  if (!team) {
    return null
  }

  const { cookies } = await import('next/headers')
  const token = (await cookies()).get(payloadCloudToken)?.value ?? null
  if (!token) {
    throw new Error('No token provided')
  }

  const paymentMethods: PaymentMethod[] = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team?.id}/payment-methods`,
    {
      headers: {
        Authorization: `JWT ${token}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    },
  ).then(async (res) => {
    const json: {
      data: PaymentMethod[]
      message: string
    } = await res.json()
    if (!res.ok) {
      throw new Error(json.message)
    }
    return json?.data
  })

  return paymentMethods
}

export const fetchPaymentMethodsClient = async (args: {
  team: null | Team | undefined
}): Promise<null | PaymentMethod[]> => {
  const { team } = args
  if (!team) {
    throw new Error('Cannot fetch payment method without team')
  }

  const paymentMethods: PaymentMethod[] = await fetch(
    `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team?.id}/payment-methods`,
    {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    },
  ).then(async (res) => {
    const json: {
      data: PaymentMethod[]
      message: string
    } = await res.json()
    if (!res.ok) {
      throw new Error(json.message)
    }
    return json?.data
  })

  return paymentMethods
}
