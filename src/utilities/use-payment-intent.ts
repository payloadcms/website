import React, { useEffect, useState } from 'react'

import type { CheckoutState } from '@root/app/new/(checkout)/reducer'
import type { Project } from '@root/payload-cloud-types'

export interface PayloadPaymentIntent {
  client_secret: string
  paid?: boolean
  subscription?: string
  error?: string
}

export const usePaymentIntent = (args: {
  project: Project
  checkoutState: CheckoutState
}): { error?: string; paymentIntent?: PayloadPaymentIntent } => {
  const { project, checkoutState } = args

  const [paymentIntent, setPaymentIntent] = useState<PayloadPaymentIntent>()
  const [error, setError] = useState<string | undefined>('')
  const isRequesting = React.useRef<boolean>(false)

  useEffect(() => {
    const { paymentMethod, freeTrial, plan, team } = checkoutState

    if (!isRequesting.current && project?.id && plan && paymentMethod && team) {
      isRequesting.current = true

      setError(undefined)

      const makePaymentIntent = async (): Promise<void> => {
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

        const res: PayloadPaymentIntent = await req.json()

        if (req.ok) {
          setPaymentIntent(res)
        } else {
          setError(res.error)
        }

        isRequesting.current = false
      }

      makePaymentIntent()
    }
  }, [project, checkoutState])

  return { error, paymentIntent }
}
