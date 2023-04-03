import { useCallback, useState } from 'react'
import { OnSubmit } from '@forms/types'
import { CardElement as StripeCardElement, useElements, useStripe } from '@stripe/react-stripe-js'
// eslint-disable-next-line import/named
import { PaymentIntent, StripeCardElement as StripeCardElementType } from '@stripe/stripe-js'

import { Project } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'
import { CheckoutState } from './reducer'
import { PayloadPaymentIntent } from './usePaymentIntent'

export const useDeploy = (args: {
  projectID?: string
  checkoutState: CheckoutState
  paymentIntent?: PayloadPaymentIntent
  installID?: string
  onDeploy?: (project: Project) => void
}): {
  projectID?: string
  errorDeploying: string | null
  isDeploying: boolean
  deploy: OnSubmit
} => {
  const { paymentIntent, checkoutState, installID, projectID, onDeploy } = args
  const { user } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [isDeploying, setIsDeploying] = useState(false)
  const stripe = useStripe()
  const elements = useElements()

  const makePayment = useCallback(async (): Promise<PaymentIntent | null> => {
    if (!paymentIntent || !checkoutState || !stripe || !elements) {
      throw new Error('No payment intent or checkout state')
    }

    const { paid, client_secret: clientSecret } = paymentIntent
    const { plan, paymentMethod } = checkoutState

    if (paid) {
      return null
    }

    if (!plan || !clientSecret) {
      throw new Error('No plan selected or client secret')
    }

    const stripePayment = await stripe.confirmCardPayment(clientSecret, {
      payment_method:
        paymentMethod !== 'new-card'
          ? paymentMethod
          : {
              card: elements.getElement(StripeCardElement) as StripeCardElementType,
            },
    })

    if (stripePayment.error) {
      throw new Error(stripePayment.error.message)
    }

    return stripePayment.paymentIntent
  }, [paymentIntent, elements, stripe, checkoutState])

  const deploy: OnSubmit = useCallback(
    async ({ unflattenedData: formState }) => {
      setTimeout(() => window.scrollTo(0, 0), 0)

      try {
        if (!installID) {
          throw new Error(`No installation ID was found for this project.`)
        }

        if (!paymentIntent) {
          throw new Error(`No payment intent was found for this project.`)
        }

        if (!user) {
          throw new Error(`You must be logged in to deploy a project.`)
        }

        const { subscription } = paymentIntent || {}

        setIsDeploying(true)
        setError(null)

        // process the payment
        await makePayment()

        // attempt to deploy the project
        const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/deploy`, {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            project: {
              id: projectID,
              ...checkoutState,
              ...formState,
              installID,
            },
            subscription,
          }),
        })

        const res: {
          doc: Project
          message: string
          error
        } = await req.json()

        if (req.ok) {
          const {
            doc: { team },
          } = res

          if (!user.teams || user.teams.length === 0) {
            throw new Error('No teams found')
          }

          if (typeof onDeploy === 'function') {
            onDeploy(res.doc)
          }
        } else {
          setIsDeploying(false)
          setError(res.error)
        }
      } catch (err: unknown) {
        console.error(err) // eslint-disable-line no-console
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        setIsDeploying(false)
      }
    },
    [user, makePayment, paymentIntent, installID, checkoutState, projectID, onDeploy],
  )

  return {
    errorDeploying: error,
    isDeploying,
    deploy,
  }
}
