import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface Subscription {
  default_payment_method: string
}

export const useGetSubscription = (args: {
  stripeSubscriptionID?: string
  delay?: number
}): {
  result: Subscription | null
  isLoading: boolean | null
  error: string
  refreshSubscription: () => void
} => {
  const { stripeSubscriptionID, delay } = args
  const isRequesting = useRef(false)
  const [result, setResult] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState<boolean | null>(null)
  const [error, setError] = useState('')

  const getPaymentMethods = useCallback(() => {
    let timer: NodeJS.Timeout

    if (!stripeSubscriptionID) {
      setError('No subscription ID')
      setResult(null)
      return
    }

    if (isRequesting.current) return

    isRequesting.current = true

    const makeRequest = async (): Promise<void> => {
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
          data: {
            data: Subscription
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
        setResult(null)
      }

      isRequesting.current = false
    }

    makeRequest()

    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(timer)
    }
  }, [delay, stripeSubscriptionID])

  useEffect(() => {
    getPaymentMethods()
  }, [getPaymentMethods])

  const refreshSubscription = useCallback(() => {
    getPaymentMethods()
  }, [getPaymentMethods])

  const memoizedState = useMemo(
    () => ({ result, isLoading, error, refreshSubscription }),
    [result, isLoading, error, refreshSubscription],
  )

  return memoizedState
}
