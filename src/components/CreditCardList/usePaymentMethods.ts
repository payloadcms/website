import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import type { PaymentMethod } from '@stripe/stripe-js'

import { useConfirmCardSetup } from '@root/app/new/(checkout)/useConfirmCardSetup'
import type { Team } from '@root/payload-cloud-types'

export const usePaymentMethods = (args: {
  team?: Team
  delay?: number
}): {
  result: PaymentMethod[] | null | undefined
  isLoading: 'loading' | 'saving' | 'deleting' | false | null
  error?: string
  deletePaymentMethod: (paymentMethod: string) => void
  getPaymentMethods: () => void
  saveNewPaymentMethod: (paymentMethod: string) => void
} => {
  const { team, delay } = args
  const isRequesting = useRef(false)
  const isSavingNew = useRef(false)
  const isDeleting = useRef(false)
  const [result, setResult] = useState<PaymentMethod[] | null | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<'loading' | 'saving' | 'deleting' | false | null>(null)
  const [error, setError] = useState<string | undefined>('')

  const confirmCardSetup = useConfirmCardSetup({
    team,
  })

  const getPaymentMethods = useCallback(
    async (successMessage?: string) => {
      let timer: NodeJS.Timeout

      if (!team?.stripeCustomerID) {
        setError('No customer ID')
        return
      }

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
            stripeMethod: 'customers.listPaymentMethods',
            stripeArgs: [
              team?.stripeCustomerID,
              {
                type: 'card',
                limit: 100, // TODO: paginate this
              },
            ],
          }),
        })

        const json: {
          data: {
            data: PaymentMethod[]
          }
        } = await req.json()

        if (req.ok) {
          setTimeout(() => {
            setResult(json?.data?.data || null)
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
    [delay, team?.stripeCustomerID],
  )

  useEffect(() => {
    getPaymentMethods()
  }, [getPaymentMethods])

  const deletePaymentMethod = useCallback(
    async (paymentMethod: string) => {
      let timer: NodeJS.Timeout

      if (!paymentMethod) {
        setError('No payment method')
        return
      }

      if (isDeleting.current) return

      isDeleting.current = true
      setError(undefined)
      setIsLoading('deleting')

      try {
        const req = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/stripe/rest`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stripeMethod: 'paymentMethods.detach',
            stripeArgs: [paymentMethod],
          }),
        })

        const json: {
          data: {
            data: PaymentMethod[]
          }
        } = await req.json()

        if (req.ok) {
          await getPaymentMethods('Payment method deleted successfully')
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
    [getPaymentMethods],
  )

  const saveNewPaymentMethod = useCallback(
    async (paymentMethod: string) => {
      if (isRequesting.current) {
        return
      }

      isSavingNew.current = true
      setError(undefined)
      setIsLoading('saving')

      try {
        await confirmCardSetup(paymentMethod)
        await getPaymentMethods('Payment method saved successfully')
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        setError(msg)
        setIsLoading(false)
      }

      isSavingNew.current = false
    },
    [confirmCardSetup, getPaymentMethods],
  )

  const memoizedState = useMemo(
    () => ({
      result,
      isLoading,
      error,
      deletePaymentMethod,
      getPaymentMethods,
      saveNewPaymentMethod,
    }),
    [result, isLoading, error, deletePaymentMethod, getPaymentMethods, saveNewPaymentMethod],
  )

  return memoizedState
}
