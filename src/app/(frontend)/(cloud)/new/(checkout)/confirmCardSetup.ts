import type { Team } from '@root/payload-cloud-types'
import type {
  SetupIntentResult,
  Stripe, // eslint-disable-line import/named
  StripeCardElement as StripeCardElementType,
  StripeElements,
} from '@stripe/stripe-js'

import { CardElement as StripeCardElement } from '@stripe/react-stripe-js'

import { createSetupIntent } from './createSetupIntent'

export const confirmCardSetup = async (args: {
  elements?: null | StripeElements
  paymentMethod?: string
  stripe?: null | Stripe
  team?: Team
}): Promise<SetupIntentResult> => {
  const { elements, paymentMethod, stripe, team } = args

  // first create the `SetupIntent`, then confirm it using the `confirmCardSetup` method
  const setupIntent = await createSetupIntent({ team })

  if (!setupIntent) {
    throw new Error('No setup intent')
  }

  if (!stripe || !elements) {
    throw new Error('Stripe not loaded')
  }

  if (!paymentMethod) {
    throw new Error('Please select a payment method and try again')
  }

  const { client_secret: clientSecret } = setupIntent

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
}
