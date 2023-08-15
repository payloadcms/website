import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useElements, useStripe } from '@stripe/react-stripe-js'
import type { PaymentMethod, SetupIntentResult } from '@stripe/stripe-js'

import type { Team } from '@root/payload-cloud-types'
import { confirmCardSetup } from '../../../new/(checkout)/confirmCardSetup'

export const usePaymentMethods = (args: {
  team?: Team
  delay?: number
}): {
  result: PaymentMethod[] | null | undefined
  isLoading: 'loading' | 'saving' | 'deleting' | false | null
  error?: string
  deletePaymentMethod: (paymentMethod: string) => void
  getPaymentMethods: () => void
  saveNewPaymentMethod: (paymentMethod: string) => Promise<SetupIntentResult | null>
} => {
  const { team, delay } = args
  const isRequesting = useRef(false)
  const isSavingNew = useRef(false)
  const isDeleting = useRef(false)
  const [result, setResult] = useState<PaymentMethod[] | null | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<'loading' | 'saving' | 'deleting' | false | null>(null)
  const [error, setError] = useState<string | undefined>('')
  const stripe = useStripe()
  const elements = useElements()

  const getPaymentMethods = useCallback(
    async (successMessage?: string, doToast = true) => {
      let timer: NodeJS.Timeout

      if (!team?.stripeCustomerID) {
        setError('No customer ID')
        return
      }

      if (isRequesting.current) return

      isRequesting.current = true

      try {
        setIsLoading('loading')

        const req = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team.id}/payment-methods`,
          {
            method: 'GET',
            credentials: 'include',
          },
        )

        const json: {
          data: PaymentMethod[]
          message?: string
        } = await req.json()

        if (req.ok) {
          setTimeout(() => {
            setResult(json?.data || null)
            setError('')
            setIsLoading(false)
            if (successMessage && doToast) {
              toast.success(successMessage)
            }
          }, delay)
        } else {
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
    [delay, team?.stripeCustomerID, team?.id],
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
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team?.id}/payment-methods/${paymentMethod}`,
          {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        const json = await req.json()

        if (req.ok) {
          await getPaymentMethods('Payment method deleted successfully')
        } else {
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
    [getPaymentMethods, team?.id],
  )

  const saveNewPaymentMethod = useCallback(
    async (paymentMethod, doToast = true): Promise<SetupIntentResult | null> => {
      if (isRequesting.current) {
        return null
      }

      isSavingNew.current = true
      setError(undefined)
      setIsLoading('saving')

      try {
        const setupIntent = await confirmCardSetup({
          team,
          stripe,
          elements,
          paymentMethod,
        })

        await getPaymentMethods('Payment method saved successfully', doToast)
        return setupIntent
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        setError(msg)
        setIsLoading(false)
      }

      isSavingNew.current = false
      return null
    },
    [getPaymentMethods, team, elements, stripe],
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
