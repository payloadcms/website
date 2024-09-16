import type { Subscription, SubscriptionsResult } from '@cloud/_api/fetchSubscriptions.js'
import type { Team } from '@root/payload-cloud-types.js'

import { fetchSubscriptionsClient } from '@cloud/_api/fetchSubscriptions.js'
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { toast } from 'sonner'

import { subscriptionsReducer } from './reducer.js'

export const useSubscriptions = (args: {
  delay?: number
  initialSubscriptions?: SubscriptionsResult | null
  team?: Team | null
}): {
  cancelSubscription: (subscriptionID: string) => void
  error: string
  isLoading: 'deleting' | 'loading' | 'updating' | false | null
  loadMoreSubscriptions: () => void
  refreshSubscriptions: () => void
  result: SubscriptionsResult | null
  updateSubscription: (subscriptionID: string, subscription: Subscription) => void
} => {
  const { delay, initialSubscriptions, team } = args

  const isRequesting = useRef(false)
  const isDeleting = useRef(false)
  const isUpdating = useRef(false)
  const [result, dispatchResult] = useReducer(subscriptionsReducer, initialSubscriptions || null)
  const [isLoading, setIsLoading] = useState<'deleting' | 'loading' | 'updating' | false | null>(
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

        const subscriptions = await fetchSubscriptionsClient({
          starting_after,
          team,
        })

        setTimeout(() => {
          dispatchResult({
            type: starting_after ? 'add' : 'reset',
            payload: subscriptions,
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
          await refreshSubscriptions('Subscription updated successfully')
        } else {
          // @ts-expect-error
          throw new Error(subscription?.message)
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
    [refreshSubscriptions, team],
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

        const req = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team?.id}/subscriptions/${stripeSubscriptionID}`,
          {
            credentials: 'include',
            method: 'DELETE',
          },
        )

        const subscription: Subscription = await req.json()

        if (req.ok) {
          await refreshSubscriptions('Subscription cancelled successfully')
        } else {
          // @ts-expect-error
          throw new Error(subscription?.message)
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
    [refreshSubscriptions, team],
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
      cancelSubscription,
      error,
      isLoading,
      loadMoreSubscriptions,
      refreshSubscriptions,
      result,
      updateSubscription,
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
