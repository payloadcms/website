import React, { useEffect, useState } from 'react'

import type { Plan, Team } from '@root/payload-cloud-types'

export const usePaymentIntent = (props: {
  plan: Plan
  team: Team
  paymentMethod?: string
}): { clientSecret: string; error: string } => {
  const { plan, team, paymentMethod } = props

  const [clientSecret, setClientSecret] = useState<string>('')
  const [error, setError] = useState<'' | null>(null)
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
            team: team?.id,
            paymentMethod,
          }),
        })

        const res = await req.json()

        if (req.ok) {
          setClientSecret(res.client_secret)
        } else {
          setError(res.error)
        }
      }

      makePaymentIntent()
    }
  }, [plan, team, paymentMethod])

  return { clientSecret, error }
}
