import React, { useEffect, useState } from 'react'

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
}): { error?: string; subscription?: PayloadStripeSubscription } => {
  const { project, checkoutState } = args

  const [subscription, setSubscription] = useState<PayloadStripeSubscription>()
  const [error, setError] = useState<string | undefined>('')
  const isRequesting = React.useRef<boolean>(false)
  const prevPaymentMethod = React.useRef<string | undefined>(checkoutState?.paymentMethod)

  useEffect(() => {
    const { paymentMethod, freeTrial, plan, team } = checkoutState

    // only make a payment intent if the payment method has changed
    // to do this maintain a ref to the previous payment method
    // also ensure they have a `stripeCustomerID`
    if (
      !isRequesting.current &&
      prevPaymentMethod.current !== checkoutState.paymentMethod &&
      project?.id &&
      plan &&
      paymentMethod &&
      team?.stripeCustomerID
    ) {
      isRequesting.current = true
      prevPaymentMethod.current = paymentMethod

      setError(undefined)

      const createSubscription = async (): Promise<void> => {
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
      }

      createSubscription()
    }
  }, [project, checkoutState])

  return { error, subscription }
}
