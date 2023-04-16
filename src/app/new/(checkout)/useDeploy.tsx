import { useCallback } from 'react'
import { OnSubmit } from '@forms/types'
import { CardElement as StripeCardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import {
  PaymentIntent, // eslint-disable-line import/named
  SetupIntentResult, // eslint-disable-line import/named
  StripeCardElement as StripeCardElementType, // eslint-disable-line import/named
} from '@stripe/stripe-js'

import { Project } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'
import { CheckoutState } from './reducer'
import { PayloadStripeSetupIntent, useCreateSetupIntent } from './useCreateSetupIntent'
import { PayloadStripeSubscription, useCreateSubscription } from './useCreateSubscription'

export const useDeploy = (args: {
  project: Project
  checkoutState: CheckoutState
  installID?: string
  onDeploy?: (project: Project) => void
}): OnSubmit => {
  const { checkoutState, installID, project, onDeploy } = args
  const { user } = useAuth()
  const stripe = useStripe()
  const elements = useElements()

  const createSubscription = useCreateSubscription({
    project,
    checkoutState,
  })

  const createSetupIntent = useCreateSetupIntent({
    project,
    checkoutState,
  })

  // this will ensure payment methods are supplied even for trials
  const confirmCardSetup = useCallback(
    async (setupIntent: PayloadStripeSetupIntent): Promise<SetupIntentResult | null> => {
      if (!setupIntent) {
        throw new Error('No setup intent')
      }

      if (!checkoutState || !stripe || !elements) {
        throw new Error('No payment intent or checkout state')
      }

      const { client_secret: clientSecret } = setupIntent
      const { paymentMethod } = checkoutState

      if (!clientSecret) {
        throw new Error('No plan selected or client secret')
      }

      const stripePayment = await stripe.confirmCardSetup(clientSecret, {
        payment_method:
          !paymentMethod || paymentMethod.startsWith('new-card')
            ? {
                card: elements.getElement(StripeCardElement) as StripeCardElementType,
              }
            : paymentMethod,
      })

      if (stripePayment.error) {
        throw new Error(stripePayment.error.message)
      }

      return stripePayment
    },
    [elements, stripe, checkoutState],
  )

  const makeCardPayment = useCallback(
    async (subscription: PayloadStripeSubscription): Promise<PaymentIntent | null> => {
      if (!subscription) {
        throw new Error('No subscription')
      }

      if (!checkoutState || !stripe || !elements) {
        throw new Error('No payment intent or checkout state')
      }

      const { client_secret: clientSecret } = subscription
      const { paymentMethod } = checkoutState

      if (!clientSecret) {
        throw new Error('No client secret')
      }

      const stripePayment = await stripe.confirmCardPayment(clientSecret, {
        payment_method:
          !paymentMethod || paymentMethod.startsWith('new-card')
            ? {
                card: elements.getElement(StripeCardElement) as StripeCardElementType,
              }
            : paymentMethod,
      })

      if (stripePayment.error) {
        throw new Error(stripePayment.error.message)
      }

      return stripePayment.paymentIntent
    },
    [elements, stripe, checkoutState],
  )

  const deploy: OnSubmit = useCallback(
    async ({ unflattenedData: formState }) => {
      setTimeout(() => window.scrollTo(0, 0), 0)

      try {
        if (!installID) {
          throw new Error(`No installation ID was found for this project.`)
        }

        if (!user) {
          throw new Error(`You must be logged in to deploy a project.`)
        }

        if (!checkoutState?.plan) {
          throw new Error(`No plan selected`)
        }

        // first create a setup intent
        const setupIntent = await createSetupIntent()

        // then confirm the card setup
        // this will ensure that payment methods are supplied even for trials
        await confirmCardSetup(setupIntent)

        // next create a subscription
        const subscription = await createSubscription()

        // finally pay for it (only applies to non-trials)
        await makeCardPayment(subscription)

        // finally attempt to deploy the project
        const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/deploy`, {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            project: {
              id: project?.id,
              ...checkoutState,
              ...formState,
              installID,
            },
            subscription: subscription?.subscription,
          }),
        })

        const res: {
          doc: Project
          message: string
          error
        } = await req.json()

        if (req.ok) {
          if (!user.teams || user.teams.length === 0) {
            throw new Error('No teams found')
          }

          if (typeof onDeploy === 'function') {
            onDeploy(res.doc)
          }
        } else {
          throw new Error(res.error || res.message)
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        throw new Error(`Error deploying project: ${message}`)
      }
    },
    [
      user,
      installID,
      checkoutState,
      project,
      onDeploy,
      createSubscription,
      confirmCardSetup,
      createSetupIntent,
      makeCardPayment,
    ],
  )

  return deploy
}
