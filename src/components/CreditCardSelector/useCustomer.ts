import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import type { Customer } from '@cloud/_api/fetchTeam'

import type { Team } from '@root/payload-cloud-types'

export type UseCustomer = (args: {
  team?: Team
  delay?: number
  initialCustomer?: Customer | null | undefined
}) => {
  result: Customer | null | undefined
  isLoading: boolean | null
  error: string
  refreshCustomer: () => void
  setDefaultPaymentMethod: (paymentMethodID: string) => void
}

export const useCustomer: UseCustomer = ({ team, delay, initialCustomer }) => {
  const { stripeCustomerID, id: teamID } = team || {}

  const isRequesting = useRef(false)
  const isUpdatingDefault = useRef(false)
  const [result, setResult] = useState<Customer | null | undefined>(initialCustomer)
  const [isLoading, setIsLoading] = useState<boolean | null>(null)
  const [error, setError] = useState('')

  const getCustomer = useCallback(async () => {
    let timer: NodeJS.Timeout

    if (!stripeCustomerID) {
      console.error('No customer ID') // eslint-disable-line no-console
      setError('No customer ID')
      return
    }

    if (isRequesting.current) return

    isRequesting.current = true
    setIsLoading(true)
    setError('')

    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${teamID}/customer`,
        {
          method: 'GET',
          credentials: 'include',
        },
      )

      const json: Customer & {
        message?: string
      } = await req.json()

      if (req.ok) {
        setTimeout(() => {
          setResult(json)
          setError('')
          setIsLoading(false)
        }, delay)
      } else {
        throw new Error(json?.message)
      }
    } catch (err: unknown) {
      const message = (err as Error)?.message || 'Something went wrong'
      setError(message)
      setIsLoading(false)
      setResult(null)
    }

    isRequesting.current = false

    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(timer)
    }
  }, [delay, stripeCustomerID, teamID])

  useEffect(() => {
    if (initialCustomer) return
    getCustomer()
  }, [getCustomer, initialCustomer])

  const refreshCustomer = useCallback(() => {
    getCustomer()
  }, [getCustomer])

  const setDefaultPaymentMethod = useCallback(
    async (paymentMethodID: string) => {
      if (isUpdatingDefault.current) return

      isUpdatingDefault.current = true
      setIsLoading(true)
      setError('')

      try {
        const req = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/teams/${teamID}/customer`,
          {
            method: 'PATCH',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              invoice_settings: { default_payment_method: paymentMethodID },
            }),
          },
        )

        const customer: Customer = await req.json()

        if (req.ok) {
          setTimeout(() => {
            setResult(customer)
            setError('')
            toast.success(`Default payment method updated successfully`)
            setIsLoading(false)
          }, delay)
        } else {
          // @ts-expect-error
          throw new Error(customer?.message)
        }
      } catch (err: unknown) {
        const message = (err as Error)?.message || 'Something went wrong'
        setError(message)
        setIsLoading(false)
        setResult(null)
      }

      isUpdatingDefault.current = false
    },
    [delay, teamID],
  )

  const memoizedState = useMemo(
    () => ({ result, isLoading, error, refreshCustomer, setDefaultPaymentMethod }),
    [result, isLoading, error, refreshCustomer, setDefaultPaymentMethod],
  )

  return memoizedState
}
