import type { Subscription, SubscriptionsResult } from '@cloud/_api/fetchSubscriptions'
import type { Team } from '@root/payload-cloud-types'

import { fetchSubscriptionsClient } from '@cloud/_api/fetchSubscriptions'
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { toast } from 'sonner'

import { subscriptionsReducer } from './reducer'

export const useSubscriptions = (args: {
  delay?: number
  initialSubscriptions?: null | SubscriptionsResult
  team?: null | Team
}): {
  cancelSubscription: (subscriptionID: string) => void
  error: string
  isLoading: 'deleting' | 'loading' | 'updating' | false | null
  loadMoreSubscriptions: () => void
  refreshSubscriptions: () => void
  result: null | SubscriptionsResult
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

      if (isRequesting.current) {
        return
      }

      isRequesting.current = true

      try {
        setIsLoading('loading')

        const subscriptions = await fetchSubscriptionsClient({
          starting_after,
          team,
        })

        timer = setTimeout(() => {
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
      if (!stripeSubscriptionID) {
        setError('No subscription ID')
        return
      }

      if (isUpdating.current) {
        return
      }

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
    },
    [refreshSubscriptions, team],
  )

  const cancelSubscription = useCallback(
    async (stripeSubscriptionID: string) => {
      if (!stripeSubscriptionID) {
        setError('No subscription ID')
        return
      }

      if (isDeleting.current) {
        return
      }

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
