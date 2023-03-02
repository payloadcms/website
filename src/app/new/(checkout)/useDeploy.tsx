import { useCallback, useState } from 'react'
import { CardElement as StripeCardElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'

import { Plan, Project, Team } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'
import { Install } from '@root/utilities/use-get-installs'

export const useDeploy = (args: {
  project: Project
  stripeClientSecret: string
  plan: Plan
  install: Install
  team: Team
  paymentMethod: string | null
}): {
  errorDeploying: string | null
  isDeploying: boolean
  deploy: () => Promise<void>
} => {
  const { stripeClientSecret, project, plan, team, install, paymentMethod } = args
  const { user } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isDeploying, setIsDeploying] = useState(false)
  const stripe = useStripe()
  const elements = useElements()

  const processPayment = useCallback(async (): Promise<void> => {
    if (plan.slug === 'free' && !stripeClientSecret) {
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
  }, [stripeClientSecret, elements, stripe, plan, paymentMethod])

  const deploy = useCallback(async () => {
    window.scrollTo(0, 0)

    setIsDeploying(true)
    setError(null)

    try {
      // process the payment
      await processPayment()

      // deploy the project
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project.id}`,
        {
          credentials: 'include',
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            _status: 'published',
            team: team?.id,
            plan: plan?.id,
            installID: install?.id,
          }),
        },
      )

      const res: {
        doc: Project
        message: string
        errors: { message: string }[]
      } = await req.json()

      if (req.ok) {
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
  }, [user, project, router, plan, team, install, processPayment])

  return {
    errorDeploying: error,
    isDeploying,
    deploy,
  }
}
