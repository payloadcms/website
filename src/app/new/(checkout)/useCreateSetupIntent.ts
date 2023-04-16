import React, { useCallback } from 'react'

import type { CheckoutState } from '@root/app/new/(checkout)/reducer'
import type { Project } from '@root/payload-cloud-types'

export interface PayloadStripeSetupIntent {
  setup_intent: string
  client_secret?: string

  error?: string
}

export const useCreateSetupIntent = (args: {
  project: Project
  checkoutState: CheckoutState
}): (() => Promise<PayloadStripeSetupIntent>) => {
  const { project, checkoutState } = args

  const isRequesting = React.useRef<boolean>(false)

  const createSetupIntent = useCallback(async (): Promise<PayloadStripeSetupIntent> => {
    const { team } = checkoutState

    try {
      const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/create-setup-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project: project?.id,
          team: team?.id,
        }),
      })

      const res: PayloadStripeSetupIntent = await req.json()
      isRequesting.current = false

      if (!req.ok) {
        throw new Error(res.error)
      }

      isRequesting.current = false
      return res
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      throw new Error(`Could not create setup intent: ${message}`)
    }
  }, [project, checkoutState])

  return createSetupIntent
}
