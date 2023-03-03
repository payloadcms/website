import { useCallback, useState } from 'react'
import { CardElement as StripeCardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'

import { Project } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'

export const useDeploy = (args: {
  project: Project
  stripeClientSecret: string
  paymentMethod: string | null
}): {
  errorDeploying: string | null
  isDeploying: boolean
  deploy: () => Promise<void>
} => {
  const { stripeClientSecret, project, paymentMethod } = args
  const { user } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isDeploying, setIsDeploying] = useState(false)
  const stripe = useStripe()
  const elements = useElements()

  const processPayment = useCallback(async (): Promise<void> => {
    const { plan } = project

    if (typeof plan !== 'string' && plan.slug === 'free' && !stripeClientSecret) {
      return
    }

    const payload = await stripe.confirmCardPayment(stripeClientSecret, {
      payment_method: paymentMethod || {
        card: elements.getElement(StripeCardElement),
      },
    })

    if (payload.error) {
      throw new Error(payload.error.message)
    }
  }, [stripeClientSecret, elements, stripe, project, paymentMethod])

  const deploy = useCallback(async () => {
    window.scrollTo(0, 0)

    setIsDeploying(true)
    setError(null)

    try {
      // process the payment
      await processPayment()

      // attempt to deploy the project
      const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/deploy`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project,
        }),
      })

      const res: {
        doc: Project
        message: string
        errors: { message: string }[]
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
            ? `/dashboard/${matchedTeam?.slug}/${res.doc.slug}`
            : '/dashboard'

        router.push(redirectURL)
      } else {
        setIsDeploying(false)
        setError(res.errors[0].message)
      }
    } catch (err: unknown) {
      console.error(err)
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      setIsDeploying(false)
    }
  }, [user, project, router, processPayment])

  return {
    errorDeploying: error,
    isDeploying,
    deploy,
  }
}
