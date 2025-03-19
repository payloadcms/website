'use client'

import type { ProjectWithSubscription } from '@cloud/_api/fetchProject'
import type { TeamWithCustomer } from '@cloud/_api/fetchTeam'

import { updateSubscription } from '@cloud/_api/updateSubscription'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe, type PaymentMethod } from '@stripe/stripe-js'
import React, { useCallback } from 'react'
import { toast } from 'sonner'

import { CreditCardSelector } from './index'

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
const Stripe = loadStripe(apiKey)

export const ProjectPaymentMethodSelector: React.FC<{
  initialPaymentMethods?: null | PaymentMethod[]
  project: ProjectWithSubscription
  team: TeamWithCustomer
}> = (props) => {
  const { initialPaymentMethods, project, team } = props

  const onPaymentMethodChange = useCallback(
    async (newPaymentMethod: string) => {
      if (project?.stripeSubscriptionID) {
        try {
          await updateSubscription(team, project, {
            default_payment_method: newPaymentMethod,
          })
          toast.success('Payment method updated successfully.')
        } catch (error) {
          console.error(error) // eslint-disable-line no-console
          toast.error('Error updating payment method.')
        }
      }
    },
    [project, team],
  )

  return (
    <Elements stripe={Stripe}>
      <CreditCardSelector
        enableInlineSave
        initialPaymentMethods={initialPaymentMethods}
        initialValue={project?.stripeSubscription?.default_payment_method}
        onPaymentMethodChange={onPaymentMethodChange}
        team={team}
      />
    </Elements>
  )
}
