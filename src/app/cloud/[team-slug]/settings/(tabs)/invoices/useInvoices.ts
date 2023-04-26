import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// TODO: type this using the Stripe module
export interface Invoice {
  id: string
  status: string
}

export const useInvoices = (args: {
  delay?: number
  stripeCustomerID?: string
}): {
  result: Invoice[] | null
  isLoading: boolean | null
  error: string
  refreshInvoices: () => void
} => {
  const { delay, stripeCustomerID } = args
  const isRequesting = useRef(false)
  const [result, setResult] = useState<Invoice[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean | null>(null)
  const [error, setError] = useState('')

  const getInvoices = useCallback(() => {
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
            stripeMethod: 'invoices.list',
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
            data: Invoice[]
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
    getInvoices()
  }, [getInvoices])

  const refreshInvoices = useCallback(() => {
    getInvoices()
  }, [getInvoices])

  const memoizedState = useMemo(
    () => ({ result, isLoading, error, refreshInvoices }),
    [result, isLoading, error, refreshInvoices],
  )

  return memoizedState
}
