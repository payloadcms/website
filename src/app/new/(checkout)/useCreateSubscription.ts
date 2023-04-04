import React, { useCallback, useState } from 'react'

import type { CheckoutState } from '@root/app/new/(checkout)/reducer'
import type { Project } from '@root/payload-cloud-types'

export interface PayloadStripeSubscription {
  client_secret: string
  paid?: boolean
  subscription?: string
  error?: string
}

export const useCreateSubscription = (args: {
  project: Project
  checkoutState: CheckoutState
}): {
  error?: string
  createSubscription: () => Promise<PayloadStripeSubscription>
  subscription: PayloadStripeSubscription | null
} => {
  const { project, checkoutState } = args

  const [subscription, setSubscription] = useState<PayloadStripeSubscription | null>(null)
  const [error, setError] = useState<string | undefined>('')
  const isRequesting = React.useRef<boolean>(false)

  const createSubscription = useCallback(async (): Promise<PayloadStripeSubscription> => {
    const { paymentMethod, freeTrial, plan, team } = checkoutState

    const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project: {
          ...project,
          plan,
          team,
        },
        paymentMethod,
        freeTrial,
      }),
    })

    const res: PayloadStripeSubscription = await req.json()

    if (req.ok) {
      setSubscription(res)
    } else {
      setError(res.error)
    }

    isRequesting.current = false
    return res
  }, [project, checkoutState])

  return { error, createSubscription, subscription }
}
