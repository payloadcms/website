import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { toast } from 'react-toastify'

// TODO: type this using the Stripe module
export interface Subscription {
  id: string
  default_payment_method: string
  plan: {
    id: string
    nickname: string
  }
  status: string
  trial_end: number
  items: {
    data: Array<{
      id: string
      price: {
        id: string
        nickname: string
        unit_amount: number
        currency: string
        type: string
        recurring: {
          interval: string
          interval_count: number
        }
        product: string
      }
    }>
  }
  metadata: {
    payload_project_id: string
  }
}

interface SubscriptionsResult {
  data: Subscription[]
  has_more: boolean
}

const reducer = (
  state: SubscriptionsResult | null,
  action: {
    type: 'reset' | 'add'
    payload?: SubscriptionsResult
  },
): SubscriptionsResult | null => {
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

export const useSubscriptions = (args: {
  delay?: number
  stripeCustomerID?: string
}): {
  result: SubscriptionsResult | null
  isLoading: 'loading' | 'updating' | 'deleting' | false | null
  error: string
  refreshSubscriptions: () => void
  updateSubscription: (subscriptionID: string, subscription: Subscription) => void
  cancelSubscription: (subscriptionID: string) => void
  loadMoreSubscriptions: () => void
} => {
  const { delay, stripeCustomerID } = args
  const isRequesting = useRef(false)
  const isDeleting = useRef(false)
  const isUpdating = useRef(false)
  const [result, dispatchResult] = useReducer(reducer, null)
  const [isLoading, setIsLoading] = useState<'loading' | 'updating' | 'deleting' | false | null>(
    null,
  )
  const [error, setError] = useState('')

  const getSubscriptions = useCallback(
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
            stripeMethod: 'subscriptions.list',
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
          data: SubscriptionsResult
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
    getSubscriptions()
  }, [getSubscriptions])

  const refreshSubscriptions = useCallback(
    (successMessage?: string) => {
      getSubscriptions(successMessage)
    },
    [getSubscriptions],
  )

  const updateSubscription = useCallback(
    async (stripeSubscriptionID: string, newSubscription: Subscription) => {
      let timer: NodeJS.Timeout

      if (!stripeSubscriptionID) {
        setError('No subscription ID')
        return
      }

      if (isUpdating.current) return

      isUpdating.current = true

      try {
        setIsLoading('updating')

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
          await refreshSubscriptions('Success, subscription updated')
        } else {
          // @ts-expect-error
          throw new Error(json?.message)
        }
      } catch (err: unknown) {
        const message = (err as Error)?.message || 'Something went wrong'
        setError(message)
        setIsLoading(false)
      }

      isUpdating.current = false

      // eslint-disable-next-line consistent-return
      return () => {
        clearTimeout(timer)
      }
    },
    [refreshSubscriptions],
  )

  const cancelSubscription = useCallback(
    async (stripeSubscriptionID: string) => {
      let timer: NodeJS.Timeout

      if (!stripeSubscriptionID) {
        setError('No subscription ID')
        return
      }

      if (isDeleting.current) return

      isDeleting.current = true

      try {
        setIsLoading('deleting')

        const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/stripe/rest`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stripeMethod: 'subscriptions.del',
            stripeArgs: [
              stripeSubscriptionID,
              {
                invoice_now: true,
                prorate: true,
              },
            ],
          }),
        })

        const json: {
          data: Subscription
        } = await req.json()

        if (req.ok) {
          await refreshSubscriptions('Success, subscription cancelled')
        } else {
          // @ts-expect-error
          throw new Error(json?.message)
        }
      } catch (err: unknown) {
        const message = (err as Error)?.message || 'Something went wrong'
        setError(message)
        setIsLoading(false)
      }

      isDeleting.current = false

      // eslint-disable-next-line consistent-return
      return () => {
        clearTimeout(timer)
      }
    },
    [refreshSubscriptions],
  )

  const loadMoreSubscriptions = useCallback(() => {
    if (result?.has_more && result?.data?.length) {
      const lastSubscription = result?.data?.[result?.data?.length - 1]
      const lastSubscriptionID = lastSubscription.id
      getSubscriptions(undefined, lastSubscriptionID)
    }
  }, [getSubscriptions, result])

  const memoizedState = useMemo(
    () => ({
      result,
      isLoading,
      error,
      refreshSubscriptions,
      updateSubscription,
      cancelSubscription,
      loadMoreSubscriptions,
    }),
    [
      result,
      isLoading,
      error,
      refreshSubscriptions,
      updateSubscription,
      cancelSubscription,
      loadMoreSubscriptions,
    ],
  )

  return memoizedState
}
