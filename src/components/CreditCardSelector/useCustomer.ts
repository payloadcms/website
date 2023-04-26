import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// TODO: type this using Stripe module
export interface Customer {
  invoice_settings: {
    default_payment_method: string
  }
}

export const useCustomer = (args: {
  stripeCustomerID?: string
  delay?: number
}): {
  result: Customer | null
  isLoading: boolean | null
  error: string
  refreshCustomer: () => void
} => {
  const { stripeCustomerID, delay } = args
  const isRequesting = useRef(false)
  const [result, setResult] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState<boolean | null>(null)
  const [error, setError] = useState('')

  const getPaymentMethods = useCallback(() => {
    let timer: NodeJS.Timeout

    if (!stripeCustomerID) {
      setError('No customer ID')
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
            stripeMethod: 'customers.retrieve',
            stripeArgs: [stripeCustomerID],
          }),
        })

        const json: {
          data: Customer
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
        setResult(null)
      }

      isRequesting.current = false
    }

    makeRequest()

    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(timer)
    }
  }, [delay, stripeCustomerID])

  useEffect(() => {
    getPaymentMethods()
  }, [getPaymentMethods])

  const refreshCustomer = useCallback(() => {
    getPaymentMethods()
  }, [getPaymentMethods])

  const memoizedState = useMemo(
    () => ({ result, isLoading, error, refreshCustomer }),
    [result, isLoading, error, refreshCustomer],
  )

  return memoizedState
}
