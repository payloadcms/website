import { toast } from 'sonner'
import { updateCustomer } from '@cloud/_api/updateCustomer.js'
import { teamHasDefaultPaymentMethod } from '@cloud/_utilities/teamHasDefaultPaymentMethod.js'
import { type Stripe, type StripeElements } from '@stripe/stripe-js'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime.js'

import { Project, User } from '@root/payload-cloud-types.js'
import { confirmCardPayment } from './confirmCardPayment.js'
import { confirmCardSetup } from './confirmCardSetup.js'
import { createSubscription } from './createSubscription.js'
import { CheckoutState } from './reducer.js'

export const deploy = async (args: {
  project: Project | null | undefined
  checkoutState: CheckoutState
  installID?: string
  onDeploy?: (project: Project) => void
  user: User | null | undefined
  stripe: Stripe | null | undefined
  elements: StripeElements | null | undefined
  unflattenedData: any
  router: AppRouterInstance
}): Promise<void> => {
  const {
    checkoutState,
    installID,
    project,
    onDeploy,
    user,
    stripe,
    elements,
    unflattenedData: formState,
    router,
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
        paymentMethod: checkoutState.paymentMethod,
        stripe,
        elements,
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
          paymentMethod: checkoutState.paymentMethod,
          freeTrial: checkoutState.freeTrial,
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

      if (!elements || !stripe) throw new Error(`Stripe is not initialized.`)

      // confirm the `SetupIntent` if a payment method was supplied
      // the `setupIntent` has already determined that the card is valid an has sufficient funds
      // free trials will mark the subscription as paid immediately
      await confirmCardPayment({
        subscription,
        elements,
        stripe,
        checkoutState,
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
