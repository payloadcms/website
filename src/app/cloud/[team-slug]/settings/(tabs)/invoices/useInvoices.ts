import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { toast } from 'react-toastify'

// TODO: type this using the Stripe module
export interface Invoice {
  id: string
  status: string
}

interface InvoicesResult {
  data: Invoice[]
  has_more: boolean
}

const reducer = (
  state: InvoicesResult | null,
  action: {
    type: 'reset' | 'add'
    payload?: InvoicesResult
  },
): InvoicesResult | null => {
  switch (action.type) {
    case 'reset':
      return action.payload || null
    case 'add':
      if (!state) return action.payload || null
      return {
        data: [...state.data, ...(action.payload?.data || [])],
        has_more: action.payload?.has_more || false,
      }
    default:
      return state
  }
}

export const useInvoices = (args: {
  delay?: number
  stripeCustomerID?: string
}): {
  result: InvoicesResult | null
  isLoading: 'loading' | false | null
  error: string
  refreshInvoices: () => void
  loadMoreInvoices: () => void
} => {
  const { delay, stripeCustomerID } = args
  const isRequesting = useRef(false)
  const [result, dispatchResult] = useReducer(reducer, null)
  const [isLoading, setIsLoading] = useState<'loading' | false | null>(null)
  const [error, setError] = useState('')

  const getInvoices = useCallback(
    async (successMessage?: string, starting_after?: string) => {
      let timer: NodeJS.Timeout

      if (isRequesting.current) return

      isRequesting.current = true

      try {
        setIsLoading('loading')

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
                starting_after,
                limit: 10,
              },
            ],
          }),
        })

        const json: {
          data: InvoicesResult
        } = await req.json()

        if (req.ok) {
          setTimeout(() => {
            dispatchResult({
              type: 'add',
              payload: json.data,
            })
            setError('')
            setIsLoading(false)
            if (successMessage) {
              toast.success(successMessage)
            }
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

      // eslint-disable-next-line consistent-return
      return () => {
        clearTimeout(timer)
      }
    },
    [delay, stripeCustomerID],
  )

  useEffect(() => {
    getInvoices()
  }, [getInvoices])

  const refreshInvoices = useCallback(() => {
    getInvoices()
  }, [getInvoices])

  const loadMoreInvoices = useCallback(() => {
    if (result?.has_more && result?.data?.length) {
      const lastInvoice = result?.data?.[result?.data?.length - 1]
      const lastInvoiceID = lastInvoice.id
      getInvoices(undefined, lastInvoiceID)
    }
  }, [getInvoices, result])

  const memoizedState = useMemo(
    () => ({ result, isLoading, error, refreshInvoices, loadMoreInvoices }),
    [result, isLoading, error, refreshInvoices, loadMoreInvoices],
  )

  return memoizedState
}
