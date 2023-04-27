import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import QueryString from 'qs'

import type { Project } from '@root/payload-cloud-types'
import type { Subscription, SubscriptionsResult } from './reducer'
import { subscriptionsReducer } from './reducer'

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
  const [result, dispatchResult] = useReducer(subscriptionsReducer, null)
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
          let projects: Project[] | null = null

          try {
            // need to also fetch the projects for associated with the subscriptions
            // then match them up to the corresponding subscription in the reducer
            const query = QueryString.stringify({
              where: {
                stripeSubscriptionID: {
                  in: json.data.data.map(sub => sub.id),
                },
              },
              limit: 100,
            })

            const projectsReq = await fetch(
              `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects?${query}`,
              {
                method: 'GET',
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json',
                },
              },
            )

            const projectsJson: {
              docs: Project[]
            } = await projectsReq.json()

            if (projectsReq.ok) {
              projects = projectsJson.docs
            } else {
              // @ts-expect-error
              throw new Error(projectsJson?.message)
            }
          } catch (err: unknown) {
            throw new Error((err as Error)?.message || 'Something went wrong')
          }

          setTimeout(() => {
            dispatchResult({
              type: starting_after ? 'add' : 'reset',
              payload: {
                subscriptions: json.data,
                projects,
              },
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
          await refreshSubscriptions('Success, subscription canceled')
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
