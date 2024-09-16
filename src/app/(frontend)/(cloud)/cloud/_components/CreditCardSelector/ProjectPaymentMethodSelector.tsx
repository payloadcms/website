'use client'

import React, { useCallback } from 'react'
import { toast } from 'sonner'
import { ProjectWithSubscription } from '@cloud/_api/fetchProject.js'
import { TeamWithCustomer } from '@cloud/_api/fetchTeam.js'
import { updateSubscription } from '@cloud/_api/updateSubscription.js'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe, type PaymentMethod } from '@stripe/stripe-js'

import { CreditCardSelector } from './index.js'

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
const Stripe = loadStripe(apiKey)

export const ProjectPaymentMethodSelector: React.FC<{
  team: TeamWithCustomer
  project: ProjectWithSubscription
  initialPaymentMethods?: PaymentMethod[] | null
}> = props => {
  const { team, project, initialPaymentMethods } = props

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
        onPaymentMethodChange={onPaymentMethodChange}
        team={team}
        initialValue={project?.stripeSubscription?.default_payment_method}
        enableInlineSave
        initialPaymentMethods={initialPaymentMethods}
      />
    </Elements>
  )
}
