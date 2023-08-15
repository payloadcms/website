'use client'

import React, { useCallback } from 'react'
import { toast } from 'react-toastify'
import { ProjectWithSubscription } from '@cloud/_api/fetchProject'
import { TeamWithCustomer } from '@cloud/_api/fetchTeam'
import { updateSubscription } from '@cloud/_api/updateSubscription'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import { CreditCardSelector } from '.'

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
const Stripe = loadStripe(apiKey)

export const ProjectCardSelector: React.FC<{
  team: TeamWithCustomer
  project: ProjectWithSubscription
}> = props => {
  const { team, project } = props

  const onPaymentMethodChange = useCallback(
    async (newPaymentMethod: string) => {
      if (project?.stripeSubscriptionID) {
        try {
          await updateSubscription(team, project, {
            default_payment_method: newPaymentMethod,
          })
          toast.success('Payment method updated')
        } catch (error) {
          console.error(error) // eslint-disable-line no-console
          toast.error('Error updating payment method')
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
      />
    </Elements>
  )
}
