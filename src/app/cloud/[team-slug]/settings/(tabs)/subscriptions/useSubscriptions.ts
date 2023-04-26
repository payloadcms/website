import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// TODO: type this using the Stripe module
export interface Subscription {
  id: string
  default_payment_method: string
  plan: {
    id: string
    nickname: string
  }
  status: string
}

export const useSubscriptions = (args: {
  delay?: number
  stripeCustomerID?: string
}): {
  result: Subscription[] | null
  isLoading: boolean | null
  error: string
  refreshSubscriptions: () => void
  updateSubscription: (subscriptionID: string, subscription: Subscription) => void
} => {
  const { delay, stripeCustomerID } = args
  const isRequesting = useRef(false)
  const [result, setResult] = useState<Subscription[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean | null>(null)
  const [error, setError] = useState('')

  const getSubscriptions = useCallback(() => {
    let timer: NodeJS.Timeout

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
            stripeMethod: 'subscriptions.list',
            stripeArgs: [
              {
                customer: stripeCustomerID,
                limit: 100, // TODO: paginate this
              },
            ],
          }),
        })

        const json: {
          data: {
            data: Subscription[]
          }
        } = await req.json()

        if (req.ok) {
          setTimeout(() => {
            setResult(json?.data?.data)
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
  }, [delay, stripeCustomerID])

  useEffect(() => {
    getSubscriptions()
  }, [getSubscriptions])

  const refreshSubscriptions = useCallback(() => {
    getSubscriptions()
  }, [getSubscriptions])

  const updateSubscription = useCallback(
    (stripeSubscriptionID: string, newSubscription: Subscription) => {
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
            await refreshSubscriptions()
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
    [refreshSubscriptions],
  )

  const memoizedState = useMemo(
    () => ({ result, isLoading, error, refreshSubscriptions, updateSubscription }),
    [result, isLoading, error, refreshSubscriptions, updateSubscription],
  )

  return memoizedState
}
