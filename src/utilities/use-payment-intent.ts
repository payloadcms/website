import React, { useEffect, useState } from 'react'

import type { CheckoutState } from '@root/app/new/(checkout)/reducer'

export interface PayloadPaymentIntent {
  client_secret: string
  paid?: boolean
  subscription?: string
  error?: string
}

export const usePaymentIntent = (
  props: CheckoutState,
): { error?: string; paymentIntent?: PayloadPaymentIntent } => {
  const { project, paymentMethod, freeTrial } = props

  const [paymentIntent, setPaymentIntent] = useState<PayloadPaymentIntent>()
  const [error, setError] = useState<string | undefined>('')
  const isRequesting = React.useRef<boolean>(false)

  useEffect(() => {
    if (project?.id && project?.plan) {
      if (isRequesting.current) return

      const makePaymentIntent = async (): Promise<void> => {
        const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/payment-intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            project,
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
  }, [project, paymentMethod, freeTrial])

  return { error, paymentIntent }
}
