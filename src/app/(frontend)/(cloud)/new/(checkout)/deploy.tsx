import type { ProjectDeployResponse } from '@root/app/(frontend)/types'
import type { Project, Team, User } from '@root/payload-cloud-types'
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

import { updateCustomer } from '@cloud/_api/updateCustomer'
import { teamHasDefaultPaymentMethod } from '@cloud/_utilities/teamHasDefaultPaymentMethod'
import { type Stripe, type StripeElements } from '@stripe/stripe-js'
import { toast } from 'sonner'

import type { CheckoutState } from './reducer'

import { confirmCardPayment } from './confirmCardPayment'
import { confirmCardSetup } from './confirmCardSetup'
import { createSubscription } from './createSubscription'

export const deploy = async (args: {
  checkoutState: CheckoutState
  elements: null | StripeElements | undefined
  installID?: string
  onDeploy?: (project: ProjectDeployResponse) => void
  project: null | Project | undefined
  router: AppRouterInstance
  stripe: null | Stripe | undefined
  unflattenedData: any
  user: null | undefined | User
}): Promise<void> => {
  const {
    checkoutState,
    elements,
    installID,
    onDeploy,
    project,
    router,
    stripe,
    unflattenedData: formState,
    user,
  } = args

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

    if (checkoutState?.plan?.private) {
      throw new Error(`This plan cannot be deployed through the checkout.`)
    }

    if (!checkoutState.paymentMethod && !checkoutState.freeTrial) {
      throw new Error(
        `No payment method was provided. Please add a payment method or select "free trial" and try again.`,
      )
    }

    // if a card was supplied, first create a `SetupIntent` (to confirm it later, see below)
    // confirming card setup now will ensure that the card is valid and has sufficient funds
    // this will ensure that even free trials that have a card selected will be validated
    // `confirmCardSetup` will throw its own errors, no need to catch them here
    if (checkoutState.paymentMethod) {
      const { setupIntent } = await confirmCardSetup({
        elements,
        paymentMethod: checkoutState.paymentMethod,
        stripe,
        team: checkoutState.team,
      })

      const pmID =
        typeof setupIntent?.payment_method === 'string'
          ? setupIntent?.payment_method
          : setupIntent?.payment_method?.id || ''

      // set the customer's default payment method automatically
      // only if they do not already have one set
      if (!teamHasDefaultPaymentMethod(checkoutState?.team)) {
        await updateCustomer(checkoutState.team, {
          invoice_settings: {
            default_payment_method: pmID,
          },
        })
      }
    }

    // attempt to deploy the project
    // do not create the subscription yet to ensure the project will deploy
    const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/deploy`, {
      body: JSON.stringify({
        project: {
          id: project?.id,
          freeTrial: checkoutState.freeTrial,
          paymentMethod: checkoutState.paymentMethod,
          template:
            project?.template && typeof project.template !== 'string'
              ? project.template.id
              : project?.template,
          // reduce large payloads to only the ID, i.e. plan and team
          plan: typeof checkoutState.plan === 'string' ? checkoutState.plan : checkoutState.plan.id,
          team: typeof checkoutState.team === 'string' ? checkoutState.team : checkoutState.team.id,
          ...formState,
          // remove all empty environment variables
          environmentVariables: formState.environmentVariables?.filter(
            ({ key, value }) => key && value,
          ),
          installID,
        },
      }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const res: {
      doc: ProjectDeployResponse
      error
      message: string
    } = await req.json()

    if (req.ok) {
      // once the project is deployed successfully, create the subscription
      // this will ensure everything worked before the customer pays for it
      const subscription = await createSubscription({
        checkoutState,
        project: {
          id: res.doc.id,
          plan: res.doc.plan,
          team: typeof res.doc.team === 'string' ? res.doc.team : res.doc.team.id,
        },
      })

      if (!elements || !stripe) {
        throw new Error(`Stripe is not initialized.`)
      }

      // confirm the `SetupIntent` if a payment method was supplied
      // the `setupIntent` has already determined that the card is valid an has sufficient funds
      // free trials will mark the subscription as paid immediately
      await confirmCardPayment({
        checkoutState,
        elements,
        stripe,
        subscription,
      })

      if (typeof onDeploy === 'function') {
        onDeploy(res.doc)
      }
    } else {
      if (req.status === 409) {
        const message = res.error
          ? `${res.error} Now redirecting...`
          : `This project has already been deployed. Now redirecting...`

        toast.error(message)

        if (project?.team && typeof project?.team !== 'string') {
          router.push(`/cloud/${project.team.slug}/${project?.slug}`)
        }

        throw new Error(message)
      }

      throw new Error(res.error || res.message)
    }
  } catch (err: unknown) {
    window.scrollTo(0, 0)
    const message = err instanceof Error ? err.message : 'Unknown error'
    throw new Error(message)
  }
}
