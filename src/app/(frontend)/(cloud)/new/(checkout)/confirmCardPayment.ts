import type {
  PaymentIntent,
  Stripe,
  StripeCardElement as StripeCardElementType, // eslint-disable-line import/named
  StripeElements,
} from '@stripe/stripe-js'

import { CardElement as StripeCardElement } from '@stripe/react-stripe-js'

import type { PayloadStripeSubscription } from './createSubscription'
import type { CheckoutState } from './reducer'

export const confirmCardPayment = async (args: {
  checkoutState: CheckoutState
  elements: null | StripeElements
  stripe: null | Stripe
  subscription: PayloadStripeSubscription
}): Promise<null | PaymentIntent> => {
  const { checkoutState, elements, stripe, subscription } = args

  if (!subscription) {
    throw new Error('No subscription')
  }

  if (!stripe || !elements) {
    throw new Error('Stripe not loaded')
  }

  if (!checkoutState) {
    throw new Error('No checkout state')
  }

  const { client_secret: clientSecret, paid } = subscription
  const { paymentMethod } = checkoutState

  const paymentIntent: null | PaymentIntent = null

  if (!paid) {
    if (!clientSecret) {
      throw new Error(`Could not confirm payment, no client secret`)
    }

    // free trials never return a client secret because their initial $0 invoice is pre-paid
    // this is the case for both existing payment methods as well as new cards
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
  }

  return paymentIntent
}
