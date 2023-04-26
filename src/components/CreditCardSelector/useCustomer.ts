import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'

// TODO: type this using Stripe module
export interface Customer {
  invoice_settings: {
    default_payment_method: string
  }
}

export type UseCustomer = (args: { stripeCustomerID?: string; delay?: number }) => {
  result: Customer | null
  isLoading: boolean | null
  error: string
  refreshCustomer: () => void
  setDefaultPaymentMethod: (paymentMethodID: string) => void
}

export const useCustomer: UseCustomer = ({ stripeCustomerID, delay }) => {
  const isRequesting = useRef(false)
  const isUpdatingDefault = useRef(false)
  const [result, setResult] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState<boolean | null>(null)
  const [error, setError] = useState('')

  const getPaymentMethods = useCallback(async () => {
    let timer: NodeJS.Timeout

    if (!stripeCustomerID) {
      setError('No customer ID')
      return
    }

    if (isRequesting.current) return

    isRequesting.current = true
    setIsLoading(true)
    setError('')

    try {
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

  const setDefaultPaymentMethod = useCallback(
    async (paymentMethodID: string) => {
      if (isUpdatingDefault.current) return

      isUpdatingDefault.current = true
      setIsLoading(true)
      setError('')

      try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/stripe/rest`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stripeMethod: 'customers.update',
            stripeArgs: [
              stripeCustomerID,
              { invoice_settings: { default_payment_method: paymentMethodID } },
            ],
          }),
        })

        const json: {
          data: Customer
        } = await req.json()

        if (req.ok) {
          setTimeout(() => {
            setResult(json?.data)
            setError('')
            toast.success('Success, default payment method updated')
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

      isUpdatingDefault.current = false
    },
    [delay, stripeCustomerID],
  )

  const memoizedState = useMemo(
    () => ({ result, isLoading, error, refreshCustomer, setDefaultPaymentMethod }),
    [result, isLoading, error, refreshCustomer, setDefaultPaymentMethod],
  )

  return memoizedState
}
