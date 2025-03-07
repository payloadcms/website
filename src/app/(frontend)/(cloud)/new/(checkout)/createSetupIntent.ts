import type { Team } from '@root/payload-cloud-types'

export interface PayloadStripeSetupIntent {
  client_secret?: string
  error?: string

  setup_intent: string
}

export const createSetupIntent = async (args: {
  team?: Team
}): Promise<PayloadStripeSetupIntent> => {
  const { team } = args

  try {
    const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/create-setup-intent`, {
      body: JSON.stringify({
        team: team?.id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    const res: PayloadStripeSetupIntent = await req.json()

    if (!req.ok) {
      throw new Error(res.error)
    }
    return res
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    throw new Error(`Could not create setup intent: ${message}`)
  }
}
