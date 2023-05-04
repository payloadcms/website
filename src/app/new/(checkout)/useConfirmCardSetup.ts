import { useCallback } from 'react'
import { CardElement as StripeCardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import type {
  SetupIntentResult, // eslint-disable-line import/named
  StripeCardElement as StripeCardElementType,
} from '@stripe/stripe-js'

import type { Team } from '@root/payload-cloud-types'
import { useCreateSetupIntent } from './useCreateSetupIntent'

type ConfirmCardSetup = (paymentMethod: string) => Promise<SetupIntentResult | null>

export type UseConfirmCardSetup = (args: { team?: Team }) => ConfirmCardSetup

export const useConfirmCardSetup: UseConfirmCardSetup = args => {
  const { team } = args
  const stripe = useStripe()
  const elements = useElements()
  const createSetupIntent = useCreateSetupIntent({
    team,
  })

  const confirmCardSetup: ConfirmCardSetup = useCallback(
    async paymentMethod => {
      // first create the setup intent, then confirm the card setup
      const setupIntent = await createSetupIntent()

      if (!setupIntent) {
        throw new Error('No setup intent')
      }

      if (!paymentMethod || !stripe || !elements) {
        throw new Error('No payment intent or checkout state')
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
    },
    [elements, stripe, createSetupIntent],
  )

  return confirmCardSetup
}
