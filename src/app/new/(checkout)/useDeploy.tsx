import { useCallback, useState } from 'react'
import { CardElement as StripeCardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { PaymentIntent, StripeCardElement as StripeCardElementType } from '@stripe/stripe-js'
import { useRouter } from 'next/navigation'

import { cloudSlug } from '@root/app/cloud/layout'
import { Project } from '@root/payload-types copy'
import { useAuth } from '@root/providers/Auth'
import { PayloadPaymentIntent } from '@root/utilities/use-payment-intent'
import { CheckoutState } from './reducer'

export const useDeploy = (args: {
  checkoutState: CheckoutState
  paymentIntent?: PayloadPaymentIntent
  installID?: string
}): {
  errorDeploying: string | null
  isDeploying: boolean
  deploy: () => Promise<void>
} => {
  const { paymentIntent, checkoutState, installID } = args
  const { user } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isDeploying, setIsDeploying] = useState(false)
  const stripe = useStripe()
  const elements = useElements()

  const makePayment = useCallback(async (): Promise<PaymentIntent | null> => {
    if (!paymentIntent || !checkoutState || !stripe || !elements) {
      throw new Error('No payment intent or checkout state')
    }

    const { paid, client_secret: clientSecret } = paymentIntent
    const { project, paymentMethod } = checkoutState
    const { plan } = project

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

  const deploy = useCallback(async () => {
    setTimeout(() => window.scrollTo(0, 0), 0)

    if (!checkoutState || !paymentIntent || !user) return

    const { project } = checkoutState
    const { subscription } = paymentIntent || {}

    setIsDeploying(true)
    setError(null)

    try {
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
            ...project,
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

        const teamID = typeof team === 'string' ? team : team?.id

        const matchedTeam = user.teams.find(({ team: userTeam }) => {
          return typeof userTeam === 'string' ? userTeam === teamID : userTeam?.id === teamID
        })?.team

        const redirectURL =
          typeof matchedTeam === 'object'
            ? `/${cloudSlug}/${matchedTeam?.slug}/${res.doc.slug}`
            : `/${cloudSlug}`

        router.push(redirectURL)
      } else {
        setIsDeploying(false)
        setError(res.error)
      }
    } catch (err: unknown) {
      console.error(err)
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      setIsDeploying(false)
    }
  }, [user, checkoutState, router, makePayment, paymentIntent, installID])

  return {
    errorDeploying: error,
    isDeploying,
    deploy,
  }
}
