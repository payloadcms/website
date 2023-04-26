import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// TODO: type this using the Stripe module
export interface Subscription {
  default_payment_method: string
}

export const useSubscription = (args: {
  stripeSubscriptionID?: string
  delay?: number
}): {
  result: Subscription | null
  isLoading: boolean | null
  error: string
  refreshSubscription: () => void
  updateSubscription: (subscription: Subscription) => void
} => {
  const { stripeSubscriptionID, delay } = args
  const isRequesting = useRef(false)
  const [result, setResult] = useState<Subscription | null>(null)
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

        const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/stripe/rest`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stripeMethod: 'subscriptions.retrieve',
            stripeArgs: [stripeSubscriptionID],
          }),
        })

        const json: {
          data: Subscription
        } = await req.json()

        if (req.ok) {
          setTimeout(() => {
            setResult(json?.data)
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
  }, [delay, stripeSubscriptionID])

  useEffect(() => {
    getSubscriptions()
  }, [getSubscriptions])

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

          const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/stripe/rest`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              stripeMethod: 'subscriptions.update',
              stripeArgs: [stripeSubscriptionID, newSubscription],
            }),
          })

          const json: {
            data: Subscription
          } = await req.json()

          if (req.ok) {
            setTimeout(() => {
              setResult(json?.data)
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
    [delay, stripeSubscriptionID],
  )

  const memoizedState = useMemo(
    () => ({ result, isLoading, error, refreshSubscription, updateSubscription }),
    [result, isLoading, error, refreshSubscription, updateSubscription],
  )

  return memoizedState
}
