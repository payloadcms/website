import type { Team } from '@root/payload-cloud-types'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// TODO: type this using the Stripe module
export interface Subscription {
  default_payment_method: string
}

export const useSubscription = (args: {
  delay?: number
  initialValue?: null | Subscription
  stripeSubscriptionID?: string
  team: Team
}): {
  error: string
  isLoading: boolean | null
  refreshSubscription: () => void
  result: null | Subscription | undefined
  updateSubscription: (subscription: Subscription) => void
} => {
  const { delay, initialValue, stripeSubscriptionID, team } = args
  const isRequesting = useRef(false)
  const [result, setResult] = useState<null | Subscription | undefined>(initialValue)
  const [isLoading, setIsLoading] = useState<boolean | null>(null)
  const [error, setError] = useState('')

  const getSubscriptions = useCallback(() => {
    let timer: NodeJS.Timeout

    if (!stripeSubscriptionID) {
      setError('No subscription ID')
      return
    }

    if (isRequesting.current) {
      return
    }

    isRequesting.current = true

    const makeRetrieval = async (): Promise<void> => {
      try {
        setIsLoading(true)

        const req = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team?.id}/subscriptions/${stripeSubscriptionID}`,
          {
            credentials: 'include',
            method: 'GET',
          },
        )

        const subscription: Subscription = await req.json()

        if (req.ok) {
          timer = setTimeout(() => {
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

    return () => {
      clearTimeout(timer)
    }
  }, [delay, stripeSubscriptionID, team?.id])

  useEffect(() => {
    if (initialValue) {
      return
    }
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

      if (isRequesting.current) {
        return
      }

      isRequesting.current = true

      const makeUpdate = async (): Promise<void> => {
        try {
          setIsLoading(true)

          const req = await fetch(
            `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team?.id}/subscriptions/${stripeSubscriptionID}`,
            {
              body: JSON.stringify(newSubscription),
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'PATCH',
            },
          )

          const subscription: Subscription = await req.json()

          if (req.ok) {
            timer = setTimeout(() => {
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

      return () => {
        clearTimeout(timer)
      }
    },
    [delay, stripeSubscriptionID, team?.id],
  )

  const memoizedState = useMemo(
    () => ({ error, isLoading, refreshSubscription, result, updateSubscription }),
    [result, isLoading, error, refreshSubscription, updateSubscription],
  )

  return memoizedState
}
