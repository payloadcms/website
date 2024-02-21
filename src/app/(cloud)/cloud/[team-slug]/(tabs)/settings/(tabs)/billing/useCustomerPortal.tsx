import * as React from 'react'
import { useRouter } from 'next/navigation'

import type { Team } from '@root/payload-cloud-types'

const portalURL = `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/customer-portal`

export const useCustomerPortal = (args: {
  team: Team
  // if you send the subscriptionID, it will open the portal to that subscription
  // this uses the `subscription_cancel` flow in the customer portal
  subscriptionID?: string
  returnURL?: string
  headline?: string
}): {
  openPortalSession: (e: React.MouseEvent<HTMLAnchorElement>) => Promise<void>
  loading: boolean
  error: string | null
} => {
  const {
    team,
    subscriptionID,
    returnURL = `${process.env.NEXT_PUBLIC_SITE_URL}/cloud/${team.slug}/settings/billing`,
    headline = 'Payload Cloud',
  } = args

  const router = useRouter()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)

  const openPortalSession = React.useCallback(
    async (e): Promise<void> => {
      // the href on the anchor is just for accessibility
      e.preventDefault()

      setError(null)
      setLoading(true)

      try {
        const req = await fetch(portalURL, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            team: team.id,
            returnURL,
            subscriptionID,
            headline,
          }),
        })

        const data = await req.json()

        if (req.ok) {
          router.push(data.url)
        } else {
          throw new Error(data?.error || 'Something went wrong')
        }
      } catch (err: unknown) {
        setError(`Something went wrong: ${err}`)
        setLoading(false)
      }
    },
    [team, router, subscriptionID, returnURL, headline],
  )

  return {
    openPortalSession,
    loading,
    error,
  }
}
