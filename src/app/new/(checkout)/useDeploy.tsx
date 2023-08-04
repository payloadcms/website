import { useCallback } from 'react'
import { OnSubmit } from '@forms/types'
import { useElements, useStripe } from '@stripe/react-stripe-js'

import { Project } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'
import { confirmCardPayment } from './confirmCardPayment'
import { createSubscription, PayloadStripeSubscription } from './createSubscription'
import { CheckoutState } from './reducer'
import { useConfirmCardSetup } from './useConfirmCardSetup'

export const useDeploy = (args: {
  project: Project | null | undefined
  checkoutState: CheckoutState
  installID?: string
  onDeploy?: (project: Project) => void
}): OnSubmit => {
  const { checkoutState, installID, project, onDeploy } = args
  const { user } = useAuth()
  const stripe = useStripe()
  const elements = useElements()

  const confirmCardSetup = useConfirmCardSetup({
    team: checkoutState?.team,
  })

  const deploy: OnSubmit = useCallback(
    async ({ unflattenedData: formState }) => {
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

        setTimeout(() => window.scrollTo(0, 0), 0)

        // first create a setup intent and confirm it
        // this will ensure that payment methods are supplied even for trials
        await confirmCardSetup(checkoutState.paymentMethod)

        // only scroll-to-top after the card has been confirmed
        // Stripe automatically scrolls to the `CardElement` if an error occurs
        // this gets interrupted if this scroll-to-top is fired immediately
        // afaik there's no way to prevent this behavior, so instead we'll just scroll after
        // this also means that we need to scroll in the catch block as well
        setTimeout(() => window.scrollTo(0, 0), 0)

        // attempt to deploy the project
        // do not create the subscription yet to ensure the project will deploy
        const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/deploy`, {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            project: {
              id: project?.id,
              template:
                project?.template && typeof project.template !== 'string'
                  ? project.template.id
                  : project?.template,
              ...checkoutState,
              ...formState,
              installID,
            },
          }),
        })

        const res: {
          doc: Project
          message: string
          error
        } = await req.json()

        if (req.ok) {
          // once the project is deployed successfully, create the subscription
          // also confirm card payment at this time
          const subscription = await createSubscription({
            checkoutState,
            project: res.doc,
          })

          await confirmCardPayment({ subscription, elements, stripe, checkoutState })

          if (typeof onDeploy === 'function') {
            onDeploy(res.doc)
          }
        } else {
          throw new Error(res.error || res.message)
        }
      } catch (err: unknown) {
        setTimeout(() => window.scrollTo(0, 0), 0)
        const message = err instanceof Error ? err.message : 'Unknown error'
        throw new Error(`Error deploying project: ${message}`)
      }
    },
    [user, installID, checkoutState, project, onDeploy, confirmCardSetup, elements, stripe],
  )

  return deploy
}
