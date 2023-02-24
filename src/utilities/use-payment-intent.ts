import React, { useEffect, useState } from 'react'

import type { Plan } from '@root/payload-cloud-types'

export const usePaymentIntent = (props: { plan: Plan }): [clientSecret: string] => {
  const [clientSecret, setClientSecret] = useState<string>('')
  const { plan } = props
  const lastRequestedPlan = React.useRef(plan)

  useEffect(() => {
    if (plan) {
      if (lastRequestedPlan.current?.id === plan?.id) return
      lastRequestedPlan.current = plan

      if (plan.slug === 'free') return

      const makePaymentIntent = async (): Promise<void> => {
        const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/payment-intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            plan: plan?.id,
          }),
        })

        const res = await req.json()

        setClientSecret(res.client_secret)
      }

      makePaymentIntent()
    }
  }, [plan])

  return [clientSecret]
}
