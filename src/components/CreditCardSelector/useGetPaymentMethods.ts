import { useEffect, useMemo, useRef, useState } from 'react'
import type { PaymentMethod } from '@stripe/stripe-js'

import type { Team } from '@root/payload-cloud-types'

export const useGetPaymentMethods = (args: {
  team?: Team
  delay?: number
}): {
  result: PaymentMethod[]
  isLoading: boolean | null
  error: string
} => {
  const { team, delay } = args
  const isRequesting = useRef(false)
  const [result, setResult] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState<boolean | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (!team?.stripeCustomerID) {
      setError('No customer ID')
      return
    }

    if (isRequesting.current) return

    isRequesting.current = true

    const makeRequest = async (): Promise<void> => {
      try {
        setIsLoading(true)

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
            setResult(json?.data?.data)
            setError('')
            setIsLoading(false)
          }, delay)
        } else {
          // @ts-expect-error
          setError(json?.message || 'Something went wrong')
        }
      } catch (err: unknown) {
        const message = (err as Error)?.message || 'Something went wrong'
        setError(message)
        setIsLoading(false)
      }

      isRequesting.current = false
    }

    makeRequest()

    // eslint-disable-next-line consistent-return
    return () => {
      clearTimeout(timer)
    }
  }, [delay, team?.stripeCustomerID])

  const memoizedState = useMemo(() => ({ result, isLoading, error }), [result, isLoading, error])

  return memoizedState
}
