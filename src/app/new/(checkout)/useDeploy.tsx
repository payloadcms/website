import { useCallback } from 'react'
import { OnSubmit } from '@forms/types'
import { useElements, useStripe } from '@stripe/react-stripe-js'

import { Project } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'
import { confirmCardPayment } from './confirmCardPayment'
import { confirmCardSetup } from './confirmCardSetup'
import { createSubscription } from './createSubscription'
import { CheckoutState } from './reducer'

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
          throw new Error(`You must select a plan to deploy a project.`)
        }

        if (!checkoutState.paymentMethod && !checkoutState.freeTrial) {
          throw new Error(
            `No payment method was provided. Please add a payment method or select "free trial" and try again.`,
          )
        }

        // if a card was supplied, first create a `SetupIntent` (to confirm it later, see below)
        // confirming card setup now will ensure that the card is valid and has sufficient funds
        // this will ensure that even free trials that have a card selected will be validated
        if (checkoutState.paymentMethod) {
          const intent = await confirmCardSetup({
            paymentMethod: checkoutState.paymentMethod,
            stripe,
            elements,
            team: checkoutState.team,
          })
        }

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
              // remove all empty environment variables
              environmentVariables: formState.environmentVariables?.filter(
                ({ key, value }) => key && value,
              ),
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
          // this will ensure everything worked before the customer pays for it
          const subscription = await createSubscription({
            checkoutState,
            project: res.doc,
          })

          // confirm the `SetupIntent` if a payment method was supplied
          // the `setupIntent` has already determined that the card is valid an has sufficient funds
          // free trials will mark the subscription as paid immediately
          const payment = await confirmCardPayment({
            subscription,
            elements,
            stripe,
            checkoutState,
          })

          // update the subscription with the payment method
          // if the customer selected an existing card, it will already be attached
          // but if this is a new card, it can only be attached after the payment intent is confirmed
          if (checkoutState.paymentMethod) {
          }

          if (typeof onDeploy === 'function') {
            onDeploy(res.doc)
          }
        } else {
          throw new Error(res.error || res.message)
        }
      } catch (err: unknown) {
        setTimeout(() => window.scrollTo(0, 0), 0)
        const message = err instanceof Error ? err.message : 'Unknown error'
        throw new Error(message)
      }
    },
    [user, installID, checkoutState, project, onDeploy, elements, stripe],
  )

  return deploy
}
