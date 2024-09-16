import type { InvoicesResult } from '@cloud/_api/fetchInvoices.js'
import type { Team } from '@root/payload-cloud-types.js'

import { fetchInvoicesClient } from '@cloud/_api/fetchInvoices.js'
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { toast } from 'sonner'

const reducer = (
  state: InvoicesResult | null,
  action: {
    payload?: InvoicesResult
    type: 'add' | 'reset'
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
  initialInvoices?: InvoicesResult | null
  team?: Team | null
}): {
  error: string
  isLoading: 'loading' | false | null
  loadMoreInvoices: () => void
  refreshInvoices: () => void
  result: InvoicesResult | null
} => {
  const { delay, initialInvoices, team } = args

  const isRequesting = useRef(false)
  const [result, dispatchResult] = useReducer(reducer, initialInvoices || null)
  const [isLoading, setIsLoading] = useState<'loading' | false | null>(null)
  const [error, setError] = useState('')

  const loadInvoices = useCallback(
    async (successMessage?: string, starting_after?: string) => {
      let timer: NodeJS.Timeout

      if (isRequesting.current) return

      isRequesting.current = true

      try {
        setIsLoading('loading')

        const invoicesRes = await fetchInvoicesClient({
          starting_after,
          team,
        })

        setTimeout(() => {
          dispatchResult({
            type: starting_after ? 'add' : 'reset',
            payload: invoicesRes,
          })

          setError('')
          setIsLoading(false)
          if (successMessage) {
            toast.success(successMessage)
          }
        }, delay)
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
    [delay, team],
  )

  useEffect(() => {
    loadInvoices()
  }, [loadInvoices])

  const refreshInvoices = useCallback(() => {
    loadInvoices()
  }, [loadInvoices])

  const loadMoreInvoices = useCallback(() => {
    if (result?.has_more && result?.data?.length) {
      const lastInvoice = result?.data?.[result?.data?.length - 1]
      const lastInvoiceID = lastInvoice.id
      loadInvoices(undefined, lastInvoiceID)
    }
  }, [loadInvoices, result])

  const memoizedState = useMemo(
    () => ({ error, isLoading, loadMoreInvoices, refreshInvoices, result }),
    [result, isLoading, error, refreshInvoices, loadMoreInvoices],
  )

  return memoizedState
}
