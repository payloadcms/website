import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { revalidateCache } from '@cloud/_actions/revalidateCache'
import { fetchPaymentMethod } from '@cloud/_api/fetchPaymentMethod'
import { fetchPaymentMethodsClient } from '@cloud/_api/fetchPaymentMethods'
import type { TeamWithCustomer } from '@cloud/_api/fetchTeam'
import { updateCustomer } from '@cloud/_api/updateCustomer'
import { useElements, useStripe } from '@stripe/react-stripe-js'
import type { PaymentMethod, SetupIntent } from '@stripe/stripe-js'

import { confirmCardSetup } from '../../../new/(checkout)/confirmCardSetup'
import { cardReducer } from './reducer'

type SaveNewPaymentMethod = (paymentMethodID: string) => Promise<SetupIntent | null | undefined>

export const usePaymentMethods = (args: {
  team?: TeamWithCustomer
  delay?: number
  initialValue?: PaymentMethod[] | null | undefined
}): {
  result: PaymentMethod[] | null | undefined
  isLoading: 'loading' | 'saving' | 'deleting' | false | null
  error?: string
  deletePaymentMethod: (paymentMethod: string) => void
  getPaymentMethods: () => void
  saveNewPaymentMethod: SaveNewPaymentMethod
  defaultPaymentMethod: string | undefined
  setDefaultPaymentMethod: React.Dispatch<React.SetStateAction<string | undefined>>
} => {
  const { team, delay, initialValue } = args
  const [defaultPaymentMethod, setDefault] = useState<string | undefined>(() => {
    const teamDefault = team?.stripeCustomer?.invoice_settings?.default_payment_method
    return typeof teamDefault === 'string' ? teamDefault : teamDefault?.id
  })

  const isRequesting = useRef(false)
  const isSavingNew = useRef(false)
  const isDeleting = useRef(false)
  const [result, dispatchResult] = useReducer(cardReducer, initialValue || [])
  const [isLoading, setIsLoading] = useState<'loading' | 'saving' | 'deleting' | false | null>(null)
  const [error, setError] = useState<string | undefined>('')
  const stripe = useStripe()
  const elements = useElements()

  const setDefaultPaymentMethod = useCallback(
    async (paymentMethodID: string) => {
      try {
        const updatedCustomer = await updateCustomer(team, {
          invoice_settings: { default_payment_method: paymentMethodID },
        })

        const newDefault = updatedCustomer?.invoice_settings?.default_payment_method
        setDefault(typeof newDefault === 'string' ? newDefault : newDefault?.id)
        toast.success(`Default payment method updated successfully.`)
      } catch (err: unknown) {
        const message = (err as Error)?.message || 'Something went wrong'
        console.error(message) // eslint-disable-line no-console
        setError(message)
      }
    },
    [team],
  )

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

        const paymentMethods = await fetchPaymentMethodsClient({ team })

        setTimeout(() => {
          dispatchResult({ type: 'RESET_CARDS', payload: paymentMethods || [] })
          setError('')
          setIsLoading(false)
          if (successMessage && doToast) {
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
    if (initialValue) return
    getPaymentMethods()
  }, [getPaymentMethods, initialValue])

  const deletePaymentMethod = useCallback(
    async (paymentMethodID: string) => {
      let timer: NodeJS.Timeout

      if (!paymentMethodID) {
        setError('No payment method')
        return
      }

      if (isDeleting.current) return

      isDeleting.current = true
      setError(undefined)
      setIsLoading('deleting')

      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${team?.id}/payment-methods/${paymentMethodID}`,
          {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )?.then(res => {
          const json = res.json()
          // @ts-expect-error
          if (!res.ok) throw new Error(json?.message)
          return json
        })

        // if this was the default payment method, we need to update the customer
        // only if the customer has another payment method on file
        if (defaultPaymentMethod === paymentMethodID) {
          const withoutDeleted = result?.filter(pm => pm.id !== paymentMethodID)

          const updatedCustomer = await updateCustomer(team, {
            invoice_settings: {
              default_payment_method: withoutDeleted?.[0]?.id || '',
            },
          })

          const newDefaultPaymentMethod = updatedCustomer?.invoice_settings?.default_payment_method

          setDefault(
            typeof newDefaultPaymentMethod === 'string'
              ? newDefaultPaymentMethod
              : newDefaultPaymentMethod?.id,
          )
        }

        dispatchResult({
          type: 'DELETE_CARD',
          payload: paymentMethodID,
        })

        toast.success(`Payment method deleted successfully.`)

        await revalidateCache({
          tag: `team_${team?.slug}`,
        })
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
    [team, result, defaultPaymentMethod],
  )

  const saveNewPaymentMethod: SaveNewPaymentMethod = useCallback(
    async paymentMethodID => {
      if (isRequesting.current) {
        return null
      }

      isSavingNew.current = true
      setError(undefined)
      setIsLoading('saving')

      try {
        const { setupIntent } = await confirmCardSetup({
          team,
          stripe,
          elements,
          paymentMethod: paymentMethodID,
        })

        const pmID =
          typeof setupIntent?.payment_method === 'string'
            ? setupIntent?.payment_method
            : setupIntent?.payment_method?.id || ''

        if (!defaultPaymentMethod) {
          const updatedCustomer = await updateCustomer(team, {
            invoice_settings: {
              default_payment_method: pmID,
            },
          })

          const newDefaultPaymentMethod = updatedCustomer?.invoice_settings?.default_payment_method

          setDefault(
            typeof newDefaultPaymentMethod === 'string'
              ? newDefaultPaymentMethod
              : newDefaultPaymentMethod?.id,
          )
        }

        const newPaymentMethod = await fetchPaymentMethod({ team, paymentMethodID: pmID })

        if (!newPaymentMethod) throw new Error('Could not retrieve new payment method')

        dispatchResult({
          type: 'ADD_CARD',
          payload: newPaymentMethod,
        })

        toast.success(`Payment method added successfully.`)

        await revalidateCache({
          tag: `team_${team?.slug}`,
        })
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        setError(msg)
        setIsLoading(false)
      }

      isSavingNew.current = false
      return null
    },
    [team, elements, stripe, defaultPaymentMethod],
  )

  const memoizedState = useMemo(
    () => ({
      result,
      isLoading,
      error,
      deletePaymentMethod,
      getPaymentMethods,
      saveNewPaymentMethod,
      defaultPaymentMethod,
      setDefaultPaymentMethod,
    }),
    [
      result,
      isLoading,
      error,
      deletePaymentMethod,
      getPaymentMethods,
      saveNewPaymentMethod,
      defaultPaymentMethod,
      setDefaultPaymentMethod,
    ],
  )

  return memoizedState
}
