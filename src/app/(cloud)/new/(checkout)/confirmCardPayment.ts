import { CardElement as StripeCardElement } from '@stripe/react-stripe-js'
import type {
  PaymentIntent,
  Stripe,
  StripeCardElement as StripeCardElementType, // eslint-disable-line import/named
  StripeElements,
} from '@stripe/stripe-js'

import type { PayloadStripeSubscription } from './createSubscription.js'
import type { CheckoutState } from './reducer.js'

export const confirmCardPayment = async (args: {
  subscription: PayloadStripeSubscription
  elements: StripeElements | null
  stripe: Stripe | null
  checkoutState: CheckoutState
}): Promise<PaymentIntent | null> => {
  const { subscription, elements, stripe, checkoutState } = args

  if (!subscription) throw new Error('No subscription')

  if (!stripe || !elements) throw new Error('Stripe not loaded')

  if (!checkoutState) throw new Error('No checkout state')

  const { paid, client_secret: clientSecret } = subscription
  const { paymentMethod } = checkoutState

  let paymentIntent: PaymentIntent | null = null

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
