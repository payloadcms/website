import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { Team } from '@root/payload-cloud-types.js'

// TODO: type this using the Stripe module
export interface Subscription {
  default_payment_method: string
}

export const useSubscription = (args: {
  stripeSubscriptionID?: string
  team: Team
  delay?: number
  initialValue?: Subscription | null
}): {
  result: Subscription | null | undefined
  isLoading: boolean | null
  error: string
  refreshSubscription: () => void
  updateSubscription: (subscription: Subscription) => void
} => {
  const { stripeSubscriptionID, team, delay, initialValue } = args
  const isRequesting = useRef(false)
  const [result, setResult] = useState<Subscription | null | undefined>(initialValue)
  const [isLoading, setIsLoading] = useState<boolean | null>(null)
  const [error, setError] = useState('')

  const getSubscriptions = useCallback(() => {
    let timer: NodeJS.Timeout

    if (!stripeSubscriptionID) {
      setError('No subscription ID')
      return
    }

    if (isRequesting.current) return

    isRequesting.current = true

    const makeRetrieval = async (): Promise<void> => {
      try {
        setIsLoading(true)

        const req = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team?.id}/subscriptions/${stripeSubscriptionID}`,
          {
            method: 'GET',
            credentials: 'include',
          },
        )

        const subscription: Subscription = await req.json()

        if (req.ok) {
          setTimeout(() => {
            setResult(subscription)
            setError('')
            setIsLoading(false)
          }, delay)
        } else {
          // @ts-expect-error
          throw new Error(json?.message)
        }
      } catch (err: unknown) {
        const message = (err as Error)?.message || 'Something went wrong'
        setError(message)
        setIsLoading(false)
      }

      isRequesting.current = false
    }

    makeRetrieval()

    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(timer)
    }
  }, [delay, stripeSubscriptionID, team?.id])

  useEffect(() => {
    if (initialValue) return
    getSubscriptions()
  }, [getSubscriptions, initialValue])

  const refreshSubscription = useCallback(() => {
    getSubscriptions()
  }, [getSubscriptions])

  const updateSubscription = useCallback(
    (newSubscription: Subscription) => {
      let timer: NodeJS.Timeout

      if (!stripeSubscriptionID) {
        setError('No subscription ID')
        return
      }

      if (isRequesting.current) return

      isRequesting.current = true

      const makeUpdate = async (): Promise<void> => {
        try {
          setIsLoading(true)

          const req = await fetch(
            `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team?.id}/subscriptions/${stripeSubscriptionID}`,
            {
              method: 'PATCH',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newSubscription),
            },
          )

          const subscription: Subscription = await req.json()

          if (req.ok) {
            setTimeout(() => {
              setResult(subscription)
              setError('')
              setIsLoading(false)
            }, delay)
          } else {
            // @ts-expect-error
            throw new Error(json?.message)
          }
        } catch (err: unknown) {
          const message = (err as Error)?.message || 'Something went wrong'
          setError(message)
          setIsLoading(false)
        }

        isRequesting.current = false
      }

      makeUpdate()

      // eslint-disable-next-line consistent-return
      return () => {
        clearTimeout(timer)
      }
    },
    [delay, stripeSubscriptionID, team?.id],
  )

  const memoizedState = useMemo(
    () => ({ result, isLoading, error, refreshSubscription, updateSubscription }),
    [result, isLoading, error, refreshSubscription, updateSubscription],
  )

  return memoizedState
}
